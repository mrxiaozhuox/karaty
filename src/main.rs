#![allow(non_snake_case)]

use dioxus::prelude::*;
use dioxus_router::{Router, Route};
use dioxus_toast::{ToastFrame, ToastManager};

mod setup;

mod components;
mod hooks;
mod pages;

use fermi::use_init_atom_root;
use hooks::mode::init_mode_info;

use pages::*;

static TOAST_MANAGER: fermi::AtomRef<ToastManager> = |_| ToastManager::default();

fn main() {
    wasm_logger::init(wasm_logger::Config::default());
    log::info!("Powered by Dioxus Starter: https://github.com/mrxiaozhuox/dioxus-starter");
    dioxus_web::launch(App)
}

fn App(cx: Scope) -> Element {
    // init mode information
    init_mode_info(&cx);
    use_init_atom_root(&cx);
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
