---
title: Navigation & Footer
date: 2023-05-02
---

> This chapter we will talk about how to config website navigation and footer.

`Karaty` have a top navbar and a footer, you can add some **icon**, **link**, **plain text** on it.

```toml
[navigation]
content = [
  { text = "GitHub", link = "https://github.com/mrxiaozhuox" },
  { text = "Docs", page = "/docs" },
  { icon = "brand.twitter", link = "https://twitter.com/" },
  { text = "copyright @karaty 2023" },
  { feature = "mode-switch" },
]
```

## Content Type

Currently we have **6** content type you can use in footer and navbar.

### Text to Link

You need provide a display text and a target link:

```toml
{ text = "Personal Website", link = "https://mrxzx.info" }
```

### Text to Page

If you want create a app-internal jump, you need use this one:

```toml
{ text = "Docs", page = "/docs" }
```

app-internal jump will not reload the page, **Dioxus** will re-render the page content to another router bind.

### Icon to Link

If you want use icon, just replace `text` field to `icon`

```toml
{ icon = "book", link = "https://github.com/dioxuslabs/" }
```

### Icon to Page

Same with `Text to Page` part.

```toml
{ icon = "book", page = "/docs" }
```

### Plain Text

display a plain text.

```toml
{ text = "Powered by Dioxus" }
```

### Collection

you can use a collection to create a **dropdown** list:

```toml
{ text = "Commnunity", list = [
  { text = "GitHub", link = "https://github.com/" },
  { text = "GitLab", link = "https://gitlab.com/" },
] }
```