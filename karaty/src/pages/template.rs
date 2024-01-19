use crate::{
    components::{footer::Footer, markdown::Markdown, nav::Navbar},
    utils::{self, data::GlobalData},
};
use dioxus::{prelude::*, rsx::Segment};
use dioxus_retrouter::use_route;
use karaty_blueprint::{SharedUtility, TemplateData, TemplateDataType, TemplatePathData, Value};
use regex::Regex;
use std::{collections::HashMap, path::PathBuf};

use super::error::{Error, PageNotFound};

#[derive(Props, PartialEq)]
pub struct DynamicTemplateProps {
    path: String,
    name: String,
    file: String,
    config: HashMap<String, Value>,
    # [props (!optional)]
    template: String,
}

pub fn DynamicTemplate(cx: Scope<DynamicTemplateProps>) -> Element {
    let global = cx.consume_context::<GlobalData>().unwrap();
    let route = use_route(&cx);

    let bind_path = cx.props.path.clone();
    let access_path = route.url().path();

    let mut file_path: Vec<&str> = cx.props.file.split('/').collect();
    let mut data: Option<&TemplateData> = global.data.get(file_path.remove(0));
    for i in file_path {
        let mut name = i.to_string();
        let re = Regex::new(r"\{([^}]*)\}").unwrap();
        for value in re.captures_iter(i) {
            let sign = &value[1];
            let seg = route.segment(&sign);
            if let Some(seg) = seg {
                name = name.replace(&format!("{{{sign}}}"), seg);
            }
        }

        if data.is_none() {
            break;
        }
        let temp = data.unwrap();
        if let TemplateData::Directory(d) = temp {
            data = d.get(&name);
        }
    }

    if data.is_none() {
        return cx.render(rsx! { crate::pages::error::PageNotFound { } });
    }
    let data = data.unwrap().clone();

    let global = cx.consume_context::<GlobalData>().unwrap();
    let template_config = global.template_config;

    let suffix = {
        let name = &cx.props.name;
        if PathBuf::from(name).extension().is_some() {
            cx.props.name.split(".").last().unwrap()
        } else {
            "#dir"
        }
    };
    let template = cx.props.template.clone();

    let file_type_default = template_config.default.file_type;
    let default_template = file_type_default
        .get(suffix)
        .unwrap_or(&String::new())
        .clone();

    let template = if template.is_empty() {
        default_template
    } else {
        template
    };

    let templates = cx.use_hook(|| utils::template_loader::loader());

    let using_component = {
        let mut namespace: Vec<&str> = template.split("::").collect();
        let module = if namespace.len() == 1 {
            templates.get("karaty_template").unwrap()
        } else {
            let module = namespace.remove(0);
            let temp = templates.get(module);
            if temp.is_some() {
                temp.unwrap()
            } else {
                namespace.insert(0, module);
                templates.get("karaty_template").unwrap()
            }
        };
        let name = format!("{}", namespace.join("::"));
        let mut value = module.load(&name, TemplateDataType::from_string(suffix));
        if value.is_none() {
            value = module.load(&name, TemplateDataType::Any);
        }
        value
    };

    if let Some(using_component) = using_component {
        let using_component = using_component.clone();

        let mut renderers: HashMap<String, fn(Scope<karaty_blueprint::RendererProps>) -> Element> =
            HashMap::new();
        renderers.insert("markdown".to_string(), Markdown);

        let utility = SharedUtility {
            navbar: Navbar,
            footer: Footer,
            _404: PageNotFound,
            error: Error,
            renderers,
            app_config: global.config.clone(),
        };

        let index_list = bind_path
            .to_string()
            .trim_start_matches('/')
            .split('/')
            .filter(|segment| segment.starts_with(':'))
            .map(|segment| segment[1..].to_string())
            .collect::<Vec<String>>();
        let mut segments = HashMap::new();
        for i in index_list {
            let value = route.segment(&i);
            if let Some(value) = value {
                segments.insert(i, value.to_string());
            }
        }

        let path = TemplatePathData {
            bind: bind_path.to_string(),
            access: access_path.to_string(),
            segments,
        };

        cx.render(rsx! {
            div {
                using_component {
                    path: path,
                    data: data,
                    utility: utility,
                    config: cx.props.config.clone(),
                }
            }
        })
    } else {
        cx.render(rsx! {
            crate::pages::error::PageNotFound {}
        })
    }
}
