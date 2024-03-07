---
title: Summary
date: 2023-04-25
released: true
---

> Karaty - a SPA website generator.

## What is Karaty?

**Karaty** is a static blog & docs generator system, you can use different file format and different template to setup your website.



### Supported File format

- Markdown
- HTML
- JSON



## Installation

> **Karaty** is powered by wasm file, so you need have a avaiable wasm package.

### Build from source

#### Preconditions

- [Rust](https://rust-lang.org) - V1.69.0
  - WASM32 build target
  - Cargo package management
- [Git](http://git-scm.com/)
- [Dioxus - CLI](https://dioxuslabs.com/)

#### Install Dioxus CLI

```shell
cargo install --git https://github.com/DioxusLabs/dioxus dioxus-cli
```



#### Clone Karaty code

```shell
git clone https://github.com/mrxiaozhuox/karaty

cd karaty
```



#### Startup local development server

```shell
dx serve --hot-reload
```

