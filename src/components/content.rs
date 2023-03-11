use dioxus::prelude::*;

use crate::utils::data::ComplexContent;

#[derive(PartialEq, Props)]
pub struct ComplexComponentProps {
    data: Vec<ComplexContent>,
}

pub fn ComplexComponent(cx: Scope<ComplexComponentProps>) -> Element {
    let v = cx.props.data.iter().map(|v| {
        match v {
            ComplexContent::Paragraph { value } => {
                rsx! { p { ComplexComponent { data: value.clone() } } }
            },
            ComplexContent::Text { text } => {
                rsx! {
                    span { "{text}" }
                }
            },
            ComplexContent::Link { url, text } => rsx! {
                a {
                    href: "{url}",
                    "{text}"
                }
            },
        }
    });
    cx.render(rsx! {
        div {
            v
        }
    })
}
