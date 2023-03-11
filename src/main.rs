#![allow(non_snake_case)]

use dioxus::prelude::*;
use dioxus_router::{Router, Route};
use dioxus_toast::{ToastFrame, ToastManager};

mod setup;
mod config;
mod utils;

mod components;
mod hooks;
mod pages;

use pages::*;
use setup::{setup_root_app, setup_config};

static TOAST_MANAGER: fermi::AtomRef<ToastManager> = |_| ToastManager::default();

fn main() {
    wasm_logger::init(wasm_logger::Config::default());
    dioxus_web::launch(App)
}

fn App(cx: Scope) -> Element {

    // init karaty root app
    let setup_config = use_future(&cx, (), |_| async move {
        setup_config().await
    });

    match setup_config.value() {
        Some(Some(config)) => {
            let _ = setup_root_app(&cx, config.clone());
        },
        Some(None) => {
            return cx.render(rsx! {
                div {
                    class: "h-screen flex justify-center items-center",
                    h1 {
                        class: "text-gray-500 text-3xl font-semibold",
                        "Configuration Load Faield"
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
        },
    }


    cx.render(rsx! {
        // dioxus toast manager init
        ToastFrame {
            manager: fermi::use_atom_ref(&cx, TOAST_MANAGER),
        }
        // dioxus router info
        Router {
            Route { to: "/", Home {} }
            Route { to: "/projects", Projects {} }
            Route { to: "/about", About { } }

            Route { to: "/blog", blog::BlogList {} }
            Route { to: "/blog/:path", blog::BlogPage {} }

            Route { to: "", _404::NotFound {} }
        }
    })
}
