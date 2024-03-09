use dioxus::prelude::*;
use karaty_blueprint::RendererProps;
use markdown::{mdast::Node, ParseOptions};

use crate::components::icon::Icon;

pub fn Markdown(cx: Scope<RendererProps>) -> Element {
    let mdast = markdown::to_mdast(&cx.props.content, &ParseOptions::gfm());
    use_effect(&cx, (&cx.props.content,), |_| async {
        let _ = js_sys::eval(&indoc::formatdoc! {"
            var list = document.getElementsByClassName('code-raw');
            setTimeout(() => {{
                for (var i = 0; i < list.length; i++) {{
                    let generated = list[i].parentElement.getElementsByTagName('pre');
                    for (var j = 0; j < generated.length; j++) {{
                        generated[j].remove();
                    }}
                    var code = list[i].getElementsByTagName('code')[0].innerText;
                    var language = list[i].getElementsByTagName('span')[0].innerText;
                    var pre_el = document.createElement('pre');
                    pre_el.className = 'text-sm';
                    var code_el = document.createElement('code');
                    code_el.classList = 'language-' + language;
                    code_el.appendChild(document.createTextNode(
                        code
                    ));
                    pre_el.appendChild(code_el);
                    list[i].parentElement.appendChild(pre_el);
                    hljs.highlightElement(code_el);
                }}
            }}, 1);
        "});
    });
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

#[component]
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
                Text {
                    value: text.value.clone(),
                }
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
            if &link.url[0..1] == "@" {
                let url = &link.url[1..];
                return rsx! {
                    dioxus_retrouter::Link {
                        to: "{url}",
                        embedded
                    }
                };
            } else {
                return rsx! {
                    a {
                        href: "{url}",
                        title: "{title}",
                        embedded
                    }
                };
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
            rsx! {
                Code {
                    text: value.clone(),
                    language: language.clone().unwrap_or_default(),
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

#[derive(Debug, Clone)]
pub enum TextFlag {
    Text(String),
    Icon(String),
}

#[component]
pub fn Text(cx: Scope, value: String) -> Element {
    let re = js_sys::RegExp::new("\\:([a-zA-Z0-9.-]+)\\:", "gi");
    let mut contents: Vec<TextFlag> = vec![];
    let mut latest_split_index = 0;
    while let Some(v) = re.exec(value) {
        let last_index = re.last_index() as usize;
        let arr = v.to_vec();
        let full = arr.get(0).unwrap();
        let icon = arr.get(1).unwrap();
        let start_index = last_index - full.as_string().unwrap().len();
        contents.push(TextFlag::Text(
            value[latest_split_index..start_index].to_string(),
        ));
        contents.push(TextFlag::Icon(icon.as_string().unwrap()));
        latest_split_index = last_index;
    }
    contents.push(TextFlag::Text(value[latest_split_index..].to_string()));
    let display = contents.iter().map(|v| match v.clone() {
        TextFlag::Text(t) => {
            rsx! { "{t}" }
        }
        TextFlag::Icon(t) => rsx! { Icon {
            class: "inline-block".to_string(),
            name: t
        } },
    });
    cx.render(rsx! { display })
}

#[component]
pub fn Code(cx: Scope, text: String, language: String) -> Element {
    cx.render(rsx! {
        div {
            class: "not-prose",
            div {
                class: "hidden code-raw",
                code { "{text}" }
                span { "{language}" }
            }
        }
    })
}
