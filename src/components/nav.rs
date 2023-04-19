pub use dioxus::prelude::*;
use dioxus_router::Link;

use crate::{components::icon::Icon, config::NavigationInfo, utils::data::GlobalData};

pub fn Navbar(cx: Scope) -> Element {
    let data = cx.consume_context::<GlobalData>().unwrap();
    let config = data.config;
    let nav = config.navigation.links.clone();

    let dark_mode = crate::hooks::mode::is_dark(&cx);

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
                                        NavigationInfo::TextToPage { text, mut page } => {
                                            rsx! {
                                                Link {
                                                    class: "text-gray-800 dark:text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium",
                                                    to: "{page}",
                                                    "{text}"
                                                }
                                            }
                                        },
                                        NavigationInfo::TextToLink { text, link } => {
                                            rsx! {
                                                a {
                                                    class: "text-gray-800 dark:text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium",
                                                    href: "{link}",
                                                    "{text}"
                                                }
                                            }
                                        },
                                        NavigationInfo::IconToPage { icon, mut page } => {
                                            rsx! {
                                                Link {
                                                    class: "text-gray-800 dark:text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium",
                                                    to: "{page}",
                                                    Icon { name: icon }
                                                }
                                            }
                                        },
                                        NavigationInfo::IconToLink { icon, link } => {
                                            rsx! {
                                                a {
                                                    class: "text-gray-800 dark:text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium",
                                                    href: "{link}",
                                                    Icon { name: icon }
                                                }
                                            }
                                        },
                                        NavigationInfo::Feature { feature } => {
                                            if feature.as_str() == "mode-switch" {
                                                let icon = if crate::hooks::mode::is_dark(&cx) {
                                                    rsx! {
                                                        dioxus_free_icons::Icon {
                                                            icon: dioxus_free_icons::icons::fa_solid_icons::FaSun
                                                        }
                                                    }
                                                } else {
                                                    rsx! {
                                                        dioxus_free_icons::Icon {
                                                            icon: dioxus_free_icons::icons::fa_solid_icons::FaMoon
                                                        }
                                                    }
                                                };
                                                rsx! {
                                                    a {
                                                        class: "text-gray-800 dark:text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium",
                                                        href: "javascript:;",
                                                        onclick: move |_| {
                                                            crate::hooks::mode::mode(&cx, !dark_mode);
                                                            cx.needs_update();
                                                        },
                                                        icon
                                                    }
                                                }
                                            } else {
                                                rsx! {
                                                    strong {
                                                        "unknown feature"
                                                    }
                                                }
                                            }
                                        },
                                        NavigationInfo::PlainText { text } => {
                                            rsx! {
                                                span {
                                                    "{text}"
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
