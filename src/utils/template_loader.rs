use std::collections::HashMap;
pub fn loader() -> HashMap<String, karaty_blueprint::Templates> {
    let mut templates: HashMap<String, karaty_blueprint::Templates> = HashMap::new();
    templates.insert("karaty_template".to_string(), karaty_template::export());
    templates.insert(
        "karaty_docsite_template".to_string(),
        karaty_docsite_template::export(),
    );
    templates
}
