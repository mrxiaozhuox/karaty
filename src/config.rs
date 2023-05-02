use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    pub site: SiteConfig,

    pub repository: DeployRepositoryConfig,

    pub routing: Vec<RoutingInfo>,

    #[serde(rename = "data-source")]
    pub data_source: DeployDataSourceConfig,

    pub navigation: NavigationConfig,

    pub footer: FooterConfig,
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
    #[serde(default = "default_branch")]
    pub branch: String,
}

fn default_branch() -> String {
    String::from("main")
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeployDataSourceConfig {
    pub mode: String,
    pub data: toml::Value,
    #[serde(default)]
    pub local: Option<DeployLocalDataSourceConfig>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeployLocalDataSourceConfig {
    pub mode: String,
    pub data: toml::Value,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NavigationConfig {
    pub links: Vec<NavigationInfo>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FooterConfig {
    pub content: Vec<Vec<NavigationInfo>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(untagged)]
pub enum NavigationInfo {
    TextToPage { text: String, page: String },
    TextToLink { text: String, link: String },

    IconToPage { icon: String, page: String },
    IconToLink { icon: String, link: String },

    Feature { feature: String },

    PlainText { text: String },
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(untagged)]
pub enum RoutingInfo {
    FileBind {
        path: String,
        file: String,
        #[serde(default)]
        template: Option<toml::Value>,
    },
    PresetBind {
        path: String,
        preset: String,
        #[serde(default)]
        setting: Option<toml::Value>,
        #[serde(default)]
        template: Option<toml::Value>,
    },
    RedirectBind {
        path: String,
        redirect: String,
    },
}
