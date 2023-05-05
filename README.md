<div align="center">
  <h1>🔰 Karaty 🧸</h1>
</div>
<div align="center">
  <a href="https://karaty.mrxzx.info">Online Demo</a>
</div>

<div align="center">
  <h3>
    <span> English </span>
    <span> | </span>
    <a href="https://github.com/mrxiaozhuox/karaty/blob/master/README.zh-CN.md"> 简体中文 </a>
  </h3>
</div>
## Features

- Powered by single `.wasm` file.
- Display **markdown** content without compile & build.
- Use single config file `karaty.toml` to setup website.
- Easy to deploy to **Github Pages** and **Static File Server**.
- Support many differents *file-suffix* and *templates*.
- Support **Dark Mode** and compatible **Mobile** visitor



## Quick Start

### Build from Source

Install **dioxus-cli**

```shell
cargo install dioxus-cli --git https://github.com/mrxiaozhuox/dioxus-cli
```

Clone project from Github

```shell
git clone https://github.com/mrxiaozhuox/karaty
```

Start Development server

```shell
dioxus serve
```

### Startup with compiled file

> You can use compiled package deploy your website.

You can download [karaty.zip](https://github.com/mrxiaozhuox/karaty/releases) file in Release list.

#### Deploy

- Download **Karaty** compiled package.
- Deploy a web server which support dynamic route.
- Config your website in `karaty.toml` file.