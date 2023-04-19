use std::collections::HashMap;

use anyhow::anyhow;

use crate::config::Config;

#[derive(Debug, Clone)]
pub struct GlobalData {
    pub config: Config,
    pub pages: HashMap<String, String>,
}

pub fn get_raw_data_url(service: &str, name: &str, branch: &str) -> Option<String> {
    match service.to_lowercase().as_str() {
        "github" => Some(format!(
            "https://raw.githubusercontent.com/{}/{}",
            name, branch,
        )),
        "gitee" => Some(format!("https://gitee.com/{}/raw/{}", name, branch)),
        _ => None,
    }
}

pub async fn load_from_source(config: &Config, sub_path: &str) -> anyhow::Result<String> {
    let window = web_sys::window().unwrap();
    let host = window.location().host().unwrap();
    let host = host
        .split(":")
        .collect::<Vec<&str>>()
        .first()
        .unwrap()
        .to_string();

    let mut source_mode = config.data_source.mode.clone();
    let mut source_data = config.data_source.data.clone();
    if let Some(local) = config.data_source.local.clone() {
        if host.as_str() == "localhost" || host.as_str() == "127.0.0.1" {
            source_mode = local.mode;
            source_data = local.data;
        }
    }

    match source_mode.to_lowercase().as_str() {
        "independent-repository" => {
            let source = source_data.as_table().unwrap();

            let service = source.get("service").unwrap().as_str().unwrap();
            let name = source.get("name").unwrap().as_str().unwrap();
            let branch = source.get("branch").unwrap().as_str().unwrap();

            let raw_url = get_raw_data_url(service, name, branch).expect("service not found");

            let response = gloo::net::http::Request::get(&format!("{}{}", raw_url, sub_path))
                .send()
                .await?;

            return Ok(response.text().await?);
        }
        "embedded-repository" => {
            let source = config.repository.clone();
            let service = source.service;
            let name = source.name;
            let branch = source.branch;

            let sub_folder = source_data.as_str().unwrap();

            let raw_url = get_raw_data_url(&service, &name, &branch).expect("service not found");

            let response =
                gloo::net::http::Request::get(&format!("{}/{}/{}", raw_url, sub_folder, sub_path))
                    .send()
                    .await?;
            return Ok(response.text().await?);
        }
        "custom-url" => {
            let source = source_data.as_table().unwrap();
            let url = source.get("url").unwrap().as_str().unwrap();
            let url = format!("{}/{}", url, sub_path);
            let response = gloo::net::http::Request::get(&url).send().await?;
            return Ok(response.text().await?);
        }
        _ => {}
    }
    return Err(anyhow!("Unknown load mode"));
}

pub async fn load_content_list(config: &Config, sub_path: &str) -> Vec<String> {
    let mut result = Vec::new();

    let window = web_sys::window().unwrap();
    let host = window.location().host().unwrap();
    let host = host
        .split(":")
        .collect::<Vec<&str>>()
        .first()
        .unwrap()
        .to_string();

    let mut source_mode = config.data_source.mode.clone();
    let mut source_data = config.data_source.data.clone();
    if let Some(local) = config.data_source.local.clone() {
        if host.as_str() == "localhost" || host.as_str() == "127.0.0.1" {
            source_mode = local.mode;
            source_data = local.data;
        }
    }

    let target = match source_mode.to_lowercase().as_str() {
        "independent-repository" => {
            let source = source_data.as_table().unwrap();

            let name = source.get("name").unwrap().as_str().unwrap().to_string();
            let branch = source.get("branch").unwrap().as_str().unwrap().to_string();

            format!(
                "https://api.github.com/repos/{}/contents/{}?ref={}",
                name, sub_path, branch
            )
        }
        "embedded-repository" => {
            let source = config.repository.clone();
            let name = source.name;
            let branch = source.branch;

            let sub_folder = source_data.as_str().unwrap();

            format!(
                "https://api.github.com/repos/{}/contents/{}/{}?ref={}",
                name, sub_folder, sub_path, branch,
            )
        }
        "custom-url" => {
            let source = source_data.as_table().unwrap();
            let url = source.get("url").unwrap().as_str().unwrap();
            let index = source.get("index-file").unwrap().as_str().unwrap();
            format!("{}/{}/{}", url, sub_path, index)
        }
        _ => {
            panic!("Not Found");
        }
    };

    let resp = gloo::net::http::Request::get(&target).send().await;

    if let Ok(resp) = resp {
        let res = resp.json::<Vec<serde_json::Value>>().await;
        if let Ok(list) = res {
            for data in list {
                if data.get("type").unwrap().as_str().unwrap() == "file" {
                    let file_name = data.get("name").unwrap().as_str().unwrap().to_string();
                    result.push(file_name);
                }
            }
        }
    }

    result
}

pub async fn load_pages(config: &Config) -> HashMap<String, String> {
    let mut result = HashMap::new();
    let contents = load_content_list(config, "pages").await;
    for name in contents {
        let path = format!("/pages/{name}");
        let content = load_from_source(config, &path).await;
        if let Ok(content) = content {
            result.insert(name.to_string(), content);
        }
    }
    result
}
