use std::{path::{PathBuf, Path}, fs::{File, self}, io::Read, collections::HashMap};
use serde::{Deserialize, Serialize};

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

fn main() {
    let config_file = PathBuf::from("karaty.toml");
    let mut file = File::open(&config_file).expect("`karaty.toml` file not found.");
    let mut config_text = String::new();
    file.read_to_string(&mut config_text).unwrap();
    let config = toml::from_str::<Config>(&config_text).unwrap();
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
        let file_name = PathBuf::from(&value).file_name().unwrap().to_str().unwrap().to_string();
        let child_from = from.join(&file_name);
        let child_to = to.join(&file_name);
        if PathBuf::from(&value).is_dir() {
            copy_dir(&child_from, &child_to);
            index.push(IndexStruct {
                r#type: "dir".to_string(),
                name: file_name.clone(),
            });
        } else {
            fs::copy(child_from, child_to).unwrap();
            index.push(IndexStruct {
                r#type: "file".to_string(),
                name: file_name.clone(),
            })
        }
    }
    fs::write(to.join("_index.json"), serde_json::to_string(&index).unwrap()).unwrap();
}
