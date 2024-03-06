use dioxus::prelude::*;
use dioxus_retrouter::use_route;

use crate::{hooks::mode::is_dark, utils::data::GlobalData};

#[derive(Debug, Props, PartialEq)]
pub struct GiscusProps {

    pub url: String,

    pub repo: String,
    pub repo_id: String,
    
    pub category: String,
    pub category_id: String,

    #[props(default = String::from("pathname"))]
    pub mapping: String,
    #[props(default = true)]
    pub strict: bool,

    #[props(default = true)]
    pub reactions: bool,

    #[props(default = true)]
    pub emit_metadata: bool,

    #[props(default = String::from("top"))]
    pub input_position: String,

    #[props(default = String::from("light"))]
    pub theme: String,

    #[props(default = String::from("en"))]
    pub lang: String,

    #[props(default = String::from("anonymous"))]
    pub crossorigin: String,

}

fn from_bool(v: bool) -> String { if v { "1".to_string() } else { "0".to_string() } }

pub fn Giscus(cx: Scope<GiscusProps>) -> Element {
    let strict = from_bool(cx.props.strict);
    let reactions = from_bool(cx.props.reactions);
    let emit_metadata = from_bool(cx.props.emit_metadata);
    cx.render(rsx! {
        script {
            "src": "https://giscus.app/client.js",
            "data-repo": "{cx.props.repo}",
            "data-repo-id": "{cx.props.repo_id}",
            "data-category": "{cx.props.category}",
            "data-category-id": "{cx.props.category_id}",
            "data-mapping": "{cx.props.mapping}",
            "data-strict": "{strict}",
            "data-reactions-enabled": "{reactions}",
            "data-emit-metadata": "{emit_metadata}",
            "data-input-position": "{cx.props.input_position}",
            "data-theme": "{cx.props.theme}",
            "lang": "{cx.props.lang}",
            "crossorigin": "{cx.props.crossorigin}",
            "async": "",
        }
    })
}

pub fn GiscusWithConfig(cx: Scope) -> Element {
    let global = cx.consume_context::<GlobalData>().unwrap();
    let c = global.config.giscus;

    let route = use_route(&cx);

    let mut url = route.url().path().to_string();
    if url.starts_with("/") {
        url = url[1..].to_string();
    }

    use_effect(cx, (&url,), |(url,)| async move {
        let code = &format!("\
            let frame = document.querySelector('iframe.giscus-frame');\
            if (frame != null) {{\
                frame.contentWindow.postMessage(\
                    {{ giscus: {{ setConfig: {{ term: '{url}' }} }} }},\
                    'https://giscus.app',\
                );\
            }}\
        ");

        js_sys::eval(&code).unwrap();

    });

    let mode = is_dark(&cx);
    use_effect(cx, (&mode,), |(is_dark,)| async move {
        let new_theme = if is_dark { "dark" } else { "light" };
        let code = &format!("\
            let frame = document.querySelector('iframe.giscus-frame');\
            if (frame != null) {{\
                frame.contentWindow.postMessage(\
                    {{ giscus: {{ setConfig: {{ theme: '{new_theme}' }} }} }},\
                    'https://giscus.app',\
                );\
            }}\
        ");

        js_sys::eval(&code).unwrap();

    });

    if let Some(c) = c {
        let theme = if c.theme == "preferred_color_scheme" {
            if mode {
                "dark".to_string()
            } else {
                "light".to_string()
            }
        } else {
            c.theme.clone()
        };

        cx.render(rsx! {
            Giscus {
                url: url,
                repo: c.repo,
                repo_id: c.repo_id,
                category: c.category,
                category_id: c.category_id,
                mapping: c.mapping,
                strict: c.strict,
                reactions: c.reactions,
                emit_metadata: c.emit_metadata,
                input_position: c.input_position,
                theme: theme,
                lang: c.lang,
                crossorigin: c.crossorigin,
            }
        })
    } else {
        None
    }
}
