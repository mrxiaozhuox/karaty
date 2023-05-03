pub use dioxus::prelude::*;
use dioxus_router::Link;

use crate::{components::icon::Icon, config::NavigationInfo, utils::data::GlobalData};

pub fn Navbar(cx: Scope) -> Element {
    let data = cx.consume_context::<GlobalData>().unwrap();
    let config = data.config;
    let nav = config.navigation.content.clone();

    let dark_mode = crate::hooks::mode::is_dark(&cx);

    let mobile_navbar = use_state(&cx, || false);

    cx.render(rsx! {
        nav { class: "bg-gray-100 dark:bg-purple-900",
            div { class: "max-w-7xl mx-auto px-2 sm:px-6 lg:px-8",
                div { class: "sm:relative flex items-center justify-between h-16",
                    div { class: "flex-1 flex items-center justify-center sm:items-stretch sm:justify-start",
                        div { class: "hidden sm:block",
                            Link {
                                class: "flex-shrink-0 flex items-center font-bold text-2xl dark:text-white",
                                to: "/",
                                "{config.site.name}"
                            }
                        }
                        div { class: "sm:hidden",
                            a {
                                class: "flex-shrink-0 flex items-center font-bold text-2xl dark:text-white",
                                href: "javascript:;",
                                onclick: move |_| {
                                    mobile_navbar.set(!mobile_navbar.get());
                                },
                                "{config.site.name}"
                            }
                        }
                        div { class: "hidden sm:block sm:ml-6 absolute right-0",
                            div { class: "flex space-x-4",
                                nav.iter().map(|v| {
                                    match v.clone() {
                                        NavigationInfo::TextToPage { text, page } => {
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
                                        NavigationInfo::IconToPage { icon, page } => {
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
                                                    Icon {
                                                        class: "dark:text-white text-dark".to_string(),
                                                        name: icon
                                                    }
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
                if *mobile_navbar.get() {
                    rsx! {
                        div { class: "sm:hidden",
                            div { class: "flex flex-col bg-gray-100 dark:bg-purple-900 rounded-lg",
                                nav.iter().map(|v| {
                                    let link_class = "m-2 font-semibold dark:text-gray-200 flex justify-center";
                                    match v {
                                        NavigationInfo::TextToPage { text, page } => {
                                            rsx! {
                                                Link {
                                                    class: "{link_class}",
                                                    to: "{page}",
                                                    "{text}"
                                                }
                                            }
                                        }
                                        NavigationInfo::TextToLink { text, link } => {
                                            rsx! {
                                                a {
                                                    class: "{link_class}",
                                                    href: "{link}",
                                                    "{text}"
                                                }
                                            }
                                        }
                                        NavigationInfo::IconToPage { icon, page } => {
                                            rsx! {
                                                Link {
                                                    class: "{link_class}",
                                                    to: "{page}",
                                                    Icon { name: icon.to_string() }
                                                }
                                            }
                                        }
                                        NavigationInfo::IconToLink { icon, link } => {
                                            rsx! {
                                                a {
                                                    class: "{link_class}",
                                                    href: "{link}",
                                                    Icon { name: icon.to_string() }
                                                }
                                            }
                                        }
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
                                                        class: "{link_class}",
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
                                        }
                                        NavigationInfo::PlainText { text } => {
                                            rsx! {
                                                span {
                                                    class: "{link_class}",
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
