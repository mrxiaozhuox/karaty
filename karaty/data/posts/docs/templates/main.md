---
title: Templates
date: 2024-03-08
released: true
---



> You can use [Dioxus](https://dioxuslabs.com) to write your own template and publish it.

Edit file **karaty/Cargo.toml** to import a template:

```toml
# you can add your extension template in here
# you need add a template=true field for dependencies
karaty-template = { path = "../template/", template = true }
```



### Namespace

When you want use a template, you need use namespace, that can help karaty find it. 

you need replace `-` to `_` 

for example: change  `karaty-template` to `karaty_template`

```toml
[[routing]]
path = "/"
file = "pages/home.md"
# if you want use a template package named "hello-karaty"
# and it include a template named "md"
template = "hello_karaty::md"
```



### Default template

`karaty-template` is default template, so you don't need use namespace for it:

```toml
# use karaty_template::center template
template = "center"
# use karaty_template::blog::list template
template = "blog::list"
```

**More info - [[default](@templates.default)]**
