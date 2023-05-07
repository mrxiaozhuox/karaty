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



## Template

> You can custom `Template` in PresetBind & PageBind routing

### PageBind

| **Type** | **Name** | **Introduction**                          | **Default** |
| -------- |  ------  | ----------------------------------------- | ----------- |
| Markdown |  center  | display markdown content by center layout | True        |
| Json     |  cards   | display a card list from json file        | True        |

#### Markdown - center

```toml
[[routing]]
path = "/"
file = "home.md"
[routing.template]
using = "center"
```

`center` template allow you custom template.style:

```toml
[routing.template.style]
headings = "underline"
a = "text-sky-500 dark:text-sky-200"
```

Style using Tailwind CSS framework, [here](https://tailwindcss.com/docs/typography-plugin#element-modifiers) is the supported elements list.



#### JSON - cards

```toml
[[routing]]
path = "/cards"
file = "cards.json"
[routing.template]
using = "cards"
```

JSON format:

```json
{
  "Web Development": [
    {
      "title": "Dioxus Framework",
      "url": "https://dioxuslabs.com",
      "content": "Web & CLI & Router & Fermi",
      "footnote": "DioxusLabs"
    }
  ],
  "UI Design": [
    {
      "title": "Tailwind CSS",
      "url": "https://tailwindcss.com/",
      "content": "CSS Framework",
      "footnote": "Tailwind"
    }
  ],
  "Data Convert": [
    {
      "title": "Markdown Meta Parser",
      "url": "https://github.com/mrxiaozhuox/markdown-meta-parser",
      "content": "Parse Markdown meta table to Json",
      "footnote": "YuKun Liu"
    }
  ]
}
```

## Remote Routing Configure

```toml
# karaty.toml
routing = { remote = "{routing-toml-file-url}" }
```

```toml
# remote routing file
routing = []
```