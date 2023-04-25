use std::collections::HashMap;

use dioxus::prelude::*;
use dioxus_router::{use_route, Link};

use crate::{
    components::{footer::Footer, nav::Navbar},
    config::Config,
    pages::_404,
    utils::{
        data::{load_content_list, load_from_source, GlobalData},
        markdown::parse_markdown,
    },
};

#[allow(dead_code)]
const BLOG_REPO: &'static str = "mrxiaozhuox/blog.mrxzx.info";

pub fn BlogList(cx: Scope) -> Element {
    let global = cx.consume_context::<GlobalData>().unwrap();
    let config = global.config;

    let list_config = config.clone();
    let list = use_future(&cx, (), |_| async move {
        let res = get_blog_list(&list_config).await;
        let res = if let Some(v) = res { v } else { vec![] };
        res
    });

    let site_title = config.site.name;

    match list.value() {
        Some(v) => {
            let list = v.iter().map(|v| {

                let category = v.category.clone().unwrap_or("Default".to_string()); 

                let tags = v.tags.iter().map(|tag| {
                    rsx! {
                        span { class: "text-xs mr-1 inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-gray-700 text-white rounded",
                            "{tag}"
                        }
                    }
                });

                rsx! {
                    Link { to: "/blog/{v.path}",
                        h1 { class: "text-3xl font-bold text-gray-500 hover:text-gray-600 dark:text-gray-200 dark:hover:text-white",
                            "{v.title}"
                        }
                        p { class: "text-gray-400 dark:text-gray-100", "{v.date} & {category}" }
                        p { class: "mt-2", tags }
                        hr { class: "mt-2" }
                    }
                }
            });
            cx.render(rsx! {
                section { class: "bg-cover bg-white dark:bg-gray-600 dark:text-white",
                    Navbar {}
                    div { class: "flex h-full w-full items-center justify-center container mx-auto px-8",
                        div { class: "max-w-5xl text-center",
                            h1 { class: "text-xl font-bold", "" {site_title} "" }
                            div { class: "mt-6", list }
                            Footer {}
                        }
                    }
                }
            })
        }
        None => cx.render(rsx! {
            section { class: "bg-cover bg-white dark:bg-gray-600 dark:text-white",
                Navbar {}
                div { class: "flex h-full w-full items-center justify-center container mx-auto px-8",
                    div { class: "max-w-5xl text-center",
                        "Loading..."
                        Footer {}
                    }
                }
            }
        }),
    }
}

#[derive(Debug)]
struct BlogInfo {
    pub title: String,
    pub tags: Vec<String>,
    pub category: Option<String>,
    pub date: String,
    pub path: String,
}

async fn get_blog_list(config: &Config) -> Option<Vec<BlogInfo>> {
    let data = load_content_list(config, "posts").await;

    let mut result = vec![];

    for file_name in data {
        log::info!("{}", file_name);
        if file_name == "_template.md" {
            continue;
        }

        let meta_info = load_from_source(config, &format!("/posts/{file_name}")).await;
        if meta_info.is_err() {
            continue;
        }
        let meta_info = meta_info.unwrap();

        let mut type_mark = HashMap::new();

        type_mark.insert("title".into(), "string");
        type_mark.insert("tags".into(), "array");
        type_mark.insert("category".into(), "string");
        type_mark.insert("date".into(), "string");
        type_mark.insert("released".into(), "bool");

        let (meta_info, _) = markdown_meta_parser::MetaData {
            content: meta_info,
            required: vec!["title".to_string()],
            type_mark,
        }
        .parse()
        .ok()?;

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

        let blog_info = BlogInfo {
            title,
            tags,
            category,
            date,
            path,
        };
        result.push(blog_info);
    }
    Some(result)
}

pub fn BlogPage(cx: Scope) -> Element {
    let route = use_route(&cx);
    let path = route.segment("path").unwrap();

    let global = cx.consume_context::<GlobalData>().unwrap();
    let config = global.config;

    let name = path.to_string();
    let info_config = config.clone();
    let info = use_future(
        &cx,
        (),
        |_| async move { get_info(&info_config, &name).await },
    );

    match info.value() {
        Some(Some((info, content))) => {
            let html_output = parse_markdown(&content).unwrap();

            let category = info.category.clone().unwrap_or("Default".to_string());

            let tags = info.tags.iter().map(|tag| {
                rsx! {
                    span { class: "text-xs mr-1 inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-gray-700 text-white rounded",
                        "{tag}"
                    }
                }
            });

            cx.render(rsx! {
                section { class: "bg-cover bg-white dark:bg-gray-600 dark:text-white",
                    Navbar {}
                    div { class: "md:flex h-full w-full justify-center px-6",
                        div { class: "max-w-5xl",
                            h1 { class: "text-4xl font-bold text-gray-600 dark:text-gray-200",
                                "{info.title}"
                            }
                            p { class: "mt-1 text-gray-400 dark:text-gray-300", "{info.date} & {category}" }
                            hr { class: "mt-2 w-60" }
                            div {
                                class: "prose mt-4 dark:text-white dark:prose-invert",
                                dangerous_inner_html: "{html_output}"
                            }
                            hr { class: "mt-4" }
                            p { class: "mt-4", tags }
                            Footer {}
                        }
                    }
                }
            })
        }
        Some(None) => cx.render(rsx! { _404::NotFound {} }),
        None => cx.render(rsx! {
            section { class: "bg-cover bg-white dark:bg-gray-600 dark:text-white",
                Navbar {}
                div { class: "flex h-full w-full items-center justify-center container mx-auto px-8",
                    div { class: "max-w-5xl text-center",
                        "Loading..."
                        Footer {}
                    }
                }
            }
        }),
    }
}

async fn get_info(config: &Config, name: &str) -> Option<(BlogInfo, String)> {
    let content = load_from_source(config, &format!("/posts/{name}.md")).await;

    if content.is_err() {
        return None;
    }
    let content = content.unwrap();

    let mut type_mark = HashMap::new();
    type_mark.insert("title".into(), "string");
    type_mark.insert("tags".into(), "array");
    type_mark.insert("category".into(), "string");
    type_mark.insert("date".into(), "string");
    type_mark.insert("released".into(), "bool");

    let (meta_info, content) = markdown_meta_parser::MetaData {
        content,
        required: vec!["title".to_string()],
        type_mark,
    }
    .parse()
    .ok()?;

    if meta_info.get("released").is_some()
        && meta_info
            .get("released")
            .unwrap()
            .clone()
            .as_bool()
            .unwrap()
            == false
    {
        return None;
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

    let blog_info = BlogInfo {
        title,
        tags,
        category,
        date,
        path: Default::default(),
    };
    Some((blog_info, content))
}
