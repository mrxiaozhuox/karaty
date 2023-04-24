#![allow(non_snake_case)]

use dioxus::prelude::*;
use dioxus_router::{Route, Router};
use dioxus_toast::{ToastFrame, ToastManager};

mod config;
mod setup;
mod utils;

mod components;
mod hooks;
mod pages;

use pages::*;
use setup::{setup_config, setup_root_app};
use utils::data::{load_pages, GlobalData};

use crate::{config::RoutingInfo, pages::template::DynamicTemplate};

static TOAST_MANAGER: fermi::AtomRef<ToastManager> = |_| ToastManager::default();

fn main() {
    wasm_logger::init(wasm_logger::Config::default());
    dioxus_web::launch(App)
}

fn App(cx: Scope) -> Element {
    // init karaty root app
    let setup_config: &UseFuture<anyhow::Result<GlobalData, anyhow::Error>> =
        use_future(&cx, (), |_| async move {
            let config = setup_config().await?;
            Ok(GlobalData {
                config: config.clone(),
                pages: load_pages(&config).await,
            })
        });

    match setup_config.value() {
        Some(Ok(data)) => {
            let _ = setup_root_app(&cx, data.clone());

            cx.render(rsx! {
                // dioxus toast manager init
                ToastFrame {
                    manager: fermi::use_atom_ref(&cx, TOAST_MANAGER),
                }
                // dioxus router info
                Router {

                    data.config.routing.iter().map(|v| {
                        match v {
                            RoutingInfo::FileBind { path, file, template } => {
                                let content = data.pages.get(file);
                                if let Some(content) = content {
                                    rsx! {
                                        Route {
                                            to: "{path}",
                                            DynamicTemplate {
                                                name: file.to_string(),
                                                template: template.clone(),
                                                content: content.to_string(),
                                            }
                                        }
                                    }
                                } else {
                                    rsx! {
                                        Route {
                                            to: "{path}",
                                            _404::NotFound {}
                                        }
                                    }
                                }
                            }
                            RoutingInfo::PresetBind { path, preset } => {
                                match preset.as_str() {
                                    "post-list" => {
                                        rsx! {
                                            Route {
                                                to: "{path}",
                                                blog::BlogList {}
                                            }
                                        }
                                    }
                                    "post-content" => {
                                        rsx! {
                                            Route {
                                                to: "{path}",
                                                blog::BlogPage {}
                                            }
                                        }
                                    }
                                    _ => {
                                        rsx! {
                                            Route {
                                                to: "{path}",
                                                _404::NotFound {}
                                            }
                                        }
                                    }
                                }
                            }
                            RoutingInfo::RedirectBind { path, redirect } => {
                                rsx! {
                                    Route {
                                        to: "{path}",
                                        div {
                                            class: "h-screen flex justify-center items-center",
                                            p {
                                                class: "text-gray-500 text-3xl font-semibold",
                                                "Redirect..."
                                            }
                                        }
                                        dioxus_router::Redirect {
                                            to: "{redirect}"
                                        }
                                    }
                                }
                            }
                        }
                    })

                    Route { to: "", _404::NotFound {} }
                }
            })
        }
        Some(Err(e)) => {
            return cx.render(rsx! {
                div {
                    class: "h-screen flex justify-center items-center",
                    // p {
                    //     class: "text-gray-500 text-3xl font-semibold",
                    //     "Configuration Load Faield"
                    // }
                    p {
                        class: "text-gray-400 text-xl font-semibold",
                        "{e}"
                    }
                }
            });
        }
        None => {
            return cx.render(rsx! {
                div {
                    class: "h-screen flex justify-center items-center",
                    h1 {
                        class: "text-gray-500 text-3xl font-semibold",
                        "Loading ..."
                    }
                }
            });
        }
    }
}
