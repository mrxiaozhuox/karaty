---
title: Data Source
date: 2023-05-01
released: true
---

> **Karaty** allow you custom your pages & posts data source.

Data source is a new concept in `Karaty`, it can allow you define where to load data, and you can use different data-source for different access domain name.

```toml
[data-source]
mode = "$DATA-SOURCE-MODE"
data = INFORMATION
```

Currently we have 3 data-source mode:

### Independent Repository

you can use `independent-repository` to link a single github repository which just include posts & pages content.

You can use this mode to isolation website code and your creative content.

```toml
[data-source]
mode = "independent-repository"
data = { service = "github", name = "mrxiaozhuox/my-blog", branch = "main" }
```

`data` field is a **table**, and it include:

- service: git service
- name: your repository name (`{username}/{repo-name}`)
- branch: which one branch you want to use (default: `main`)

### Embedded Repository

you can use `embedded-repository` to link a sub-path in current repository.

```toml
[data-source]
mode = "embedded-repository"
data = "data"
```

`data` field is a **string**, that is your `sub-path`.

### Custom URL

if you have your personal static file server, you can use custom url to link it.

```toml
[data-source]
mode = "custom-url"
data = { url = "http://127.0.0.1:9000/", index-file = "_index.json" }
```

`data` field is a **table**, and it include:

- url: root url
- index-file: you need generate a `index_file` in every directory.

#### Index File

Because for `independent-repository` & `embedded-repository` we will use git service API to get index list. 
if for raw static server, you need have a index-file help client find contents.

```json
[
  {
    "type": "dir",
    "name": "pages",
  },
  {
    "type": "dir",
    "name": "posts",
  },
  {
    "type": "file",
    "name": "hello.md"
  }
]
```

### Local Data Source

If you are using local server, you can define a local data-source:

```toml
[data-source.local]
mode = "custom-url"
data = { url = "/data", index-file = "_index.json" }
```

when you are access from `127.0.0.1` & `localhost`, client will use local data-source.