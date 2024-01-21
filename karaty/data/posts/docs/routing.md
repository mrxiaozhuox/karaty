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



## Template

> You can use [Dioxus](https://dioxuslabs.com) to write your own template or import templates from crates.io & git repo.

Edit file **karaty/Cargo.toml** to import a template:

```toml
# you can add your extension template in here
# you need add a template=true field for dependencies, that can help builder find this part.
karaty-template = { path = "../template/", template = true }
```





## Remote Routing Configure

TODO!