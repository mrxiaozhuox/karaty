use dioxus::prelude::*;

use crate::{components::{footer::Footer, nav::Navbar, content::ComplexComponent}, config::Config};

pub mod _404;
pub mod blog;

pub fn Home(cx: Scope) -> Element {
    let config = cx.consume_context::<Config>().unwrap();
    cx.render(rsx! {
        section {
            class: "h-screen bg-cover bg-white dark:bg-gray-600",
            Navbar {}
            div {
                class: "flex h-4/6 w-full items-center justify-center container mx-auto px-8",
                div {
                    class: "max-w-2xl text-center",
                    img {
                        class: "rounded-lg w-32 mb-4 mx-auto",
                        src: "{config.personal.avatar}"
                    }
                    h5 {
                        class: "text-2xl dark:text-white font-medium leading-tight mb-2",
                        "{config.personal.username}"
                    }
                    p {
                        class: "text-gray-500 dark:text-gray-300",
                        "{config.personal.bio}"
                    }
                    div {
                        class: "mt-3 dark:text-gray-100",
                        ComplexComponent {
                            data: config.personal.introducation,
                        }
                    }
                    Footer {}
                }
            }
        }
    })
}

#[derive(Debug, Clone)]
struct Category {
    pub name: &'static str,
    pub projects: Vec<Project>,
}
#[derive(Debug, Clone)]
struct Project {
    pub name: &'static str,
    pub desc: &'static str,
    pub url: &'static str,
    pub job: &'static str,
}

pub fn Projects(cx: Scope) -> Element {
    let data: Vec<Category> = vec![
        Category {
            name: "Web Development",
            projects: vec![
                Project {
                    name: "LyApi",
                    desc: "A PHP web development framework",
                    url: "https://gitee.com/mrxzx/LyApi",
                    job: "Author",
                },
                Project {
                    name: "Denly",
                    desc: "A deno web development framework (closed)",
                    url: "https://github.com/mrxiaozhuox/denly",
                    job: "Author",
                },
                Project {
                    name: "Dioxus",
                    desc: "User interfaces that run anywhere.",
                    url: "https://dioxuslabs.com/",
                    job: "Member",
                },
            ],
        },
        Category {
            name: "Dioxus Ecosystem",
            projects: vec![
                Project {
                    name: "Dioxus Cli",
                    desc: "Tooling to supercharge dioxus projects",
                    url: "https://github.com/DioxusLabs/cli",
                    job: "Maintainer",
                },
                Project {
                    name: "Dioxus Starter",
                    desc: "Starter template for dioxus framework",
                    url: "https://github.com/mrxiaozhuox/dioxus-starter",
                    job: "Author",
                },
                Project {
                    name: "Dioxus Toast",
                    desc: "Add toast support for your dioxus project",
                    url: "https://github.com/mrxiaozhuox/dioxus-starter",
                    job: "Author",
                },
                Project {
                    name: "Diogen",
                    desc: "A static site generator powered by dioxus [WIP]",
                    url: "https://github.com/mrxiaozhuox/diogen",
                    job: "Author"
                }
            ],
        },
        Category {
            name: "Database System",
            projects: vec![
                Project {
                    name: "Dorea",
                    desc: "A Key-Value data storage system",
                    url: "https://github.com/mrxiaozhuox/dorea",
                    job: "Author"
                },
                Project {
                    name: "Doson",
                    desc: "Doson structure parser - The extended format of json",
                    url: "https://github.com/doreadb/doson",
                    job: "Author",
                }
            ],
        },
        Category {
            name: "Website | Online Tool",
            projects: vec![
                Project {
                    name: "Teacher Pod",
                    desc: "Podcast app for learning",
                    url: "https://github.com/commune-org/teacher-pod",
                    job: "Full-Stack Developer"
                },
                Project {
                    name: "Dioxus Hackernews",
                    desc: "Hackernews made with Dioxus",
                    url: "https://github.com/mrxiaozhuox/dioxus-hackernews",
                    job: "Author"
                }
            ],
        },
        Category {
            name: "Rust Dev Crates",
            projects: vec![
                Project {
                    name: "Metadata Parser",
                    desc: "parse & get markdown meta-data | Rust Library |",
                    url: "https://github.com/mrxiaozhuox/markdown-meta-parser",
                    job: "Author"
                }
            ]
        }
    ];

    let displayer = data.iter().map(|v| {
        rsx! {
            h2 {
                class: "text-xl font-bold",
                "# {v.name}"
            }
            div {
                class: "mt-4 grid md:grid-cols-2 gap-2 mb-8",
                v.projects.iter().map(|p| {
                    rsx! {
                        a {
                            class: "block p-4 rounded-lg shadow-lg bg-white w-64 dark:bg-gray-700 hover:bg-gray-200",
                            href: "{p.url}",
                            target: "_blank",
                            h5 {
                                class: "text-gray-900 dark:text-white text-xl leading-tight font-semibold mb-2",
                                "{p.name}"
                            }
                            p {
                                class: "text-gray-700 dark:text-gray-200 text-base mb-2",
                                "{p.desc}"
                            }
                            p {
                                class: "text-gray-400 dark:text-gray-500 text-base",
                                "{p.job}"
                            }
                        }
                    }
                })
            }
        }
    });

    cx.render(rsx! {
        section {
            class: "bg-cover bg-white dark:bg-gray-600 dark:text-white",
            Navbar {}
            div {
                class: "flex h-full w-full items-center justify-center container mx-auto px-8",
                div {
                    class: "max-w-5xl text-center",
                    displayer
                    Footer {}
                }
            }
        }
    })
}

pub fn About(cx: Scope) -> Element {
    cx.render(rsx! {
        section {
            class: "bg-cover bg-white dark:bg-gray-600 dark:text-white",
            Navbar {}
            div {
                class: "flex h-full w-full items-center justify-center container mx-auto px-8",
                div {
                    class: "max-w-5xl text-center",
                    img {
                        class: "rounded-lg w-32 mb-4 mx-auto",
                        src: "https://avatars.githubusercontent.com/u/41265098?v=4"
                    }
                    div {
                        class: "space-y-4 text-gray-900 dark:text-gray-300",
                        p {
                            "Hi, My name is YuKun Liu, currently I'm a student in "
                            strong {
                                class: "underline",
                                "San Jose State University"
                            }
                            "."
                        }
                        p {
                            "My email - ",
                            a {
                                class: "underline font-bold",
                                href: "mailto:mrxzx.info@gmail.com",
                                "mrxzx.info@gmail.com"
                            }
                        }
                        p {
                            "My hometown - ",
                            strong {
                                "ChengDu, China 🐼"
                            }
                        }
                        p {
                            "My favorite tech stack - ",
                            strong {
                                "Rust, Typescript, Postgresql, Redis",
                            }
                        }
                        p {
                            "or you can use "
                            a {
                                class: "font-bold",
                                href: "javascript:;",
                                title: "mrxiaozhuox",
                                "Wechat"
                            }
                            " & "
                            a {
                                class: "font-bold",
                                href: "javascript:;",
                                title: "3507952990",
                                "QQ"
                            }
                            " to contact me."
                        }
                    }
                    Footer {}
                }
            }
        }
    })
}
