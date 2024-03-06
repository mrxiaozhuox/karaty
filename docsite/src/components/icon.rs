use dioxus::prelude::*;
use dioxus_free_icons::{
    icons::{fa_brands_icons, fa_solid_icons},
    Icon as FIcon,
};

#[derive(Props, PartialEq)]
pub struct IconProps {
    name: String,
    #[props(default)]
    class: String,
}

pub fn Icon(cx: Scope<IconProps>) -> Element {
    let temp = cx.props.name.split(".").collect::<Vec<&str>>();
    let mut suffix = "solid".to_string();
    let name;
    if temp.len() > 1 {
        suffix = temp.get(0).unwrap().to_string();
        name = temp.get(1).unwrap().to_string();
    } else {
        name = temp.get(0).unwrap().to_string();
    }

    let class = &cx.props.class;

    let icon = match suffix.to_lowercase().as_str() {
        "brand" => match name.as_str() {
            "github" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaGithub } }
            }
            "gitlab" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaGitlab } }
            }
            "apple" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaApple } }
            }
            "android" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaAndroid } }
            }
            "google" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaGoogle } }
            }
            "paypal" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaPaypal } }
            }
            "twitter" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaTwitter } }
            }
            "instagram" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaInstagram } }
            }
            "facebook" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaFacebook } }
            }
            "linkedin" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaLinkedin } }
            }
            "twitch" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaTwitch } }
            }
            "discord" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaDiscord } }
            }
            "telegram" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaTelegram } }
            }
            "tiktok" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaTiktok } }
            }
            "steam" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaSteam } }
            }
            "vimeo" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaVimeo } }
            }
            "apple-pay" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaApplePay } }
            }
            "google-pay" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaGooglePay } }
            }
            "amazon" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaAmazon } }
            }
            "zhihu" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaZhihu } }
            }
            "bilibili" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaBilibili } }
            }
            _ => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaX } }
            }
        },
        "programming" => match name.as_str() {
            "rust" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaRust } }
            }
            "python" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaPython } }
            }
            "java" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaJava } }
            }
            "golang" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaGolang } }
            }
            "php" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaPhp } }
            }
            "swift" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaSwift } }
            }
            "node-js" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaNodeJs } }
            }
            "css" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaCss3 } }
            }
            "bootstrap" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaBootstrap } }
            }
            "docker" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaDocker } }
            }
            "react" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaReact } }
            }
            "vue" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaVuejs } }
            }
            "angular" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaAngular } }
            }
            "html" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaHtml5 } }
            }
            "javascript" => {
                rsx! { FIcon { class: "{class}", icon: fa_brands_icons::FaJs } }
            }
            _ => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaX } }
            }
        },
        "solid" | _ => match name.as_str() {
            "house" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaHouse } }
            }
            "user" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaUser } }
            }
            "music" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaMusic } }
            }
            "heart" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaHeart } }
            }
            "cloud" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaCloud } }
            }
            "bell" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaBell } }
            }
            "globe" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaGlobe } }
            }
            "bug" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaBug } }
            }
            "sun" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaSun } }
            }
            "moon" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaMoon } }
            }
            "shop" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaShop } }
            }
            "car" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaCar } }
            }
            "wallet" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaWallet } }
            }
            "book" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaBook } }
            }
            "language" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaLanguage } }
            }
            "tag" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaTag } }
            }
            "tags" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaTags } }
            }
            "play" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaPlay } }
            }
            "pause" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaPause } }
            }
            "gear" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaGear } }
            }
            "gears" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaGears } }
            }
            "code" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaCode } }
            }
            "comment" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaComment } }
            }
            "comments" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaComments } }
            }
            "spin" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaArrowsSpin } }
            }
            "info" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaInfo } }
            }
            "upload" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaUpload } }
            }
            "square" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaSquare } }
            }
            "table" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaTable } }
            }
            "flag" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaFlag } }
            }
            "shield" => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaShield } }
            }
            _ => {
                rsx! { FIcon { class: "{class}", icon: fa_solid_icons::FaX } }
            }
        },
    };

    cx.render(icon)
}
