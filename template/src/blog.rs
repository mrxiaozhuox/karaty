use std::collections::HashMap;

use dioxus::prelude::*;
use karaty_blueprint::Value;
use karaty_blueprint::{TemplateData, TemplateDataType, TemplateProps, Templates};

#[derive(Debug, Clone, Default, PartialEq)]
pub struct PostInfo {
    pub title: String,
    pub tags: Vec<String>,
    pub category: Option<String>,
    pub date: String,
    pub path: String,
    pub content: String,
    pub sub_group: Vec<String>,
}

#[allow(non_snake_case)]
pub fn BlogListPreset(cx: Scope<TemplateProps>) -> Element {
    let data_list = &cx.props.data;
    if let TemplateData::Directory(data) = data_list {
        let link = cx
            .props
            .config
            .get("content-link")
            .unwrap_or(&Value::String(cx.props.route.bound_path.clone()))
            .as_str()
            .unwrap_or(&cx.props.route.bound_path)
            .to_string();
        let site_title = cx.props.utility.app_config.site.name.clone();
        let v = to_info(data.clone());
        let v = sort_by_date(v);
        let list = v.iter().map(|v| {
            let category = v.category.clone().unwrap_or("Default".to_string());
            let tags = v.tags.iter().map(|tag| {
                rsx! {
                    span { class: "text-xs mr-1 inline-block py-1 px-2.5 \
                    leading-none text-center whitespace-nowrap align-baseline \
                    font-bold bg-gray-700 text-white rounded",
                        "{tag}"
                    }
                }
            });
            let link = format!("{link}/{}", &v.path);
            rsx! {
                dioxus_retrouter::Link { to: "{link}",
                    h1 { class: "text-3xl font-bold text-gray-500 hover:text-gray-900 \
                    dark:text-gray-100 dark:hover:text-white",
                        "{v.title}"
                    }
                    p { class: "text-gray-400 dark:text-gray-100", "{v.date} & {category}" }
                    p { class: "mt-2", tags }
                    hr { class: "mt-2 mb-4" }
                }
            }
        });
        let Navbar = cx.props.utility.navbar;
        let Footer = cx.props.utility.footer;
        cx.render(rsx! {
            section { class: "bg-cover bg-white dark:bg-gray-900 dark:text-white",
                Navbar {}
                div { class: "flex h-full w-full items-center justify-center px-8",
                    div { class: "max-w-5xl text-center w-[60%]",
                        h1 { class: "text-xl font-bold", "~ {site_title} ~" }
                        div { class: "mt-6", list }
                        Footer {}
                    }
                }
            }
        })
    } else {
        let display_error = cx.props.utility.error;
        cx.render(rsx! {
            display_error {
                title: format!("Unrecognized data type"),
                content: format!("blog::list template must load by Directory data-type")
            }
        })
    }
}

#[allow(non_snake_case)]
pub fn BlogContentPreset(cx: Scope<TemplateProps>) -> Element {
    let Markdown = cx.props.utility.renderers.get("markdown").unwrap().clone();
    let Footer = cx.props.utility.footer;
    let Navbar = cx.props.utility.navbar;
    let Giscus = cx.props.utility.giscus;
    let Error = cx.props.utility.error;

    let data = &cx.props.data;
    let mut temp = HashMap::new();
    temp.insert("self".to_string(), data.clone());
    let info = to_info(temp);

    match info.get(0) {
        Some(info) => {
            let content = info.content.clone();

            let category = info.category.clone().unwrap_or("Default".to_string());

            let tags = info.tags.iter().map(|tag| {
                rsx! {
                    span {
                        class: "text-xs mr-1 inline-block py-1 px-2.5 \
                            leading-none text-center whitespace-nowrap align-baseline \
                            font-bold bg-gray-700 text-white rounded",
                        "{tag}"
                    }
                }
            });

            cx.render(rsx! {
                section { class: "bg-cover bg-white dark:bg-gray-900 dark:text-white",
                    Navbar {}
                    div { class: "md:flex h-full w-full justify-center px-6",
                        div { class: "max-w-5xl w-[100%] sm:w-[60%]",
                            h1 { class: "text-4xl font-bold text-gray-600 dark:text-white",
                                "{info.title}"
                            }
                            p { class: "mt-1 text-gray-400 dark:text-gray-200", "{info.date} & {category}" }
                            hr { class: "mt-2" }
                            div {
                                class: "prose mt-4 dark:text-white dark:prose-invert",
                                Markdown {
                                    content: content.clone(),
                                    config: Default::default(),
                                }
                            }
                            hr { class: "mt-4" }
                            p { class: "mt-4", tags }
                            Giscus {}
                            div { class: "giscus flex justify-center container mx-auto my-12" }
                            Footer {}
                        }
                    }
                }
            })
        }
        None => cx.render(rsx! {
            Error {
                title: "content not found".to_string(),
                content: "404 Not Found".to_string(),
            }
        }),
    }
}

fn to_info(data: HashMap<String, TemplateData>) -> Vec<PostInfo> {
    let mut result = vec![];
    for (file_name, data) in data {
        if let TemplateData::File(meta_info) = data {
            let mut type_mark = HashMap::new();

            type_mark.insert("title".into(), "string");
            type_mark.insert("tags".into(), "array");
            type_mark.insert("category".into(), "string");
            type_mark.insert("date".into(), "string");
            type_mark.insert("released".into(), "bool");

            let temp = markdown_meta_parser::MetaData {
                content: meta_info,
                required: vec!["title".to_string()],
                type_mark,
            }
            .parse()
            .ok();

            if temp.is_none() {
                continue;
            }
            let (meta_info, content) = temp.unwrap();

            if meta_info.get("released").is_some()
                && meta_info
                    .get("released")
                    .unwrap()
                    .clone()
                    .as_bool()
                    .unwrap()
                    == false
            {
                continue;
            }

            let title = meta_info.get("title").unwrap().clone();

            let date = meta_info.get("date");
            let date = if let Some(d) = date {
                d.clone().as_string().unwrap()
            } else {
                "".to_string()
            };

            let tags = meta_info.get("tags");
            let tags = if let Some(v) = tags {
                v.clone().as_array().unwrap()
            } else {
                vec![]
            };

            let category = meta_info.get("category");
            let category = if let Some(v) = category {
                v.clone().as_string()
            } else {
                None
            };

            let title = title.as_string().unwrap();

            let path = file_name.split(".").collect::<Vec<&str>>();
            let path = path[0..path.len() - 1].to_vec();
            let path = path.join(".");

            let blog_info = PostInfo {
                title,
                tags,
                category,
                date,
                path: path.clone(),
                content,
                sub_group: Default::default(),
            };
            result.push(blog_info);
        } else {
            continue;
        }
    }
    result
}

fn sort_by_date(mut data: Vec<PostInfo>) -> Vec<PostInfo> {
    data.sort_by(|a, b| {
        let a_date = chrono::NaiveDate::parse_from_str(&a.date, "%Y-%m-%d");
        let b_date = chrono::NaiveDate::parse_from_str(&b.date, "%Y-%m-%d");
        if a_date.is_ok() && b_date.is_ok() {
            return b_date.unwrap().cmp(&a_date.unwrap());
        }
        std::cmp::Ordering::Equal
    });
    data
}

pub fn export() -> Templates {
    let mut templates = Templates::new();

    templates.template(
        "list",
        vec![TemplateDataType::DirectoryData],
        BlogListPreset,
    );
    templates.template(
        "content",
        vec![TemplateDataType::Markdown],
        BlogContentPreset,
    );

    templates
}
