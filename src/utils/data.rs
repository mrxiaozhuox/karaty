use anyhow::anyhow;
use serde::{Deserialize, Serialize};

use crate::config::{Config, PersonalInfoConfig};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(tag = "type")]
pub enum ComplexContent {
    #[serde(rename = "paragraph")]
    Paragraph { value: Vec<ComplexContent> },
    #[serde(rename = "text")]
    Text { text: String },
    #[serde(rename = "link")]
    Link { url: String, text: String },
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
    let source_mode = &config.deploy.data_source.mode;
    let source_data = &config.deploy.data_source.data;

    log::error!("{}", source_mode);

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
        "sub-path" => {
            let source = config.deploy.repository.clone();
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
        _ => {}
    }
    return Err(anyhow!("Unknown load mode"));
}

pub async fn load_personal_info(config: &mut Config) {
    let data = load_from_source(config, "/config/personal.json").await;
    if let Ok(data) = data {
        let res = serde_json::from_str::<PersonalInfoConfig>(&data);
        if let Ok(data) = res {
            config.personal = data;
        } else if let Err(e) = res {
            log::error!("Load personal info failed: {}", e);
        }
    }
}
