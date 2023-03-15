pub fn default_suffix(template: &String) -> String {
    match template.to_lowercase().as_str() {
        "normal" => { String::from("md") }
        _ => { String::from("md") }
    }
}