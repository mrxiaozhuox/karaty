use crate::{
    components::{footer::Footer, giscus::GiscusWithConfig, loading::Loading, markdown::Markdown, nav::Navbar},
    utils::data::GlobalData,
};
use dioxus::prelude::*;
use dioxus_retrouter::use_route;
use karaty_blueprint::{SharedUtility, TemplateData, TemplateDataType, TemplateRouteData, Value};
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

    let file_path: Vec<&str> = cx.props.file.split('/').collect();
    let application_config = global.config.clone();
    let file_path = { 
        let mut path = String::new();
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
            path.push_str(&format!("/{name}"));
        }
        path
    };
    let data = use_future(&cx, (), |_| async move {
        let mut file_path = file_path.clone();
        if file_path.starts_with('/') {
            let mut bp = file_path.into_bytes();
            bp.remove(0);
            file_path = String::from_utf8(bp).unwrap();
        }
        if PathBuf::from(&file_path).extension().is_some() {
            let v = crate::utils::data::load_from_source(&application_config, &file_path).await;
            v.map(|v| TemplateData::File(v))
        } else {
            let dirs = crate::utils::data::load_content_list(&application_config, &file_path).await;
            let dirs = dirs
                .iter()
                .map(|v| (v.0.clone(), format!("{file_path}/{}", v.1)))
                .collect();
            let dir = crate::utils::data::load_page_from_dir(&application_config, dirs).await;
            dir
        }
    });
    match data.value() {
        Some(Ok(data)) => {

            let data = data.clone();

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

            let templates = global.templates;

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
                    giscus: GiscusWithConfig,
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

                let queries = route.url().query_pairs().map(|v| {
                    (v.0.to_string(), v.1.to_string())
                }).collect::<HashMap<String, String>>();
                
                let path = TemplateRouteData {
                    bound_path: bind_path.to_string(),
                    access_path: access_path.to_string(),
                    segments,
                    queries,
                };

                cx.render(rsx! {
                    div {
                        using_component {
                            route: path,
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
        },
        Some(Err(err)) => cx.render(rsx! { format!("{:?}", err) }),
        None => {
            return cx.render(rsx! {
                Loading {}
            });
        },
    }
}
