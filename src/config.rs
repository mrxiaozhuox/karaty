use serde::{Deserialize, Serialize};

use crate::utils::data::ComplexContent;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    pub site: SiteConfig,
    pub deploy: DeployConfig,
    #[serde(default)]
    pub personal: PersonalInfoConfig,
    pub navigation: NavigationConfig,
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
pub struct DeployConfig {
    pub repository: DeployRepositoryConfig,
    #[serde(rename = "data-source")]
    pub data_source: DeployDataSourceConfig,
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

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct PersonalInfoConfig {
    pub username: String,
    pub avatar: String,
    pub bio: String,
    pub introducation: Vec<ComplexContent>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NavigationConfig {
    pub list: Vec<NavigationInfo>
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NavigationInfo {
    pub display: String,
    pub target: String,
    pub link: String,
}