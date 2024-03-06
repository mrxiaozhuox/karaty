---
title: About Karaty
tags: [note]
date: 2022-09-09
released: true
---

Hello guys, I'm a Rust full-stack developer, I'm trying to use Dioxus create a website (blog & docs) generator, this project's idea is from my peronsal website which is made by Dioxus. 

## Development Tools

- [Tailwind CSS](https://tailwindcss.com/) - use for style design.
- [Dioxus](https://dioxuslabs.com)
  - Dioxus Web - use for WASM development
  - Dioxus Router - embedded router in web
  - Dioxus CLI - build & local-server
  - Fermi - Global state management
  - [Dioxus Free Icons](https://crates.io/crates/dioxus-free-icons) - generate icons for website
- Rust WASM
  - Web sys - use for manage web page & document
  - JS sys - use for execute `javascript` code
- [Serde](https://serde.rs/)
  - JSON - parse `json` config content
  - TOML - parse `toml` config content



## Features

- Powered by single `.wasm` file.
- Display **markdown** content without compile & build.
- Use single config file `karaty.toml` to setup website.
- Easy to deploy to **Github Pages** and **Static File Server**.
- Support many differents *file-suffix* and *templates*.
