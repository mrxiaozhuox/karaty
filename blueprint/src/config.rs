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

    pub giscus: Option<GiscusConfig>,
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

#[derive(Debug, Serialize, PartialEq, Deserialize, Clone)]
pub struct GiscusConfig {
    
    pub repo: String,
    #[serde(rename = "repo-id")]
    pub repo_id: String,
    pub category: String,
    #[serde(rename = "category-id")]
    pub category_id: String,
    #[serde(rename = "data-mapping")]
    #[serde(default = "giscus_default_mapping")]
    pub mapping: String,
    #[serde(rename = "data-strict")]
    #[serde(default = "default_true")]
    pub strict: bool,
    #[serde(default = "default_true")]
    pub reactions: bool,
    #[serde(rename = "emit-metadata")]
    #[serde(default = "default_false")]
    pub emit_metadata: bool,
    #[serde(rename = "input-position")]
    #[serde(default = "giscus_default_position")]
    pub input_position: String,
    #[serde(default = "giscus_default_theme")]
    pub theme: String,
    #[serde(default = "giscus_default_lang")]
    pub lang: String,
    #[serde(default = "giscus_default_crossorigin")]
    pub crossorigin: String,
}

fn giscus_default_mapping() -> String {
    String::from("pathname")
}

fn giscus_default_position() -> String {
    String::from("top")
}

fn giscus_default_theme() -> String {
    String::from("preferred_color_scheme")
}

fn giscus_default_lang() -> String {
    String::from("en")
}

fn giscus_default_crossorigin() -> String {
    String::from("anonymous")
}

fn default_true() -> bool {
    true
}

fn default_false() -> bool {
    false
}
