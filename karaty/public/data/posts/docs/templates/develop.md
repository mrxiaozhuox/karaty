---
title: Template Development
date: 2024-03-08
released: true
---

> use [karaty-blueprint](https://docs.rs/karaty-blueprint/0.2.0/karaty_blueprint/) & [dioxus](https://dioxuslabs.com) build your personal template



## startup environment

```shell
cargo init my-template --lib
cd my-template

cargo add dioxus@0.4.3
cargo add dioxus-retrouter@0.4.0
cargo add karaty-blueprint@0.2.0
```



## Entrence `lib.rs` 

```rust
use karaty_blueprint::Templates;

// define & import your components here

pub fn export() -> Templates {
    let mut list = Templates::new();
		// list.template(name, vec![/**data type**/], component);
    list
}
```



## Template props

> we using `karaty_blueprint::TemplateProps` to transfer data.

```rust
use dioxus::prelude::*;
use karaty_blueprint::TemplateProps;

pub fn MyComponent(cx: Scope<TemplateProps>) -> Element {
	// you can access data from cx.props
  cx.render(rsx! { span { "hello world!" } });
}
```

### route

> cx.props.route - **struct \<TemplateRouteData\>**

- `bound_path: String` - user bound this component on which uri path. (will include wildcard)
- `access_path: String` - this request uri path. (changed wildcard)
- `segments: HashMap<String, String>` - replaced wildcard segments.
- `queries: HashMap<String, String>` - query data (`?{key}={value}`)



### data

> cx.props.data - **enum \<TemplateData\>**



#### File(String)

Loaded data, come from user binded file.



#### Directory(HashMap\<String,TemplateData\>)

If user bind a direcotry, you will got a `HashMap<String, TemplateData>`,  Key for file or dir's name. Value is a new TemplateData.



### utility

> cx.props.utility - **struct \<SharedUtility\>**

utility will provide some preset components

- `footer` - display footer.
- `navbar` - display navbar.
- `giscus` - display [giscus](https://giscus.app) comment bar.
- `_404` - display not found page.
- `error` - display error page
- `renderers` - `HashMap<String, fn(Scope<RendererProps>)>`
  - `markdown` - use for render markdown content
- `app_config` - get `karaty.toml` config



#### config

> cx.props.config - **struct \<karaty_blueprint::Value\>**

this will recive config from routing build.



## Component Example

> this is a simple example copied from `karaty-template`

```rust
pub fn Center(cx: Scope<TemplateProps>) -> Element {
    let config = &cx.props.config;

    let Navbar = cx.props.utility.navbar;
    let Footer = cx.props.utility.footer;
    let Markdown = cx.props.utility.renderers.get("markdown").unwrap().clone();

    let content = cx.props.data.text();

    let class = if let Some(toml::Value::Table(t)) = config.get("style") {
        generate_prose_class(t.clone())
    } else {
        "prose prose-sm sm:prose-base dark:prose-invert".to_string()
    };

    let hide_navbar = if let Some(toml::Value::Boolean(b)) = config.get("hide-navbar") {
        *b
    } else {
        false
    };

    let hide_footer = if let Some(toml::Value::Boolean(b)) = config.get("hide-footer") {
        *b
    } else {
        false
    };

    cx.render(rsx! {
        section { class: "bg-cover bg-white dark:bg-gray-900",
            if !hide_navbar {
                rsx! { Navbar {} }
            }
            div { class: "flex w-full items-center justify-center container mx-auto px-8",
                div { class: "text-center",
                    div { class: "{class}", Markdown { content: content, config: Default::default() } }
                    if !hide_footer {
                        rsx! { Footer {} }
                    }
                }
            }
        }
    })
}
```

