use crate::components::icon::Icon;
use dioxus::prelude::*;
use dioxus_free_icons::icons::fa_solid_icons;
use dioxus_retrouter::Link;

use crate::{
    hooks::mode::{is_dark, mode},
    utils::data::GlobalData,
};

pub fn Footer(cx: Scope) -> Element {
    let global = cx.consume_context::<GlobalData>().unwrap();
    let config = &global.config;

    let content = config.footer.content.clone();

    let dark_mode = is_dark(&cx);

    cx.render(rsx! {
        div {
            content.iter().enumerate().map(|(i, data)| {
                let m = if i == 0 { 8 } else { 4 };
                rsx! {
                    div {
                        class: "mt-{m} space-x-4 flex justify-center font-semibold",
                        data.iter().map(|info| {
                            match info.clone() {
                                crate::config::NavigationInfo::TextToPage { text, page } => {
                                    rsx! { 
                                        Link {
                                            class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                                            to: "{page}",
                                            "{text}"
                                        }
                                    }
                                },
                                crate::config::NavigationInfo::TextToLink { text, link } => {                                    
                                    rsx! { 
                                        a {
                                            class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                                            href: "{link}",
                                            "{text}"
                                        }
                                    }
                                },
                                crate::config::NavigationInfo::IconToPage { icon, page } => {
                                    rsx! { 
                                        Link {
                                            class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                                            to: "{page}",
                                            Icon { name: icon }
                                        }
                                    }
                                },
                                crate::config::NavigationInfo::IconToLink { icon, link } => {
                                    rsx! { 
                                        a {
                                            class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                                            href: "{link}",
                                            Icon {
                                                name: icon
                                            }
                                        }
                                    }
                                },
                                crate::config::NavigationInfo::Feature { feature } => {
                                    if feature == "mode-switch".to_string() {
                                        rsx! {
                                            a {
                                                class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                                                href: "javascript:;",
                                                onclick: move |_| {
                                                    mode(&cx, !dark_mode);
                                                    cx.needs_update();
                                                },
                                                if is_dark(&cx) {
                                                    rsx! {
                                                        dioxus_free_icons::Icon {
                                                            icon: fa_solid_icons::FaSun
                                                        }
                                                    }
                                                } else {
                                                    rsx! {
                                                        dioxus_free_icons::Icon {
                                                            icon: fa_solid_icons::FaMoon
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        rsx! { span { "unknown feature" } }
                                    }
                                },
                                crate::config::NavigationInfo::PlainText { text } => rsx! { span {
                                    class: "text-gray-500 dark:gray-100",
                                    "{text}" 
                                } },
                                _ => { rsx! { "unknown" } }
                            }
                        })
                    }
                }
            })
        }
        br {}
    })

    // cx.render(rsx! {
    //     div {
    //         div {
    //             class: "mt-8 flex space-x-4 justify-center font-semibold",
    //             Link {
    //                 class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
    //                 to: "/",
    //                 "Home"
    //             }
    //             Link {
    //                 class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
    //                 to: "/projects",
    //                 "Projects"
    //             }
    //             Link {
    //                 class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
    //                 to: "/blog",
    //                 "Blog"
    //             }
    //             Link {
    //                 class: "text-black dark:text-white hover:text-gray dark:hover:text-gray-200",
    //                 to: "/about",
    //                 "About"
    //             }
    //         }
    //         div {
    //             class: "mt-3 flex space-x-4 justify-center",
    //             a {
    //                 class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
    //                 href: "javascript:;",
    //                 onclick: move |_| {
    //                     mode(&cx, !dark_mode);
    //                     cx.needs_update();
    //                 },
    //                 if is_dark(&cx) {
    //                     rsx! {
    //                         Icon {
    //                             height: 26,
    //                             width: 26,
    //                             icon: fa_solid_icons::FaSun
    //                         }
    //                      }
    //                 } else {
    //                     rsx! {
    //                         Icon {
    //                             height: 26,
    //                             width: 26,
    //                             icon: fa_solid_icons::FaMoon
    //                         }
    //                      }
    //                 }
    //             }
    //             a {
    //                 class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
    //                 href: "https://github.com/mrxiaozhuox",
    //                 Icon {
    //                     height: 26,
    //                     width: 26,
    //                     icon: fa_brands_icons::FaGithub
    //                 }
    //             }
    //             a {
    //                 class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
    //                 href: "https://www.zhihu.com/people/mrxiao-zhuo-x",
    //                 Icon {
    //                     height: 26,
    //                     width: 26,
    //                     icon: fa_brands_icons::FaZhihu
    //                 }
    //             }
    //             a {
    //                 class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
    //                 href: "https://www.instagram.com/mrxiaozhuox/",
    //                 Icon {
    //                     height: 26,
    //                     width: 26,
    //                     icon: fa_brands_icons::FaInstagram
    //                 }
    //             }
    //             a {
    //                 class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
    //                 href: "https://twitter.com/mrxiaozhuox",
    //                 Icon {
    //                     height: 26,
    //                     width: 26,
    //                     icon: fa_brands_icons::FaTwitter
    //                 }
    //             }
    //         }
    //     }
    //     br {}
    // })
}
