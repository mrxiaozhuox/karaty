use markdown::{CompileOptions, Options, ParseOptions};

#[allow(dead_code)]
pub fn parse_markdown(content: &str) -> Option<String> {
    markdown::to_html_with_options(
        content,
        &Options {
            parse: ParseOptions::gfm(),
            compile: CompileOptions {
                allow_dangerous_html: true,
                ..CompileOptions::gfm()
            },
        },
    )
    .ok()
}
