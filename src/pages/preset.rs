// use std::collections::HashMap;
// use async_recursion::async_recursion;
// use dioxus::prelude::*;
// use dioxus_retrouter::{use_route, Link};
// use markdown::mdast;
//
// use crate::{
//     components::{footer::Footer, nav::Navbar, markdown::Markdown},
//     config::Config,
//     pages::_404,
//     utils::data::{load_content_list, load_from_source, GlobalData},
// };
//
// #[derive(PartialEq, Props)]
// pub struct BlogProps {
//     path: String,
//     #[props(!optional)]
//     setting: Option<toml::Value>,
// }
//
// pub fn BlogListPreset(cx: Scope<BlogProps>) -> Element {
//     let global = cx.consume_context::<GlobalData>().unwrap();
//     let config = global.config;
//
//     let mut group = String::new();
//     let mut link = format!("{}/:name", cx.props.path);
//     if let Some(toml::Value::Table(table)) = &cx.props.setting {
//         if let Some(toml::Value::String(val)) = table.get("group") {
//             group = val.to_string();
//         }
//         if let Some(toml::Value::String(val)) = table.get("link") {
//             link = val.to_string();
//         }
//     }
//
//     let list_config = config.clone();
//     let list = use_future(&cx, (), |_| async move {
//         let res = get_post_list(&list_config, group).await;
//         let res = if let Some(v) = res { v } else { HashMap::new() };
//         res
//     });
//
//     let site_title = config.site.name;
//
//     match list.value() {
//         Some(v) => {
//             let v = merge_post_list(v.clone());
//             let v = sort_by_date(v);
//             let list = v.iter().map(|v| {
//
//                 let category = v.category.clone().unwrap_or("Default".to_string());
//
//                 let tags = v.tags.iter().map(|tag| {
//                     rsx! {
//                         span { class: "text-xs mr-1 inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-gray-700 text-white rounded",
//                             "{tag}"
//                         }
//                     }
//                 });
//                 let link = link.replace(":name", &v.path);
//                 rsx! {
//                     Link { to: "{link}",
//                         h1 { class: "text-3xl font-bold text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white",
//                             "{v.title}"
//                         }
//                         p { class: "text-gray-400 dark:text-gray-100", "{v.date} & {category}" }
//                         p { class: "mt-2", tags }
//                         hr { class: "mt-2 mb-4" }
//                     }
//                 }
//             });
//             cx.render(rsx! {
//                 section { class: "bg-cover bg-white dark:bg-gray-900 dark:text-white",
//                     Navbar {}
//                     div { class: "flex h-full w-full items-center justify-center px-8",
//                         div { class: "max-w-5xl text-center w-[60%]",
//                             h1 { class: "text-xl font-bold", "`{site_title}`" }
//                             div { class: "mt-6", list }
//                             Footer {}
//                         }
//                     }
//                 }
//             })
//         }
//         None => cx.render(rsx! {
//             section { class: "bg-cover bg-white dark:bg-gray-900 dark:text-white",
//                 Navbar {}
//                 div { class: "flex h-full w-full items-center justify-center container mx-auto px-8",
//                     div { class: "max-w-5xl text-center",
//                         "Loading..."
//                         Footer {}
//                     }
//                 }
//             }
//         }),
//     }
// }
//
// #[derive(Debug, Clone, Default, PartialEq)]
// pub struct PostInfo {
//     pub title: String,
//     pub tags: Vec<String>,
//     pub category: Option<String>,
//     pub date: String,
//     pub path: String,
//     pub content: String,
//     pub sub_group: Vec<String>,
// }
//
// #[derive(Debug, Clone, PartialEq)]
// pub enum PostListInfo {
//     Info(PostInfo),
//     List(HashMap<String, PostListInfo>),
// }
//
//
// #[async_recursion(?Send)]
// async fn get_post_list(
//     config: &Config,
//     group: String
// ) -> Option<HashMap<String, PostListInfo>> {
//     let sub_path = if group.is_empty() {
//         "posts".to_string()
//     } else {
//         format!("posts/{group}")
//     };
//     let data = load_content_list(config, &sub_path).await;
//
//     let mut result = HashMap::new();
//
//     for (tp, file_name) in data {
//
//         log::info!("{}", format!("{group}/{file_name}"));
//
//         if tp == "dir" {
//             let list = get_post_list(
//                 config,
//                 format!("{group}/{file_name}")
//             ).await;
//             if let Some(list) = list {
//                 result.insert(file_name.clone(), PostListInfo::List(list));
//             }
//             continue;
//         }
//
//         if file_name == "_template.md" {
//             continue;
//         }
//
//         let meta_info = load_from_source(config, &format!("{sub_path}/{file_name}")).await;
//         if meta_info.is_err() {
//             continue;
//         }
//         let meta_info = meta_info.unwrap();
//
//         let mut type_mark = HashMap::new();
//
//         type_mark.insert("title".into(), "string");
//         type_mark.insert("tags".into(), "array");
//         type_mark.insert("category".into(), "string");
//         type_mark.insert("date".into(), "string");
//         type_mark.insert("released".into(), "bool");
//
//         let (meta_info, content) = markdown_meta_parser::MetaData {
//             content: meta_info,
//             required: vec!["title".to_string()],
//             type_mark,
//         }
//         .parse()
//         .ok()?;
//
//         if meta_info.get("released").is_some()
//             && meta_info
//                 .get("released")
//                 .unwrap()
//                 .clone()
//                 .as_bool()
//                 .unwrap()
//                 == false
//         {
//             continue;
//         }
//
//         let title = meta_info.get("title").unwrap().clone();
//
//         let date = meta_info.get("date");
//         let date = if let Some(d) = date {
//             d.clone().as_string().unwrap()
//         } else {
//             "".to_string()
//         };
//
//         let tags = meta_info.get("tags");
//         let tags = if let Some(v) = tags {
//             v.clone().as_array().unwrap()
//         } else {
//             vec![]
//         };
//
//         let category = meta_info.get("category");
//         let category = if let Some(v) = category {
//             v.clone().as_string()
//         } else {
//             None
//         };
//
//         let title = title.as_string().unwrap();
//
//         let path = file_name.split(".").collect::<Vec<&str>>();
//         let path = path[0..path.len() - 1].to_vec();
//         let path = path.join(".");
//
//         let blog_info = PostListInfo::Info(PostInfo {
//             title,
//             tags,
//             category,
//             date,
//             path: path.clone(),
//             content,
//             sub_group: Default::default(),
//         });
//         result.insert(path, blog_info);
//     }
//     Some(result)
// }
//
// pub fn BlogContentPreset(cx: Scope<BlogProps>) -> Element {
//     let route = use_route(&cx);
//
//     let mut group = String::new();
//     let mut seg = ":path".to_string();
//     if let Some(toml::Value::Table(table)) = &cx.props.setting {
//         if let Some(toml::Value::String(val)) = table.get("group") {
//             group = val.to_string();
//         }
//         if let Some(toml::Value::String(val)) = table.get("file") {
//             seg = val.to_string();
//         }
//     }
//     let path = if seg.starts_with(":") {
//         route.segment(&seg[1..]).unwrap().to_string()
//     } else {
//         seg.to_string()
//     };
//
//     let global = cx.consume_context::<GlobalData>().unwrap();
//     let config = global.config;
//
//     let name = path.to_string();
//     let info_config = config.clone();
//     let info = use_future(&cx, (&name,), |(name,)| async move {
//         let info = get_info(&info_config, &name, group).await;
//         info
//     });
//
//     match info.value() {
//         Some(Some(info)) => {
//             let content = info.content.clone();
//
//             let category = info.category.clone().unwrap_or("Default".to_string());
//
//             let tags = info.tags.iter().map(|tag| {
//                 rsx! {
//                     span { class: "text-xs mr-1 inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-gray-700 text-white rounded",
//                         "{tag}"
//                     }
//                 }
//             });
//
//             cx.render(rsx! {
//                 section { class: "bg-cover bg-white dark:bg-gray-900 dark:text-white",
//                     Navbar {}
//                     div { class: "md:flex h-full w-full justify-center px-6",
//                         div { class: "max-w-5xl w-[100%] sm:w-[60%]",
//                             h1 { class: "text-4xl font-bold text-gray-600 dark:text-white",
//                                 "{info.title}"
//                             }
//                             p { class: "mt-1 text-gray-400 dark:text-gray-200", "{info.date} & {category}" }
//                             hr { class: "mt-2" }
//                             div {
//                                 class: "prose mt-4 dark:text-white dark:prose-invert",
//                                 Markdown {
//                                     content: content.clone(),
//                                 }
//                             }
//                             hr { class: "mt-4" }
//                             p { class: "mt-4", tags }
//                             Footer {}
//                         }
//                     }
//                 }
//             })
//         }
//         Some(None) => cx.render(rsx! { _404::NotFound {} }),
//         None => cx.render(rsx! {
//             section { class: "bg-cover bg-white dark:bg-gray-900 dark:text-white",
//                 Navbar {}
//                 div { class: "flex h-full w-full items-center justify-center container mx-auto px-8",
//                     div { class: "max-w-5xl text-center",
//                         "Loading..."
//                         Footer {}
//                     }
//                 }
//             }
//         }),
//     }
// }
//
// async fn get_info(config: &Config, name: &str, group: String) -> Option<PostInfo> {
//     let sub_path = if group.is_empty() {
//         format!("posts/{name}.md")
//     } else {
//         format!("posts/{group}/{name}.md")
//     };
//     let content = load_from_source(config, &sub_path).await;
//
//     if content.is_err() {
//         return None;
//     }
//     let content = content.unwrap();
//
//     let mut type_mark = HashMap::new();
//     type_mark.insert("title".into(), "string");
//     type_mark.insert("tags".into(), "array");
//     type_mark.insert("category".into(), "string");
//     type_mark.insert("date".into(), "string");
//     type_mark.insert("released".into(), "bool");
//
//     let (meta_info, content) = markdown_meta_parser::MetaData {
//         content,
//         required: vec!["title".to_string()],
//         type_mark,
//     }
//     .parse()
//     .ok()?;
//
//     if meta_info.get("released").is_some()
//         && meta_info
//             .get("released")
//             .unwrap()
//             .clone()
//             .as_bool()
//             .unwrap()
//             == false
//     {
//         return None;
//     }
//
//     let title = meta_info.get("title").unwrap().clone();
//
//     let date = meta_info.get("date");
//     let date = if let Some(d) = date {
//         d.clone().as_string().unwrap()
//     } else {
//         "".to_string()
//     };
//
//     let tags = meta_info.get("tags");
//     let tags = if let Some(v) = tags {
//         v.clone().as_array().unwrap()
//     } else {
//         vec![]
//     };
//
//     let category = meta_info.get("category");
//     let category = if let Some(v) = category {
//         v.clone().as_string()
//     } else {
//         None
//     };
//
//     let title = title.as_string().unwrap();
//
//     let blog_info = PostInfo {
//         title,
//         tags,
//         category,
//         date,
//         path: Default::default(),
//         content,
//         sub_group: Default::default(),
//     };
//     Some(blog_info)
// }
//
// #[derive(PartialEq, Props)]
// pub struct DocsScope {
//     path: String,
//     #[props(!optional)]
//     setting: Option<toml::Value>,
// }
// pub fn DocsPreset(cx: Scope<DocsScope>) -> Element {
//     let global = cx.consume_context::<GlobalData>().unwrap();
//     let config = global.config;
//
//     let route = use_route(&cx);
//
//     let mut group = String::new();
//     let mut file = ":path".to_string();
//     if let Some(toml::Value::Table(setting)) = &cx.props.setting {
//         if let Some(toml::Value::String(val)) = setting.get("group") {
//             group = val.to_string();
//         }
//         if setting.get("group").is_some() {
//             let t = setting.get("group").unwrap();
//             if t.is_str() {
//                 group = t.as_str().unwrap().to_string()
//             }
//         }
//         if let Some(toml::Value::String(val)) = setting.get("file") {
//             file = val.to_string();
//         }
//     }
//
//     let file_name = if &file[0..1] == ":" {
//         route.segment(&file[1..]).unwrap().to_string()
//     } else {
//         file.to_string()
//     };
//
//     let list_config = config.clone();
//     let group_query = route.query_param("group");
//     let content_group = if let Some(q) = group_query {
//         q.replace(".", "/")
//     } else {
//         String::new()
//     };
//     let data = use_future(&cx, (&file_name, ), |(file_name,)| async move {
//         let info_group = format!("{}/{}", group, content_group);
//         let data = get_info(&list_config, &file_name, info_group).await;
//         let sub_path = if group.is_empty() {
//             format!("posts/_index.md")
//         } else {
//             format!("posts/{group}/_index.md")
//         };
//         let index = load_from_source(&list_config, &sub_path).await;
//         let index = if index.is_err() {
//             String::new()
//         } else {
//             index.unwrap()
//         };
//         let index = markdown::to_mdast(&index, &markdown::ParseOptions::default()).ok();
//         if index.is_none() {
//             (data, vec![])
//         } else {
//             let index = index.unwrap();
//             let mut index_nodes = vec![];
//             if let mdast::Node::Root(root) = index {
//                 index_nodes = root.clone().children;
//             }
//             (data, index_nodes)
//         }
//     });
//
//     match data.value() {
//         Some((data, index)) => {
//             if data.is_none() {
//                 return cx.render(rsx! {
//                     _404::NotFound {}
//                 });
//             }
//             let data = data.clone().unwrap();
//
//             let date = if data.date.is_empty() {
//                 "Unknown".to_string()
//             } else {
//                 data.date
//             };
//
//             cx.render(rsx! {
//                 div { class: "bg-cover bg-white dark:bg-gray-900 dark:text-white",
//                     Navbar {}
//                     div { class: "container mx-auto px-8 max-w-7xl",
//                         div { class: "grid grid-cols-12 gap-6",
//                             div {
//                                 class: "row-span-3 max-h-[34rem] col-span-12 sm:col-span-3 bg-gray-50 dark:bg-gray-800 rounded-md",
//                                 div {
//                                     class: "px-3 py-2",
//                                     DocsSideBar {
//                                         index: index.clone(),
//                                         path: cx.props.path.clone(),
//                                         file_sign: file.clone(),
//                                     }
//                                 }
//                             }
//                             div {
//                                 class: "col-span-12 sm:col-span-8",
//                                 span {
//                                     class: "font-bold text-3xl sm:text-4xl text-gray-600 dark:text-gray-200",
//                                     "{data.title}"
//                                 }
//                                 span {
//                                     class: "hidden sm:block float-right text-gray-400 dark:text-gray-300",
//                                     "Updated on {date}"
//                                 }
//                                 p {
//                                     class: "sm:hidden text-gray-400 dark:text-gray-300",
//                                     "Updated on {date}"
//                                 }
//                             }
//                             div {
//                                 class:"row-span-2 col-span-12 sm:col-span-8",
//                                 div {
//                                     class: "prose prose-sm sm:prose-base  mt-4 dark:text-white dark:prose-invert",
//                                     Markdown {
//                                         content: data.content.clone(),
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                     div {
//                         class: "flex justify-center container mx-auto my-12",
//                         Footer {}
//                     }
//                 }
//             })
//         },
//         None => cx.render(rsx! {
//             section { class: "bg-cover bg-white dark:bg-gray-900 dark:text-white",
//                 Navbar {}
//                 div { class: "flex h-full w-full items-center justify-center container mx-auto px-8",
//                     div { class: "max-w-5xl text-center",
//                         "Loading..."
//                         Footer {}
//                     }
//                 }
//             }
//         }),
//     }
// }
//
// #[derive(PartialEq, Props)]
// pub struct SideBarProps {
//     index: Vec<mdast::Node>,
//     path: String,
//     file_sign: String,
// }
//
// pub fn DocsSideBar(
//     cx: Scope<SideBarProps>
// ) -> Element {
//     let node = cx.props.index.clone();
//
//     let display = node.iter().map(|node| {
//         let child = if let Some(v) = node.children() {
//             v.clone()
//         } else {
//             vec![]
//         };
//         let embedd = rsx! {
//             DocsSideBar {
//                 index: child,
//                 path: cx.props.path.clone(),
//                 file_sign: cx.props.file_sign.clone(),
//             }
//         };
//         if let mdast::Node::ListItem(_) = node {
//             return rsx! {
//                  li {
//                     class: "text-black hover:text-blue-700 dark:text-sky-100 dark:hover:text-blue-300 font-semibold",
//                     embedd
//                 }
//             }
//         } else if let mdast::Node::List(_) = node {
//             return rsx! {
//                 ul {
//                     class: "px-5 py-1 list-disc",
//                     embedd
//                 }
//             }
//         } else if let mdast::Node::Paragraph(_) = node {
//             return rsx! {
//                 embedd
//             }
//         } else if let mdast::Node::Link(link) = node {
//             let class = "";
//             if &link.url[0..1] == "@" {
//                 let mut groups = link.url[1..].split(".").collect::<Vec<&str>>();
//                 let url = if groups.len() == 1 {
//                     cx.props.path.replace(&cx.props.file_sign, groups.get(0).unwrap())
//                 } else {
//                     let url = cx.props.path.replace(&cx.props.file_sign, groups.get(groups.len() - 1).unwrap());
//                     groups.remove(groups.len() - 1);
//                     format!("{url}?group={0}", groups.join("."))
//                 };
//                 return rsx! {
//                     Link {
//                         class: "{class}",
//                         to: "{url}",
//                         embedd
//                     }
//                 }
//             } else {
//                 return rsx! {
//                     a {
//                         class: "{class}",
//                         href: "{link.url}",
//                         embedd
//                     }
//                 }
//             }
//         } else if let mdast::Node::Text(text) = node {
//             return rsx! {
//                 "{text.value}"
//             }
//         }
//         rsx! { div { "{node:?}" } }
//     });
//
//     cx.render(rsx! {
//         display
//     })
// }
//
// fn merge_post_list(data: HashMap<String, PostListInfo>) -> Vec<PostInfo> {
//     let mut result = vec![];
//     for (name, i) in data {
//         match i {
//             PostListInfo::Info(i) => {
//                 result.push(i);
//             },
//             PostListInfo::List(list) => {
//                 let list = merge_post_list(list);
//                 for mut i in list {
//                     i.sub_group.push(name.clone());
//                     result.push(i);
//                 }
//             },
//         }
//     }
//     result
// }
//
// fn sort_by_date(mut data: Vec<PostInfo>) -> Vec<PostInfo> {
//     data.sort_by(|a, b| {
//         let a_date = chrono::NaiveDate::parse_from_str(&a.date, "%Y-%m-%d");
//         let b_date = chrono::NaiveDate::parse_from_str(&b.date, "%Y-%m-%d");
//         if a_date.is_ok() && b_date.is_ok() {
//             return b_date.unwrap().cmp(&a_date.unwrap());
//         }
//         std::cmp::Ordering::Equal
//     });
//     data
// }
