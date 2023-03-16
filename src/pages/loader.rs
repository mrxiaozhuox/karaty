use dioxus::prelude::*;

#[inline_props]
pub fn HandleSuffix(cx: Scope, name: String, content: String) -> Element {
    cx.render(rsx! {
        div {
            "{content}"
        }
    })
}
