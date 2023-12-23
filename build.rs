use std::{path::{PathBuf, Path}, fs::{File, self}, io::Read, collections::HashMap};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
struct Config {
    #[serde(rename = "data-source")]
    pub data_source: DataSourceConfig,
    #[serde(flatten)]
    other: HashMap<String, toml::Value>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct DataSourceConfig {
    #[serde(default)]
    pub local: Option<DeployLocalDataSourceConfig>,
    #[serde(flatten)]
    other: HashMap<String, toml::Value>,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct DeployLocalDataSourceConfig {
    pub mode: String,
    pub data: toml::Value,
}

fn main() {
    let config_file = PathBuf::from("karaty.toml");
    let mut file = File::open(config_file).expect("`karaty.toml` file not found.");
    let mut config_text = String::new();
    file.read_to_string(&mut config_text).unwrap();
    let mut config = toml::from_str::<Config>(&config_text).unwrap();
    if config.data_source.local.is_some() {
        let local_source = config.data_source.local.clone().unwrap();
        if &local_source.mode == "embedded-public" {
            let data_map = local_source.data.as_table().unwrap();
            let source = data_map.get("source").unwrap().as_str().unwrap();
            let source_path = PathBuf::from(source);
            if source_path.is_dir() {
                let public_data = PathBuf::from("public").join("data");
                if public_data.exists() {
                    fs::remove_dir_all(&public_data).unwrap();
                }

                copy_dir(&source_path, &public_data);

                let mut data_map = toml::map::Map::new();
                data_map.insert("url".into(), "/data".into());
                data_map.insert("index-file".into(), "_index.json".into());
                config.data_source.local = Some(DeployLocalDataSourceConfig {
                    mode: "custom-url".to_string(),
                    data: toml::Value::Table(data_map),
                });
            }
            let new_config_text = toml::to_string_pretty::<Config>(&config).unwrap();
            fs::write(PathBuf::from("public").join("karaty.toml"), new_config_text).unwrap();
        }
    }
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
