pub use dioxus::prelude::*;
use dioxus_retrouter::Link;

use crate::{components::icon::Icon, config::NavigationInfo, utils::data::GlobalData};

pub fn Navbar(cx: Scope) -> Element {
    let data = cx.consume_context::<GlobalData>().unwrap();
    let config = data.config;
    let nav = config.navigation.content.clone();

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
                                    rsx! {
                                        NavItemMiddle { value: v.clone() }
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
                                    rsx! { NavItemMobile { value: v.clone() } }
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

#[component]
pub fn NavItemMiddle(cx: Scope, value: NavigationInfo) -> Element {
    let link_class = "text-gray-800 dark:text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
    let dark_mode = crate::hooks::mode::is_dark(&cx);
    let display = match value {
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
        NavigationInfo::Collection { text, list } => {
            rsx! {
                NavItemDropdown {
                    text: text.clone(),
                    list: list.clone(),
                }
            }
        }
        #[allow(unreachable_patterns)]
        _ => {
            rsx! { span { class: "hidden", "unknown" } }
        }
    };
    cx.render(display)
}

#[component]
pub fn NavItemDropdown(cx: Scope, text: String, list: Vec<NavigationInfo>) -> Element {
    let dropdown = use_state(&cx, || false);
    let li = list
        .iter()
        .map(|v| rsx! { NavItemMiddle { value: v.clone() } });
    cx.render(rsx! {
        div {
            class: "px-3 py-2 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-lg flex justify-center items-center",
            a {
                class: "text-gray-800 dark:text-gray-200 text-sm font-medium",
                href: "javascript:;",
                onclick: move |_| {
                    dropdown.set(!dropdown.get());
                },
                "{text}"
                dioxus_free_icons::Icon {
                    class: "inline-block ml-1",
                    height: 14,
                    width: 14,
                    icon: dioxus_free_icons::icons::fa_solid_icons::FaAngleDown
                }
            }
            if *dropdown.get() {
                rsx! {
                    div {
                        class: "absolute top-8 bg-white rounded-lg shadow dark:bg-purple-800",
                        div {
                            class: "p-2 flex flex-col",
                            li
                        }
                    }
                }
            }
        }
    })
}

#[component]
pub fn NavItemMobile(cx: Scope, value: NavigationInfo) -> Element {
    let link_class = "m-2 font-semibold dark:text-gray-200 flex justify-center";
    let dark_mode = crate::hooks::mode::is_dark(&cx);
    let display = match value {
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
        NavigationInfo::Collection { text, list } => {
            rsx! {
                NavItemDropdownMobile {
                    text: text.clone(),
                    list: list.clone(),
                }
            }
        }
        #[allow(unreachable_patterns)]
        _ => {
            rsx! { "unknown" }
        }
    };
    cx.render(display)
}

#[component]
pub fn NavItemDropdownMobile(cx: Scope, text: String, list: Vec<NavigationInfo>) -> Element {
    let dropdown = use_state(&cx, || false);
    let ls = list.iter().map(|v| {
        rsx! { NavItemMobile { value: v.clone() } }
    });
    cx.render(rsx! {
        div {
            class: "m-2 flex flex-col",
            a {
                class: "flex justify-center dark:text-gray-200 font-semibold",
                href: "javascript:;",
                onclick: move |_| {
                    dropdown.set(!dropdown.get());
                },
                "{text}"
            }
            if *dropdown.get() {
                rsx! {
                    div {
                        class: "mt-2 bg-gray-200 rounded-lg dark:bg-purple-800",
                        ls
                    }
                }
            }
        }
    })
}
