# Karaty

> A powerful blog & docs framework, powered by [Dioxus][dioxus].

[![Static Badge](https://img.shields.io/badge/dioxus-0.4.3-green?logo=Rust)](https://github.com/DioxusLabs/dioxus/releases/tag/v0.4.3) [![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mrxiaozhuox/karaty/main.yml?logo=GitHub)](https://github.com/mrxiaozhuox/karaty/actions) [![GitHub commit activity](https://img.shields.io/github/commit-activity/y/mrxiaozhuox/karaty?logo=Git)](https://github.com/mrxiaozhuox/karaty/commits/main/) [![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/mrxiaozhuox/karaty/total?logo=superuser)](https://github.com/mrxiaozhuox/karaty/releases) [![GitHub repo size](https://img.shields.io/github/repo-size/mrxiaozhuox/karaty?logo=Git)](#)

## Features

- Powered by single `.wasm` file.
- Display markdown content without compile & build.
- Use single config file `karaty.toml` to setup website.
- Easy to deploy to **Github Pages** and **Static File Server**.
- Support custom template by [Dioxus][dioxus] UI framework.
- Support Dark Mode and compatible Mobile visitor

## Quick Start

### Build from Source

Install **dioxus-cli**

```shell
cargo install dioxus-cli --git https://github.com/mrxiaozhuox/dioxus-cli
```

Clone project from Github

```shell
git clone https://github.com/mrxiaozhuox/karaty --branch new
```

Start Development server

```shell
dx serve
```

### Startup with compiled file

You can download [karaty.zip](https://github.com/mrxiaozhuox/karaty/releases) file in Release list.

#### Deploy by web server

- Download **Karaty** compiled package.
- Deploy a web server which support dynamic route.
- Config your website in `karaty.toml` file.

#### Deploy by GitHub pages

- Create a new repository.
- Copy `index.html` to `404.html` in root path.
- Push compiled package.
- Open GitHub pags in repository and bind domain.

## Contribute

You should make change at `karaty` directory.

[dioxus]: https://dioxuslabs.com/ "DioxusLabs"
