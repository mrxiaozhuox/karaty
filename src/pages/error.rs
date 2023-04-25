use dioxus::prelude::*;

#[inline_props]
pub fn Error(cx: Scope, title: String, content: String) -> Element {
    return cx.render(rsx! {
        div { class: "h-screen",
            div { class: "flex justify-center", p { class: "text-gray-600 text-4xl font-bold", "{title}" } }
            div { class: "flex justify-center", p { class: "text-gray-500 text-3xl font-semibold", "{content}" } }
        }
    });
}
