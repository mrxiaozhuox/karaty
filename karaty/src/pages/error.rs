use crate::components::{footer::Footer, nav::Navbar};
use dioxus::prelude::*;
use karaty_blueprint::ErrorProps;

pub fn Error(cx: Scope<ErrorProps>) -> Element {
    let title = &cx.props.title;
    let content = &cx.props.content;
    return cx.render(rsx! {
        div { class: "h-screen",
            div { class: "flex justify-center", p { class: "text-gray-600 text-4xl font-bold", "{title}" } }
            div { class: "flex justify-center", p { class: "text-gray-500 text-3xl font-semibold", "{content}" } }
        }
    });
}

pub fn PageNotFound(cx: Scope) -> Element {
    cx.render(rsx! {
        Navbar {}
        section { class: "h-[calc(100vh-100px)] bg-cover bg-white dark:bg-gray-900",
            div { class: "flex h-full w-full items-center justify-center container mx-auto px-8",
                div { class: "max-w-2xl text-center",
                    h1 { class: "text-3xl sm:text-5xl capitalize tracking-widest dark:text-white lg:text-6xl",
                        "Page Not Found"
                    }
                    Footer {}
                }
            }
        }
    })
}
