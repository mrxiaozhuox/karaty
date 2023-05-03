use dioxus::prelude::*;
use markdown::{
    mdast::{AlignKind, Node},
    ParseOptions,
};

#[inline_props]
pub fn Markdown(cx: Scope, content: String) -> Element {
    let mdast = markdown::to_mdast(&content, &ParseOptions::gfm());
    if let Ok(Node::Root(root)) = mdast {
        let children = root.children;
        return cx.render(rsx! {
            MdastNode {
                nodes: children,
            }
        });
    }
    None
}

#[inline_props]
pub fn MdastNode(cx: Scope, nodes: Vec<Node>) -> Element {
    let display = nodes.iter().map(|node| {
        let children = node.children();
        let children = if children.is_none() {
            vec![]
        } else {
            children.unwrap().clone()
        };
        let embedded = rsx! {
            MdastNode {
                nodes: children,
            }
        };
        if let Node::Text(text) = node {
            rsx! {
                "{text.value}"
            }
        } else if let Node::Paragraph(_) = node {
            rsx! {
                p {
                    embedded
                }
            }
        } else if let Node::Strong(_) = node {
            rsx! {
                strong {
                    embedded
                }
            }
        } else if let Node::Break(_) = node {
            rsx! {
                br {}
            }
        } else if let Node::Delete(_) = node {
            rsx! {
                del {
                    embedded
                }
            }
        } else if let Node::Emphasis(_) = node {
            rsx! {
                em {
                    embedded
                }
            }
        } else if let Node::InlineCode(ic) = node {
            rsx! {
                code {
                    "{ic.value}"
                }
            }
        } else if let Node::Link(link) = node {
            let url = link.url.clone();
            let title = link.title.clone().unwrap_or_default();
            rsx! {
                a {
                    href: "{url}",
                    title: "{title}",
                    embedded
                }
            }
        } else if let Node::Heading(h) = node {
            let depth = h.depth;
            match depth {
                1 => rsx! { h1 { embedded } },
                2 => rsx! { h2 { embedded } },
                3 => rsx! { h3 { embedded } },
                4 => rsx! { h4 { embedded } },
                5 => rsx! { h5 { embedded } },
                _ => rsx! { h6 { embedded } },
            }
        } else if let Node::Code(code) = node {
            let language = &code.lang;
            let value = &code.value;
            let class = if let Some(language) = language {
                format!("language-{}", language)
            } else {
                "".to_string()
            };
            rsx! {
                div {
                    class: "not-prose",
                    pre {
                        code {
                            class: "{class}",
                            "{value}"
                        }
                    }
                }
            }
        } else if let Node::BlockQuote(_) = node {
            rsx! {
                blockquote {
                    embedded
                }
            }
        } else if let Node::Image(img) = node {
            let url = &img.url;
            let alt = &img.alt;
            let title = img.title.clone().unwrap_or_default();
            rsx! {
                img {
                    src: "{url}",
                    alt: "{alt}",
                    title: "{title}",
                }
            }
        } else if let Node::List(list) = node {
            let ordered = list.ordered.clone();
            if ordered {
                rsx! {
                    ol {
                        embedded
                    }
                }
            } else {
                rsx! {
                    ul {
                        embedded
                    }
                }
            }
        } else if let Node::ListItem(item) = node {
            let checked = item.checked;
            if let Some(checked) = checked {
                rsx! {
                    li {
                        input {
                            r#type: "checkbox",
                            checked: checked,
                            disabled: true,
                        }
                        label {
                            embedded
                        }
                    }
                }
            } else {
                rsx! {
                    li {
                        embedded
                    }
                }
            }
        } else if let Node::Table(_) = node {
            rsx! {
                table {
                    embedded
                }
            }
        } else if let Node::TableRow(_) = node {
            rsx! {
                tr {
                    embedded
                }
            }
        } else if let Node::TableCell(_) = node {
            rsx! {
                td {
                    embedded
                }
            }
        } else if let Node::Html(raw) = node {
            rsx! {
                div {
                    class: "not-prose",
                    dangerous_inner_html: "{raw.value}"
                }
            }
        } else if let Node::Definition(_def) = node {
            // waiting for design
            rsx! { embedded }
        } else {
            rsx! {
                embedded
            }
        }
    });
    cx.render(rsx! {
        display
    })
}
