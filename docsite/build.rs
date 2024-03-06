use quote::{format_ident, quote};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    fs::{self, File},
    io::Read,
    path::{Path, PathBuf},
    process::Command,
};

#[derive(Deserialize, Serialize, Debug, Clone)]
struct Config {
    #[serde(default)]
    pub build: Option<BuildConfig>,
    #[serde(flatten)]
    pub other: HashMap<String, toml::Value>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct BuildConfig {
    #[serde(default)]
    #[serde(rename = "static-generator")]
    pub static_gen: Option<StaticGenInfo>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct StaticGenInfo {
    pub source: String,
    pub target: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct CargoConfig {
    pub dependencies: HashMap<String, toml::Value>,
}

fn main() {
    let config_file = PathBuf::from("karaty.toml");
    let mut file = File::open(&config_file).expect("`karaty.toml` file not found.");
    let mut config_text = String::new();
    file.read_to_string(&mut config_text).unwrap();
    let config = toml::from_str::<Config>(&config_text).unwrap();

    generate_template_rs();

    if let Some(build) = config.build {
        // for static generator
        if let Some(sg) = build.static_gen {
            let from = PathBuf::from(sg.source);
            let to = PathBuf::from("public").join(sg.target);
            if to.exists() {
                fs::remove_dir_all(&to).unwrap();
            }
            copy_dir(&from, &to);
        }
    }
    fs::copy(&config_file, PathBuf::from("public").join("karaty.toml")).unwrap();
    let _ = copy_dir(
        &PathBuf::from("config"),
        &PathBuf::from("public").join("config"),
    );
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct IndexStruct {
    r#type: String,
    name: String,
}

fn copy_dir(from: &Path, to: &Path) {
    if !from.is_dir() {
        return;
    }
    let list = fs::read_dir(from).unwrap();
    if !to.is_dir() {
        fs::create_dir(to).unwrap();
    }

    let mut index: Vec<IndexStruct> = Vec::new();
    for i in list {
        let value = i.unwrap().path().display().to_string();
        let file_name = PathBuf::from(&value)
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string();
        let child_from = from.join(&file_name);
        let child_to = to.join(&file_name);
        if PathBuf::from(&value).is_dir() {
            copy_dir(&child_from, &child_to);
            index.push(IndexStruct {
                r#type: "dir".to_string(),
                name: file_name.clone(),
            });
        } else {
            if &file_name == ".DS_Store" {
                continue;
            }
            fs::copy(child_from, child_to).unwrap();
            index.push(IndexStruct {
                r#type: "file".to_string(),
                name: file_name.clone(),
            })
        }
    }
    fs::write(
        to.join("_index.json"),
        serde_json::to_string(&index).unwrap(),
    )
    .unwrap();
}

#[allow(dead_code)]
fn load_extension_template() -> Vec<String> {
    let config_file = PathBuf::from("Cargo.toml");

    let mut file = File::open(&config_file).expect("`Cargo.toml` file not found.");
    let mut config_text = String::new();
    file.read_to_string(&mut config_text).unwrap();
    let config = toml::from_str::<CargoConfig>(&config_text).unwrap();

    let dep = config.dependencies;
    let mut templates = vec![];
    for (name, value) in dep {
        if let toml::Value::Table(tab) = value {
            if tab.contains_key("template") {
                let enable = tab.get("template").unwrap().as_bool().unwrap();
                if enable {
                    templates.push(name);
                }
            }
        }
    }
    templates
}

#[allow(dead_code)]
fn generate_template_rs() {
    let templates = load_extension_template();

    let quoted_items: Vec<_> = templates
        .iter()
        .map(|template| {
            let template = template.replace("-", "_");
            let template_module = format_ident!("{}", template);
            quote! {
                templates.insert(#template.to_string(), #template_module::export());
            }
        })
        .collect();

    let template_rs = quote! {
        use std::collections::HashMap;
        pub fn loader() -> HashMap<String, karaty_blueprint::Templates> {
            let mut templates: HashMap<String, karaty_blueprint::Templates> = HashMap::new();
            #(#quoted_items)*
            templates
        }
    };
    let template_rs_file = PathBuf::from("src")
        .join("utils")
        .join("template_loader.rs");
    fs::write(&template_rs_file, template_rs.to_string()).unwrap();

    Command::new("rustfmt")
        .arg(template_rs_file.to_str().unwrap().to_string())
        .status()
        .expect("Failed to format the file.");
}
