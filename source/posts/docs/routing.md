---
title: Routing
date: 2023-04-25
released: true
---

> **Karaty** allow you custom website router.

## Routing types

### PageBind routing

You can use **page bind routing** to create a new page from a file.

```toml
[[routing]]
path = "/"
file = "home.md"
```

For example, when we using local server, the url  `http://127.0.0.1:8080/` will be linked to `pages/home.md` file.

> If you are using a **unsupported** file format, the page will be set to 404.

### PresetBind routing

In **Karaty** we provided some useful preset template, you can use **preset bind routing** to connect it.

```toml
[[routing]]
path = "/blog"
preset = "posts-list"
setting = { group = "blog" }
```

### Redirect routing

You can use **redirect routing** to set a redirect event.

```toml
[[routing]]
path = "/main"
redirect = "/"
```

When you visit `http://127.0.0.1:8080/main`, the page will be auto-jump to `http://127.0.0.1:8080/`.