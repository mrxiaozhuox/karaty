use dioxus::prelude::*;
use dioxus_retrouter::Link;
use karaty_blueprint::{TemplateDataType, TemplateProps, Templates};
use web_sys::{wasm_bindgen::JsValue, Blob};

#[allow(non_snake_case)]
pub fn HomePage(cx: Scope<TemplateProps>) -> Element {
    let Navbar = cx.props.utility.navbar;
    let Footer = cx.props.utility.footer;

    cx.render(rsx! {
        Navbar {}

        main {
            class: "flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-14 mt-12 sm:mb-12 mb-8",
            a {
                class: "border rounded-2xl py-1 px-4 text-slate-500 dark:text-slate-300 text-sm mb-5 hover:scale-105 \
                    transition duration-300 ease-in-out",
                href: "https://github.com/mrxiaozhuox/karaty",
                rel: "noreferrer",
                target: "_blank",
                "If you enjoy this project please give us a star ⭐"
            }
            h1 {
                class: "mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal \
                        text-slate-900 dark:text-slate-200 sm:text-7xl",
                span {
                    class: "relative whitespace-nowrap text-blue-600 dark:text-blue-400",
                    svg {
                        class: "absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70 dark:fill-blue-800/90",
                        "aria-hidden": "true",
                        "viewBox": "0 0 418 42",
                        "preserveAspectRatio": "none",
                        path {
                            d: "M203.371.916c-26.013-2.078-76.686 1.963-124.73 \
                                9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 \
                                27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 \
                                17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 \
                                19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 \
                                12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 \
                                15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 \
                                7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 \
                                1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5\
                                .556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11\
                                .629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 \
                                23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"    
                        }
                    }
                    span {
                        class: "relative",
                        "Karaty.rs"
                    }
                }
            }
            p {
                class: "mx-auto mt-12 max-w-xl text-lg text-slate-700 dark:text-slate-200 leading-7",
                "Karaty is a open-source static website generator. \
                With its amazing flexibility, and support embedded Dioxus components."
            }
            div {
                class: "sm:mt-10 mt-8",
                a {
                    class: "bg-blue-600 dark:bg-blue-600 rounded-xl text-white dark:text-white font-medium px-4 py-3 \
                    hover:bg-blue-600/80 dark:hover:bg-blue-600/90",
                    href: "https://github.com/mrxiaozhuox/karaty/releases",
                    "Download"
                }
                Link {
                    class: "bg-black dark:bg-white rounded-xl text-white dark:text-black font-medium ml-2 px-4 py-3 \
                    hover:bg-black/80 dark:hover:bg-white/90",
                    to: "docs",
                    "Quick Start →"
                }
            }
        }        

        div {
            class: "container mx-auto",
            hr {
                class: "w-1/2 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-6 dark:bg-gray-700"
            }
            div {
                class: "flex justify-center mb-2 md:mb-4 space-x-2",
                img {
                    class: "w-24 md:w-36 h-auto",
                    src: "https://img.shields.io/github/v/release/mrxiaozhuox/karaty?style=for-the-badge&label=Latest%20Version"
                }
                img {
                    class: "w-24 md:w-36 h-auto",
                    src: "https://img.shields.io/github/actions/workflow/status/mrxiaozhuox/karaty/main.yml?style=for-the-badge&label=Workflow"
                }
                img {
                    class: "w-24 md:w-36 h-auto",
                    src: "https://img.shields.io/github/commit-activity/y/mrxiaozhuox/karaty?style=for-the-badge"
                }
            }

            div {
                class: "flex flex-wrap p-8",
                div {
                    class: "w-full px-4 md:w-1/2 lg:w-1/3",
                    div {
                        class: "mb-5 rounded-xl h-52 py-8 px-7 dark:bg-gray-800 shadow-md \
                                transition-all hover:shadow-lg sm:p-9 lg:px-6 xl:px-9",
                        div {
                            class: "dark:text-white",
                            h3 {
                                class: "mb-4 text-xl font-bold sm:text-2xl lg:text-xl xl:text-2xl",
                                "Multi-File Support"
                            }
                            p {
                                class: "text-base font-medium text-body-color",
                                "You can use different templates to support different file types of rendering\
                                , such as Markdown, JSON or HTML."
                            }
                        }
                    }
                }
                div {
                    class: "w-full px-4 md:w-1/2 lg:w-1/3",
                    div {
                        class: "mb-5 rounded-xl h-52 py-8 px-7 dark:bg-gray-800 shadow-md \
                                transition-all hover:shadow-lg sm:p-9 lg:px-6 xl:px-9",
                        div {
                            class: "dark:text-white",
                            h3 {
                                class: "mb-4 text-xl font-bold sm:text-2xl lg:text-xl xl:text-2xl",
                                "Dioxus Components"
                            }
                            p {
                                class: "text-base font-medium text-body-color",
                                "Karaty allows you use Dioxus build your personal template, \
                                and you can import it into your website. (before build wasm file)"
                            }
                        }
                    }
                }
                div {
                    class: "w-full px-4 md:w-1/2 lg:w-1/3",
                    div {
                        class: "mb-5 rounded-xl h-52 py-8 px-7 dark:bg-gray-800 shadow-md 
                                \transition-all hover:shadow-lg sm:p-9 lg:px-6 xl:px-9",
                        div {
                            class: "dark:text-white",
                            h3 {
                                class: "mb-4 text-xl font-bold sm:text-2xl lg:text-xl xl:text-2xl",
                                "Based on GitHub"
                            }
                            p {
                                class: "text-base font-medium text-body-color",
                                "With the deployment of GitHub Pages, Karaty will be able to give \
                                full play to all the performance."
                            }
                        }
                    }
                }
            }

        }

        Footer {}
    })
}

#[allow(non_snake_case)]
pub fn IconsPage(cx: Scope<TemplateProps>) -> Element {
    let Navbar = cx.props.utility.navbar;
    let Footer = cx.props.utility.footer;
    let Markdown = cx.props.utility.renderers.get("markdown").unwrap().clone();

    let solid = [
        "house",
        "user",
        "music",
        "heart",
        "cloud",
        "bell",
        "globe",
        "bug",
        "sun",
        "moon",
        "shop",
        "car",
        "wallet",
        "book",
        "language",
        "tag",
        "tags",
        "play",
        "pause",
        "gear",
        "gears",
        "code",
        "comment",
        "comments",
        "spin",
        "info",
        "upload",
        "square",
        "table",
        "flag",
        "shield",
        "server"
    ];

    let brand = [
        "github",
        "gitlab",
        "linux",
        "apple",
        "android",
        "google",
        "paypal",
        "twitter",
        "instagram",
        "facebook",
        "linkedin",
        "twitch",
        "discord",
        "telegram",
        "tiktok",
        "steam",
        "amazon",
        "vimeo",
        "ebay",
        "apple-pay",
        "google-pay",
        "zhihu",
        "bilibili",
        "qq",
    ];

    let programming = [
        "rust",
        "python",
        "java",
        "golang",
        "php",
        "swift",
        "node-js",
        "css",
        "bootstrap",
        "docker",
        "react",
        "vue",
        "angular",
        "html",
        "javascript",
        "npm",
    ];

    let solid_rendered = solid.iter().map(|name| {
        let icon = format!(":{name}:");
        let icon_name = name.to_string();
        rsx! {
            a {
                class: "h-8 px-3 w-max flex gap-2 items-center \
                        rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 hover:bg-opacity-75 focus:bg-gray-300 \
                        focus:text-blue-900 active:text-primary active:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 \
                        dark:bg-gray-700 dark:text-gray-300 dark:active:text-primary text-xs",
                title: "{name}",
                onclick: move |_| {
                        let nav = web_sys::window().unwrap().navigator();
                        let cp = nav.clipboard();
                        let _r = cp.write_text(&format!(":{}:", icon_name));
                },
                Markdown { content: icon, config: Default::default() }
            }

        }
    });

    let brand_rendered = brand.iter().map(|name| {
        let icon = format!(":brand.{name}:");
        let icon_name = name.to_string();
        rsx! {
            a {
                class: "h-8 px-3 w-max flex gap-2 items-center \
                        rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 hover:bg-opacity-75 focus:bg-gray-300 \
                        focus:text-blue-900 active:text-primary active:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 \
                        dark:bg-gray-700 dark:text-gray-300 dark:active:text-primary text-xs",
                title: "{name}",
                onclick: move |_| {
                        let nav = web_sys::window().unwrap().navigator();
                        let cp = nav.clipboard();
                        let _r = cp.write_text(&format!(":brand.{}:", icon_name));
                },
                Markdown { content: icon, config: Default::default() }
            }

        }
    });


    let programming_rendered = programming.iter().map(|name| {
        let icon = format!(":programming.{name}:");
        let icon_name = name.to_string();
        rsx! {
            a {
                class: "h-8 px-3 w-max flex gap-2 items-center \
                        rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 hover:bg-opacity-75 focus:bg-gray-300 \
                        focus:text-blue-900 active:text-primary active:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 \
                        dark:bg-gray-700 dark:text-gray-300 dark:active:text-primary text-xs",
                title: "{name}",
                onclick: move |_| {
                        let nav = web_sys::window().unwrap().navigator();
                        let cp = nav.clipboard();
                        let _r = cp.write_text(&format!(":programming.{}:", icon_name));
                },
                Markdown { content: icon, config: Default::default() }
            }

        }
    });

    cx.render(rsx! {
        Navbar {}

        div {
            class: "container mx-auto",
            div {
                class: "my-4",
                h2 {
                    class: "text-2xl font-mono font-bold dark:text-gray-200",
                    "Solid Icon"
                }
                hr { class: "h-px bg-gray-200 border-0 dark:bg-gray-700" }
            }
            div {
                class: "grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4",
                solid_rendered
            }
            div {
                class: "mt-8 mb-4",
                h2 {
                    class: "text-2xl font-mono font-bold dark:text-gray-200",
                    "Brand Icon"
                }
                hr { class: "h-px bg-gray-200 border-0 dark:bg-gray-700" }
            }
            div {
                class: "grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4",
                brand_rendered
            }
            div {
                class: "mt-8 mb-4",
                h2 {
                    class: "text-2xl font-mono font-bold dark:text-gray-200",
                    "Programming Icon"
                }
                hr { class: "h-px bg-gray-200 border-0 dark:bg-gray-700" }
            }
            div {
                class: "grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4",
                programming_rendered
            }
        }

        Footer {}
    })
}

pub fn export() -> Templates {
    let mut list = Templates::new();
    
    list.template("home", vec![TemplateDataType::Any], HomePage);
    list.template("icons", vec![TemplateDataType::Any], IconsPage);

    list
}
