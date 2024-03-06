# -----------------------
# release.py use for generate a empty karaty project
# execute this script before push new change to repository
# -----------------------

import shutil
from pathlib import Path

import tomllib

DIR = "forked"

def main():
    dir_path = Path(".") / DIR
    if dir_path.exists():
        shutil.rmtree(dir_path)
    shutil.copytree("./docsite", dir_path)
    
    # re-genenate Cargo.toml file
    cargo_toml = dir_path / "Cargo.toml"
    if cargo_toml.exists():
        current_content = cargo_toml.read_text()
        new_content = clean_template_deps(current_content)
        cargo_toml.write_text(new_content)

    # clean all data
    data_dir = dir_path / "data"
    shutil.rmtree(data_dir)
    # re-create data dir
    data_dir.mkdir()
    # write default page
    home_md = data_dir / "home.md"
    home_md.write_text(home_md_content())
    
    # rewrite config
    config_dir = dir_path / "config"
    template_toml = config_dir / "template.toml"
    template_toml.write_text(template_toml_content())
    routing_toml = config_dir / "routing.toml"
    routing_toml.write_text(routing_toml_content())

    # rewrite karaty.toml
    karaty_toml = dir_path / "karaty.toml"
    karaty_toml.write_text(karaty_toml_content())

def clean_template_deps(config: str) -> str:
    new = ""
    for line in config.splitlines():
        data = tomllib.loads(line)
        ls = list(data.items())
        if len(ls) > 0:
            k = ls[0][0]
            v = ls[0][1]
            if isinstance(v, dict):
                if 'template' in v and v.get('template') == True:
                    if k != "karaty-template":
                        continue
            # print(k)
            if k == "name":
                line = line.replace("karaty", "karaty-website")
        new += line + "\n"
    return new

def home_md_content() -> str:
    return '''<div align="center">
<img src="/assets/karaty.png" width="150">
</div>

***"A static website & blog generator made by Dioxus"***


Use single config file `karaty.toml` to configure your website

Use different file-type for different render template

Dynamic routing segments & queries support

Deploy website without CLI, render pages from markdown

Independent data-source, split content and code in different git repository

Single page application, powered by single `.wasm` file

Support custom **Dioxus** component & template development'''

def template_toml_content() -> str:
    return '''[default.file-type]
md = "center"
json = "card::projects"'''

def routing_toml_content() -> str:
    return '''[[routing]]
path = "/"
file = "pages/home.md"'''

def karaty_toml_content() -> str:
    return '''[site]

name = "Karaty Offical"
title-suffix = " | Karaty Site"
dark-mode = true

[repository]
service = "GitHub"
name = "<github_user>/<github_repo>"

[data-source]
# get more information from document: https://karaty.mrxzx.info/docs/data-source
mode = "<data-source-mode>"
data = "<data-source-config>"

[data-source.local]
# get more information from document: https://karaty.mrxzx.info/docs/data-source
mode = "custom-url"
data = { url = "/data", index-file = "_index.json" }

[navigation]

content = [
    { text = "Home", page = "/" },
    { text = "Docs", link = "https://karaty.mrxzx.info/docs/" },
    { feature = "mode-switch" },
]

[footer]

# enable = false

content = [
    [
        { icon = "brand.github", link = "https://github.com/mrxiaozhuox/karaty" },
        { icon = "solid.table", link = "https://karaty.mrxzx.info/blog/roadmap" },
    ],
    [{ text = "Powered by Karaty" }],
]

[build.static-generator]
source = "data"
target = "data"
'''

if __name__ == "__main__":
    main()
