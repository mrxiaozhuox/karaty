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
file = "pags/home.md"
template = "$CHOOSE_YOUR_TEMPLATE"
```

For example, when we using local server, the url  `http://127.0.0.1:8080/` will be linked to `pages/home.md` file.

> If you are using a **unsupported** file format, the page will be set to 404.

### Redirect routing

You can use **redirect routing** to set a redirect event.

```toml
[[routing]]
path = "/main"
redirect = "/"
```

When you visit `http://127.0.0.1:8080/main`, the page will be auto-jump to `http://127.0.0.1:8080/`.



## Remote Routing Configure

You can crate a `routing.toml` config at `/config` directory.

```toml
[[routing]]
path = "/"
file = "pages/main.md"
```

