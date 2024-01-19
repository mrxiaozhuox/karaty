use dioxus::prelude::*;
use karaty_blueprint::{Templates, TemplateProps, TemplateDataType};

mod blog;
mod docs;

const AVAILABLE_STYLE_SETTINGS: [&'static str; 26] = [
    "headings",
    "lead",
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "a",
    "blockquote",
    "figure",
    "figcaption",
    "strong",
    "em",
    "code",
    "pre",
    "ol",
    "ul",
    "li",
    "table",
    "thead",
    "tr",
    "th",
    "td",
    "img",
    "video",
    "hr",
];

pub fn generate_prose_class(config: toml::map::Map<String, toml::Value>) -> String {
    let mut res = String::from("prose prose-sm sm:prose-base dark:prose-invert");
    for i in AVAILABLE_STYLE_SETTINGS {
        if let Some(toml::Value::String(v)) = config.get(i) {
            let list = v.split(" ").collect::<Vec<&str>>();
            if list.len() >= 1 {
                res.push_str(&format!(" prose-{i}:{}", list.get(0).unwrap()))
            } else {
                res.push_str(&format!("{} ", list.join(&format!(" prose-{i}:"))));
            }
        }
    }
    res
}

#[allow(non_snake_case)]
pub fn centered_display(cx: Scope<TemplateProps>) -> Element {
    
    let config = &cx.props.config;

    let Navbar = cx.props.utility.navbar;
    let Footer = cx.props.utility.footer;
    let Markdown = cx.props.utility.renderers.get("markdown").unwrap().clone();

    let content = cx.props.data.text();

    let class = if let Some(toml::Value::Table(t)) = config.get("style") {
        generate_prose_class(t.clone())
    } else {
        "prose prose-sm sm:prose-base dark:prose-invert".to_string()
    };

    let hide_navbar = if let Some(toml::Value::Boolean(b)) = config.get("hide-navbar") {
        *b
    } else {
        false
    };

    let hide_footer = if let Some(toml::Value::Boolean(b)) = config.get("hide-footer") {
        *b
    } else {
        false
    };

    cx.render(rsx! {
        section { class: "bg-cover bg-white dark:bg-gray-900",
            if !hide_navbar {
                rsx! { Navbar {} }
            }
            div { class: "flex w-full items-center justify-center container mx-auto px-8",
                div { class: "text-center",
                    div { class: "{class}", Markdown { content: content, config: Default::default() } }
                    if !hide_footer {
                        rsx! { Footer {} }
                    }
                }
            }
        }
    })
}

pub fn export() -> Templates {

    let mut list = Templates::new();

    list.insert("center", vec![TemplateDataType::Markdown], centered_display);

    list.insert("docs", vec![TemplateDataType::DirectoryData], docs::DocsPreset);
    list.sub_module("blog", blog::export());

    list
}
