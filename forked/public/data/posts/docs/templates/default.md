---
title: Karaty Template
date: 2024-01-21
released: true

---

> This part record the Instructions of karaty-template (default template)

| Name          | Type      | Configure        | Introduction                                |
| ------------- | --------- | ---------------- | ------------------------------------------- |
| center        | Markdown  | None             | Use for centerd markdown content display    |
| blog::list    | Directory | None             | Use for display blog content list           |
| blog::content | Markdown  | None             | Use for blog content                        |
| docs          | Directory | {"file-segment"} | Use for documents content & sidebar display |

### blog::list

You need provide a directory for `blog::list` template, it will display all released blog in the list:

```toml
[[routing]]
path = "/blog"
file = "posts/blog"
template = "blog::list"
```



### blog::content

You can bind a single file or use a segment for blog::content part, this will display blog content:

```toml
[[routing]]
path = "/blog/:path"
file = "posts/blog/{path}.md"
template = "blog::content"
```



### docs

`docs` template is a little special, you need bind a directory for it, but you also need provide a dynamic segment because it should render `_index.md` & file content both.

```toml
[[routing]]
path = "/docs/:path"
file = "posts/docs"
template = "docs"
config = { file-segment = "path" }
```

