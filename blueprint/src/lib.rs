use std::collections::HashMap;

use dioxus::{
    core::{Element, Scope},
    core_macro::Props,
};

pub use toml::Value;
pub mod config;

#[derive(Debug, Props, PartialEq)]
pub struct TemplateProps {
    pub path: TemplatePathData,
    pub data: TemplateData,
    pub utility: SharedUtility,
    pub config: HashMap<String, Value>,
}

#[derive(Debug, Props, PartialEq)]
pub struct TemplatePathData {
    pub bind: String,
    pub access: String,
    pub segments: HashMap<String, String>,
}

#[derive(Debug, PartialEq)]
pub struct SharedUtility {
    pub footer: fn(Scope) -> Element,
    pub navbar: fn(Scope) -> Element,
    pub _404: fn(Scope) -> Element,
    pub error: fn(Scope<ErrorProps>) -> Element,
    pub renderers: HashMap<String, fn(Scope<RendererProps>) -> Element>,
    pub app_config: config::Config,
}

#[derive(Debug, Props, PartialEq)]
pub struct ErrorProps {
    pub title: String,
    pub content: String,
}

#[derive(Debug, Props, PartialEq)]
pub struct RendererProps {
    pub content: String,
    pub config: HashMap<String, Value>,
}

/// use for store template load data.
#[derive(Debug, Clone, PartialEq)]
pub enum TemplateData {
    /// File provide a single file content.
    File(String),
    /// Directory will provide a directory struct and inner data.
    Directory(HashMap<String, TemplateData>),
}

impl TemplateData {
    pub fn text(&self) -> String {
        match self {
            TemplateData::File(content) => content.to_string(),
            TemplateData::Directory(dir) => format!("{:?}", dir),
        }
    }
    pub fn get(&self, mut index: Vec<String>) -> Option<TemplateData> {
        if index.is_empty() {
            return None;
        }
        let first = index.remove(0);

        match self {
            TemplateData::File(_) => {
                if index.is_empty() {
                    Some(self.clone())
                } else {
                    None
                }
            }
            TemplateData::Directory(dir) => {
                if let Some(next) = dir.get(&first) {
                    if index.is_empty() {
                        Some(next.clone())
                    } else {
                        next.get(index)
                    }
                } else {
                    None
                }
            }
        }
    }
}

pub type Component = fn(Scope<TemplateProps>) -> Element;

type TemplatesData = HashMap<TemplateDataType, HashMap<String, Component>>;

#[derive(Debug)]
pub struct Templates(TemplatesData);
impl Templates {
    pub fn new() -> Self {
        Self(Default::default())
    }

    pub fn insert(&mut self, name: &str, data_type: Vec<TemplateDataType>, template: Component) {
        for i in data_type {
            if self.0.contains_key(&i) {
                let t = self.0.get_mut(&i).unwrap();
                t.insert(name.to_string(), template);
            } else {
                let mut t = HashMap::new();
                t.insert(name.to_string(), template);
                self.0.insert(i, t);
            }
        }
    }

    pub fn sub_module(&mut self, name: &str, templates: Self) {
        for (k, i) in templates.0 {
            for j in i {
                self.insert(&format!("{name}::{}", j.0), vec![k.clone()], j.1);
            }
        }
    }

    pub fn load(&self, name: &str, data_type: TemplateDataType) -> Option<&Component> {
        if self.0.contains_key(&data_type) {
            let part = self.0.get(&data_type).unwrap();
            part.get(name)
        } else {
            None
        }
    }
}

#[derive(Debug, Eq, Hash, PartialEq, Clone)]
pub enum TemplateDataType {
    Markdown,
    HTML,
    DirectoryData,
    Any,
    Other(String),
}

impl TemplateDataType {
    pub fn to_string(&self) -> String {
        match self {
            TemplateDataType::Markdown => "md",
            TemplateDataType::HTML => "html",
            TemplateDataType::DirectoryData => "#dir",
            TemplateDataType::Any => "*",
            TemplateDataType::Other(s) => s,
        }
        .to_string()
    }

    pub fn from_string(s: &str) -> Self {
        match s {
            "md" => TemplateDataType::Markdown,
            "html" => TemplateDataType::HTML,
            "#dir" => TemplateDataType::DirectoryData,
            "*" => TemplateDataType::Any,
            _ => Self::Other(s.to_string()),
        }
    }
}
