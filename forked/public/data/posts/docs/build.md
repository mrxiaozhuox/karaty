---
title: Build Configure
date: 2023-12-24
released: true
---

> when you are using **source code** to maintain your website, you may need this part.

### Static Generator

This config can help you auto-migrate your content directory to public directory:

```toml
[build.static-generator]
source = "content"
target = "data"
```

`build.rs` file will auto copy all content in the `./content` to `./public/data` directory, and generate `_index.json` for each dirs.

You can use it with `custom-url` data source:

```toml
[data-source.local]
mode = "custom-url"
data = { url = "/data", index-file = "_index.json" }

[build.static-generator]
source = "content"
target = "data"
```
