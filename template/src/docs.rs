use std::collections::HashMap;

use dioxus::prelude::*;
use dioxus_retrouter::Link;
use karaty_blueprint::TemplateProps;
use markdown::mdast;

use crate::blog::PostInfo;

#[allow(non_snake_case)]
pub fn DocsPreset(cx: Scope<TemplateProps>) -> Element {
    let _404 = cx.props.utility._404;
    let Navbar = cx.props.utility.navbar;
    let Footer = cx.props.utility.footer;
    let Markdown = cx.props.utility.renderers.get("markdown").unwrap().clone();

    let data = &cx.props.data;
    let config = cx.props.config.clone();

    let segment_name = if let Some(karaty_blueprint::Value::String(v)) = config.get("file-segment")
    {
        v.to_string()
    } else {
        "path".to_string()
    };

    let file = cx.props.route.segments.get(&segment_name);
    if file.is_none() {
        return cx.render(rsx! {
            _404 {}
        });
    }
    let file = file.unwrap();

    let mut file_path = file.split(".").map(String::from).collect::<Vec<String>>();
    file_path.last_mut().map(|v| *v = format!("{v}.md"));
    let index = data.get(vec!["_index.md".to_string()]);
    let index = {
        if let Some(karaty_blueprint::TemplateData::File(index)) = index {
            let index = markdown::to_mdast(&index, &markdown::ParseOptions::default()).ok();
            if index.is_none() {
                vec![]
            } else {
                let index = index.unwrap();
                let mut index_nodes = vec![];
                if let mdast::Node::Root(root) = index {
                    index_nodes = root.clone().children;
                }
                index_nodes
            }
        } else {
            vec![]
        }
    };
    let data = data.get(file_path);

    match data {
        Some(karaty_blueprint::TemplateData::File(data)) => {
            let data = to_info(data);
            if data.is_none() {
                return cx.render(rsx! {
                    _404 {}
                });
            }
            let data = data.unwrap();

            let date = if data.date.is_empty() {
                "Unknown".to_string()
            } else {
                data.date
            };

            cx.render(rsx! {
                div { class: "bg-cover bg-white dark:bg-gray-900 dark:text-white",
                    Navbar {}
                    div { class: "container mx-auto px-8 max-w-7xl",
                        div { class: "grid grid-cols-12 gap-6",
                            div {
                                class: "row-span-3 max-h-[34rem] col-span-12 sm:col-span-3 bg-gray-50 dark:bg-gray-800 rounded-md",
                                div {
                                    class: "px-3 py-2",
                                    DocsSideBar {
                                        index: index.clone(),
                                        path: cx.props.route.bound_path.clone(),
                                        file_sign: segment_name.clone(),
                                    }
                                }
                            }
                            div {
                                class: "col-span-12 sm:col-span-8",
                                span {
                                    class: "font-bold text-3xl sm:text-4xl text-gray-600 dark:text-gray-200",
                                    "{data.title}"
                                }
                                span {
                                    class: "hidden sm:block float-right text-gray-400 dark:text-gray-300",
                                    "Updated on {date}"
                                }
                                p {
                                    class: "sm:hidden text-gray-400 dark:text-gray-300",
                                    "Updated on {date}"
                                }
                            }
                            div {
                                class:"row-span-2 col-span-12 sm:col-span-8",
                                div {
                                    class: "prose prose-sm sm:prose-base  mt-4 dark:text-white dark:prose-invert",
                                    Markdown {
                                        content: data.content.clone(),
                                        config: Default::default(),
                                    }
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
        }
        _ => cx.render(rsx! {
            _404 {}
        }),
    }
}

#[derive(PartialEq, Props)]
pub struct SideBarProps {
    index: Vec<mdast::Node>,
    path: String,
    file_sign: String,
}

#[allow(non_snake_case)]
pub fn DocsSideBar(cx: Scope<SideBarProps>) -> Element {
    let node = cx.props.index.clone();

    let display = node.iter().map(|node| {
        let child = if let Some(v) = node.children() {
            v.clone()
        } else {
            vec![]
        };
        let embedd = rsx! {
            DocsSideBar {
                index: child,
                path: cx.props.path.clone(),
                file_sign: cx.props.file_sign.clone(),
            }
        };
        if let mdast::Node::ListItem(_) = node {
            return rsx! {
                 li {
                    class: "text-black hover:text-blue-700 dark:text-sky-100 dark:hover:text-blue-300 font-semibold",
                    embedd
                }   
            }
        } else if let mdast::Node::List(_) = node {
            return rsx! {
                ul {
                    class: "px-5 py-1 list-disc",
                    embedd
                }
            }
        } else if let mdast::Node::Paragraph(_) = node {
            return rsx! {
                embedd
            }
        } else if let mdast::Node::Link(link) = node {
            let class = "";
            if &link.url[0..1] == "@" {
                let url = cx.props.path.replace(&format!(":{}", cx.props.file_sign), &link.url[1..]);
                return rsx! {
                    Link {
                        class: "{class}",
                        to: "{url}",
                        embedd
                    }
                }
            } else {
                return rsx! {
                    a {
                        class: "{class}",
                        href: "{link.url}",
                        embedd
                    }
                }
            }
        } else if let mdast::Node::Text(text) = node {
            return rsx! {
                "{text.value}"
            }
        }
        rsx! { div { "{node:?}" } }
    });

    cx.render(rsx! {
        display
    })
}

fn to_info(meta_info: String) -> Option<PostInfo> {
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
        return None;
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

    let blog_info = PostInfo {
        title,
        tags,
        category,
        date,
        path: String::new(),
        content,
        sub_group: Default::default(),
    };
    return Some(blog_info);
}
