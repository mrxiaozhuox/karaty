use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, PartialEq, Deserialize, Clone)]
pub struct Config {
    pub site: SiteConfig,

    pub repository: DeployRepositoryConfig,

    #[serde(default)]
    pub routing: Vec<RoutingInfo>,

    #[serde(rename = "data-source")]
    pub data_source: DeployDataSourceConfig,

    pub navigation: NavigationConfig,

    pub footer: FooterConfig,
}

#[derive(Debug, Serialize, PartialEq, Deserialize, Clone)]
pub struct SiteConfig {
    pub name: String,
    #[serde(rename = "title-suffix")]
    pub title_suffix: String,
    #[serde(rename = "dark-mode")]
    pub dark_mode: bool,
}

#[derive(Debug, Serialize, PartialEq, Deserialize, Clone)]
pub struct DeployRepositoryConfig {
    pub service: String,
    pub name: String,
    #[serde(default = "default_branch")]
    pub branch: String,
}

fn default_branch() -> String {
    String::from("main")
}

#[derive(Debug, Serialize, PartialEq, Deserialize, Clone)]
pub struct DeployDataSourceConfig {
    pub mode: String,
    pub data: toml::Value,
    #[serde(default)]
    pub local: Option<DeployLocalDataSourceConfig>,
}

#[derive(Debug, Serialize, PartialEq, Deserialize, Clone)]
pub struct DeployLocalDataSourceConfig {
    pub mode: String,
    pub data: toml::Value,
}

#[derive(Debug, Serialize, PartialEq, Deserialize, Clone)]
pub struct NavigationConfig {
    pub content: Vec<NavigationInfo>,
}

#[derive(Debug, Serialize, PartialEq, Deserialize, Clone)]
pub struct FooterConfig {
    pub content: Vec<Vec<NavigationInfo>>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(untagged)]
pub enum NavigationInfo {
    TextToPage {
        text: String,
        page: String,
    },
    TextToLink {
        text: String,
        link: String,
    },

    IconToPage {
        icon: String,
        page: String,
    },
    IconToLink {
        icon: String,
        link: String,
    },

    Feature {
        feature: String,
    },

    Collection {
        text: String,
        list: Vec<NavigationInfo>,
    },

    PlainText {
        text: String,
    },
}

#[derive(Debug, Serialize, PartialEq, Deserialize, Clone)]
#[serde(untagged)]
pub enum RoutingInfo {
    FileBind {
        path: String,
        file: String,
        #[serde(default)]
        template: String,
        #[serde(default)]
        config: Option<toml::Value>,
    },
    RedirectBind {
        path: String,
        redirect: String,
    },
}

#[derive(Debug, Serialize, PartialEq, Deserialize, Clone, Default)]
pub struct TemplateConfig {
    #[serde(default)]
    pub default: TemplateDefaultConfig,
}

#[derive(Debug, Serialize, PartialEq, Deserialize, Clone, Default)]
pub struct TemplateDefaultConfig {
    #[serde(rename = "file-type")]
    pub file_type: HashMap<String, String>,
}
