use std::collections::HashMap;

use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    pub site: SiteConfig,

    pub repository: DeployRepositoryConfig,
    
    #[serde(rename = "data-source")]
    pub data_source: DeployDataSourceConfig,
    
    pub navigation: NavigationConfig,
    
    pub page: PageConfig,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SiteConfig {
    pub name: String,
    #[serde(rename = "title-suffix")]
    pub title_suffix: String,
    #[serde(rename = "dark-mode")]
    pub dark_mode: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeployRepositoryConfig {
    pub service: String,
    pub name: String,
    #[serde(default = "default_master")]
    pub branch: String,
}

fn default_master() -> String {
    String::from("master")
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeployDataSourceConfig {
    pub mode: String,
    pub data: toml::Value,
}
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NavigationConfig {
    pub list: Vec<NavigationInfo>
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(untagged)]
pub enum NavigationInfo {
    Page { display: String, page: String },
    Link { display: String, link: String },
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PageConfig {
    pub homepage: String,
    pub list: HashMap<String, PageInfo>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct PageInfo {
    pub template: String,
    #[serde(rename = "file-suffix")]
    pub file_suffix: Option<String>,
}