pub use dioxus::prelude::*;
use dioxus_router::Link;

use crate::{config::NavigationInfo, utils::data::GlobalData};

pub fn Navbar(cx: Scope) -> Element {
    let data = cx.consume_context::<GlobalData>().unwrap();
    let config = data.config;
    let nav = config.navigation.list.clone();
    cx.render(rsx! {
        nav {
            class: "dark:bg-gray-600",
            div {
                class: "max-w-7xl mx-auto px-2 sm:px-6 lg:px-8",
                div {
                    class: "relative flex items-center justify-between h-16",
                    div {
                        class: "flex-1 flex items-center justify-center sm:items-stretch sm:justify-start",
                        Link {
                            class: "flex-shrink-0 flex items-center font-bold text-2xl",
                            to: "/",
                            "{config.site.name}"
                        }
                        div {
                            class: "hidden sm:block sm:ml-6 absolute right-0",
                            div {
                                class: "flex space-x-4",
                                nav.iter().map(|v| {
                                    match v.clone() {
                                        NavigationInfo::Page { display, mut page } => {

                                            // if page name equal homepage
                                            if config.page.homepage == page {
                                                page = "/".into();
                                            }
                                            
                                            rsx! {
                                                Link {
                                                    class: "text-gray-800 dark:text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium",
                                                    to: "{page}",
                                                    "{display}"
                                                }
                                            }
                                        },
                                        NavigationInfo::Link { display, link } => {
                                            rsx! {
                                                a {
                                                    class: "text-gray-800 dark:text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium",
                                                    href: "{link}",
                                                    "{display}"
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }
                }
            }
        }
        br {}
    })
}
