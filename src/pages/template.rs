use dioxus::prelude::*;

use crate::components::{footer::Footer, nav::Navbar};

#[inline_props]
pub fn DynamicTemplate(cx: Scope, name: String, content: String) -> Element {
    let suffix = name.split(".").last().unwrap();
    cx.render(rsx! {
        div {
            match suffix {
                "md" => { rsx! { Markdown { content: content.to_string() } } }
                _ => { rsx! { "Content Not Found" } }
            }
        }
    })
}

#[inline_props]
pub fn Markdown(cx: Scope, content: String) -> Element {
    let mut options = pulldown_cmark::Options::empty();
    options.insert(pulldown_cmark::Options::ENABLE_STRIKETHROUGH);
    options.insert(pulldown_cmark::Options::ENABLE_TASKLISTS);
    let parser = pulldown_cmark::Parser::new_ext(content, options);

    let mut html_output = String::new();
    pulldown_cmark::html::push_html(&mut html_output, parser);

    cx.render(rsx! {
        section {
            class: "bg-cover bg-white dark:bg-gray-600",
            Navbar {}
            div {
                class: "flex h-4/6 w-full items-center justify-center container mx-auto px-8",
                div {
                    class: "max-w-2xl text-center",
                    div {
                        class: "prose dark:prose-invert",
                        dangerous_inner_html: "{html_output}",
                    }
                    Footer {}
                }
            }
        }
    })
}
