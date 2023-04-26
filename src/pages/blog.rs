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

#[derive(PartialEq, Props)]
pub struct BlogProps {
    path: String,
    #[props(!optional)]
    setting: Option<toml::Value>,
}

pub fn BlogList(cx: Scope<BlogProps>) -> Element {
    let global = cx.consume_context::<GlobalData>().unwrap();
    let config = global.config;

    let mut group = String::new();
    let mut link = format!("{}/:name", cx.props.path);
    if let Some(toml::Value::Table(table)) = &cx.props.setting {
        if let Some(toml::Value::String(val)) = table.get("group") {
            group = val.to_string();
        }
        if let Some(toml::Value::String(val)) = table.get("link") {
            link = val.to_string();
        }
    }

    let list_config = config.clone();
    let list = use_future(&cx, (), |_| async move {
        let res = get_blog_list(&list_config, group).await;
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
                let link = link.replace(":name", &v.path);
                rsx! {
                    Link { to: "{link}",
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
                            h1 { class: "text-xl font-bold", "`{site_title}`" }
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

#[derive(Debug, Clone, Default)]
struct BlogInfo {
    pub title: String,
    pub tags: Vec<String>,
    pub category: Option<String>,
    pub date: String,
    pub path: String,
    pub content: String,
}

async fn get_blog_list(config: &Config, group: String) -> Option<Vec<BlogInfo>> {
    let sub_path = if group.is_empty() {
        "posts".to_string()
    } else {
        format!("posts/{group}")
    };
    let data = load_content_list(config, &sub_path).await;

    let mut result = vec![];

    for (tp, file_name) in data {
        if tp != "file" || file_name == "_template.md" {
            continue;
        }

        let meta_info = load_from_source(config, &format!("{sub_path}/{file_name}")).await;
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

        let (meta_info, content) = markdown_meta_parser::MetaData {
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
            content,
        };
        result.push(blog_info);
    }
    Some(result)
}

pub fn BlogPage(cx: Scope<BlogProps>) -> Element {
    let route = use_route(&cx);

    let mut group = String::new();
    let mut seg = ":path".to_string();
    if let Some(toml::Value::Table(table)) = &cx.props.setting {
        if let Some(toml::Value::String(val)) = table.get("group") {
            group = val.to_string();
        }
        if let Some(toml::Value::String(val)) = table.get("file") {
            seg = val.to_string();
        }
    }
    let path = if seg.starts_with(":") {
        route.segment(&seg[1..]).unwrap().to_string()
    } else {
        seg.to_string()
    };

    let global = cx.consume_context::<GlobalData>().unwrap();
    let config = global.config;

    let name = path.to_string();
    let info_config = config.clone();
    let info = use_future(&cx, (), |_| async move {
        get_info(&info_config, &name, group).await
    });

    match info.value() {
        Some(Some(info)) => {
            let content = info.content.clone();
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

async fn get_info(config: &Config, name: &str, group: String) -> Option<BlogInfo> {
    let sub_path = if group.is_empty() {
        format!("posts/{name}.md")
    } else {
        format!("posts/{group}/{name}.md")
    };
    let content = load_from_source(config, &sub_path).await;

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
        content,
    };
    Some(blog_info)
}

#[derive(PartialEq, Props)]
pub struct DocsScope {
    path: String,
    #[props(!optional)]
    setting: Option<toml::Value>,
}
pub fn DocsPreset(cx: Scope<DocsScope>) -> Element {
    let global = cx.consume_context::<GlobalData>().unwrap();
    let config = global.config;

    let route = use_route(&cx);

    let mut group = String::new();
    let mut file = ":path".to_string();
    if let Some(toml::Value::Table(setting)) = &cx.props.setting {
        if let Some(toml::Value::String(val)) = setting.get("group") {
            group = val.to_string();
        }
        if setting.get("group").is_some() {
            let t = setting.get("group").unwrap();
            if t.is_str() {
                group = t.as_str().unwrap().to_string()
            }
        }
        if let Some(toml::Value::String(val)) = setting.get("file") {
            file = val.to_string();
        }
    }

    let file_name = if &file[0..1] == ":" {
        route.segment(&file[1..]).unwrap().to_string()
    } else {
        file.to_string()
    };

    let list_config = config.clone();
    let data = use_future(&cx, (), |_| async move {
        let res = get_blog_list(&list_config, group).await;
        let res = if let Some(v) = res { v } else { vec![] };
        res
    });

    let _site_title = config.site.name;
    match data.value() {
        Some(data) => {
            let mut current_content: BlogInfo = Default::default();
            for i in data {
                if i.path == file_name {
                    current_content = i.clone();
                }
            }
            let sidebar = data.iter().map(|content| {
                let link = cx.props.path.replace(&file, &content.path);
                rsx! {
                    li {
                        class: "",
                        Link {
                            class: "text-blue-500",
                            to: "{link}",
                            "{content.title}"
                        }
                    }
                }
            });

            let html_output = parse_markdown(&current_content.content).unwrap();
            
            cx.render(rsx! {
                div { class: "bg-cover bg-white dark:bg-gray-600 dark:text-white",
                    Navbar {}
                    div { class: "container mx-auto px-8 max-w-7xl",
                        div { class: "grid grid-rows-3 grid-flow-col gap-6",
                            div {
                                class: "row-span-3 bg-gray-100 rounded-lg",
                                ul {
                                    class: "px-9 py-3 list-disc",
                                    sidebar
                                }
                            }
                            div {
                                class: "col-span-4",
                                span {
                                    class: "font-bold text-4xl text-gray-600 dark:text-gray-200",
                                    "{current_content.title}"
                                }
                                span {
                                    class: "float-right text-gray-400 dark:text-gray-500",
                                    "Updated on {current_content.date}"
                                }
                            }
                            div {
                                class:"row-span-2 col-span-4",
                                div {
                                    class: "prose mt-4 dark:text-white dark:prose-invert",
                                    dangerous_inner_html: "{html_output}",
                                }
                            }
                        }
                    }
                    div {
                        class: "flex justify-center container mx-auto my-12",
                        Footer {}
                    }
                }
            })
        },
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
