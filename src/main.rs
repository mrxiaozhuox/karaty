#![allow(non_snake_case)]

use std::collections::HashMap;

use dioxus::prelude::*;
use dioxus_retrouter::{Route, Router};
use dioxus_toast::{ToastFrame, ToastManager};

mod config;
mod setup;
mod utils;

mod components;
mod hooks;
mod pages;

use setup::{setup_config, setup_root_app};
use utils::{
    data::{load_routing_file, load_template_file, GlobalData},
    template_loader,
};

use crate::{components::loading::Loading, config::RoutingInfo, pages::template::DynamicTemplate};

static TOAST_MANAGER: fermi::AtomRef<ToastManager> = fermi::AtomRef(|_| ToastManager::default());

fn main() {
    wasm_logger::init(wasm_logger::Config::default());
    dioxus_web::launch(App)
}

fn App(cx: Scope) -> Element {
    // init karaty root app
    let setup_config: &UseFuture<anyhow::Result<GlobalData, anyhow::Error>> =
        use_future(&cx, (), |_| async move {
            let config = setup_config().await?;
            let mut routing = config.routing.clone();

            // load content from config directory
            let routing_ext = load_routing_file("/config/routing.toml")
                .await
                .unwrap_or_default();
            routing.extend(routing_ext);
            let template_config = load_template_file("/config/template.toml")
                .await
                .unwrap_or_default();

            // load custom template list
            let templates = template_loader::loader();

            Ok(GlobalData {
                config: config.clone(),
                routing,
                template_config,
                templates,
            })
        });

    match setup_config.value() {
        Some(Ok(data)) => {
            let _ = setup_root_app(&cx, data.clone());

            cx.render(rsx! {
                // dioxus toast manager init
                ToastFrame {
                    manager: fermi::use_atom_ref(&cx, &TOAST_MANAGER),
                }
                // dioxus router info
                Router {

                    data.routing.iter().map(|v| {
                        match v {
                            RoutingInfo::FileBind { path, file, template, config } => {
                                    let config = {
                                        if config.is_none() {
                                            HashMap::new()
                                        } else {
                                            let config = config.clone().unwrap();
                                            let config = config.as_table();
                                            config.map(|v| {
                                                let mut t = HashMap::new();
                                                for i in v {
                                                   t.insert(i.0.clone(), i.1.clone());
                                                }
                                                t
                                            }).unwrap_or_default()
                                        }
                                    };
                                    rsx! {
                                        Route {
                                            to: "{path}",
                                            DynamicTemplate {
                                                path: path.to_string(),
                                                name: file.to_string(),
                                                template: template.clone(),
                                                file: file.clone(),
                                                config: config,
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
                                        dioxus_retrouter::Redirect {
                                            to: "{redirect}"
                                        }
                                    }
                                }
                            }
                        }
                    })

                    Route {
                        to: "/_test",
                        div {
                            crate::components::markdown::Markdown {
                                content: "hello **dioxus**!".to_string(),
                                config: Default::default(),
                            }
                        }
                    }

                    Route { to: "", pages::error::PageNotFound {} }
                }
            })
        }
        Some(Err(e)) => {
            return cx.render(rsx! {
                div {
                    class: "h-screen flex justify-center items-center",
                    p {
                        class: "text-gray-400 text-xl font-semibold",
                        "{e}"
                    }
                }
            });
        }
        None => {
            return cx.render(rsx! {
                Loading {}
            });
        }
    }
}
