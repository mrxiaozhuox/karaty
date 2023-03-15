use dioxus::prelude::*;
use fermi::use_init_atom_root;

use crate::{config::Config, hooks::mode::init_mode_info, utils::data::GlobalData};

pub async fn setup_config() -> anyhow::Result<Config> {
    let response = gloo::net::http::Request::get("/karaty.toml").send().await?;
    let content = response.text().await.unwrap_or_default();
    let result = toml::from_str::<Config>(&content)?;        
    Ok(result)
}

pub fn setup_root_app(cx: &Scope, data: GlobalData) -> anyhow::Result<()> {
    cx.provide_context(data.clone());
    let _ = js_sys::eval(&format!(
        "document.title = 'Home{}'",
        data.config.site.title_suffix
    ));

    if data.config.site.dark_mode {
        init_mode_info(&cx);
    }
    use_init_atom_root(&cx);

    // Print framework & project information to console
    cx.use_hook(|| {
        log::info!("Powered by Dioxus Starter: https://github.com/mrxiaozhuox/dioxus-starter");
        log::info!("Karaty Static Site: https://github.com/mrxiaozhuox/karaty")
    });

    Ok(())
}