use dioxus::core::ScopeState;
use dioxus_local_storage::use_local_storage;
use fermi::{use_read, use_set, Atom};

pub static DARK: Atom<bool> = Atom(|_| false);

pub fn is_dark(cx: &ScopeState) -> bool {
    use_read(cx, &DARK).clone()
}

pub fn mode(cx: &ScopeState, dark: bool) {
    let set_dark = use_set(cx, &DARK);
    set_dark(dark);
    let storage = use_local_storage(cx);
    let state = storage.insert("mode", if dark { "dark" } else { "light" });
    if dark && state {
        let _ = js_sys::eval("document.documentElement.classList.add('dark');");
    } else {
        let _ = js_sys::eval("document.documentElement.classList.remove('dark');");
    }
}

pub fn init_mode_info(cx: &ScopeState) {
    let storage = use_local_storage(cx);
    let v = cx.use_hook(move || {
        let dark = storage.get("mode").unwrap_or("light".to_string()) == "dark";
        if dark {
            let _ = js_sys::eval("document.documentElement.classList.add('dark');");
        } else {
            let _ = js_sys::eval("document.documentElement.classList.remove('dark');");
        }
        dark
    });
    let set_dark = use_set(cx, &DARK);
    set_dark(*v);
}
