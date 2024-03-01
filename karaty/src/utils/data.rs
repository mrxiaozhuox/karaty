use std::collections::HashMap;

use anyhow::anyhow;
use async_recursion::async_recursion;
use karaty_blueprint::{TemplateData, Templates};
use serde::Deserialize;

use crate::config::{Config, RoutingInfo, TemplateConfig};

#[derive(Debug, Clone)]
pub struct GlobalData {
    pub config: Config,
    pub routing: Vec<RoutingInfo>,
    pub template_config: TemplateConfig,
    pub templates: HashMap<String, Templates>,
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
        if host.as_str() == "localhost"
            || host.as_str() == "127.0.0.1"
            || host.starts_with("192.168")
        {
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

pub async fn load_content_list(config: &Config, sub_path: &str) -> Vec<(String, String)> {
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
        if host.as_str() == "localhost"
            || host.as_str() == "127.0.0.1"
            || host.starts_with("192.168")
        {
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
                let file_name = data.get("name").unwrap().as_str().unwrap().to_string();
                result.push((
                    data.get("type").unwrap().as_str().unwrap().to_string(),
                    file_name,
                ));
            }
        }
    }

    result
}

#[allow(dead_code)]
pub async fn load_all_data(config: &Config) -> HashMap<String, TemplateData> {
    let mut result = HashMap::new();
    let contents = load_content_list(config, "./").await;
    for (tp, name) in contents {
        let path = format!("{name}");
        let content = if tp == "file" {
            let content = load_from_source(config, &path).await;
            content.map(|v| TemplateData::File(v))
        } else {
            let dirs = load_content_list(config, &path).await;
            let dirs = dirs
                .iter()
                .map(|v| (v.0.clone(), format!("{name}/{}", v.1)))
                .collect();
            let dir = load_page_from_dir(config, dirs).await;
            dir
        };
        if let Ok(content) = content {
            result.insert(name.to_string(), content);
        }
    }
    result
}

#[async_recursion(?Send)]
pub async fn load_page_from_dir(
    config: &Config,
    contents: Vec<(String, String)>,
) -> anyhow::Result<TemplateData> {
    let mut result = HashMap::new();
    for (tp, url) in contents {
        let part_name = url.split('/').last().unwrap_or("").to_string();
        if tp == "file" {
            let content = load_from_source(config, &url).await?;
            result.insert(part_name, TemplateData::File(content));
        } else {
            let items = load_content_list(config, &url).await;
            let items: Vec<(String, String)> = items
                .iter()
                .map(|(t, i)| (t.clone(), format!("{url}/{i}")))
                .collect();
            let content = load_page_from_dir(config, items).await?;
            result.insert(part_name, content);
        }
    }
    Ok(TemplateData::Directory(result))
}

#[derive(Deserialize)]
struct RoutingWrap {
    routing: Vec<RoutingInfo>,
}

pub async fn load_routing_file(url: &str) -> anyhow::Result<Vec<RoutingInfo>> {
    let content = gloo::net::http::Request::get(url)
        .send()
        .await?
        .text()
        .await?;
    Ok(toml::from_str::<RoutingWrap>(&content)?.routing)
}

pub async fn load_template_file(url: &str) -> anyhow::Result<TemplateConfig> {
    let content = gloo::net::http::Request::get(url)
        .send()
        .await?
        .text()
        .await?;
    Ok(toml::from_str(&content)?)
}
