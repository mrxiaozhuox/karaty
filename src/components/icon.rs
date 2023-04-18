use dioxus::prelude::*;
use dioxus_free_icons::{
    icons::{fa_brands_icons, fa_solid_icons},
    Icon as FIcon,
};

#[inline_props]
pub fn Icon(cx: Scope, name: String) -> Element {
    let temp = name.split(":").collect::<Vec<&str>>();
    let mut suffix = "solid".to_string();
    let name;
    if temp.len() > 1 {
        suffix = temp.get(0).unwrap().to_string();
        name = temp.get(1).unwrap().to_string();
    } else {
        name = temp.get(0).unwrap().to_string();
    }

    let icon = match suffix.to_lowercase().as_str() {
        "brand" => match name.as_str() {
            "github" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaGithub,
                    }
                }
            }
            "gitlab" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaGitlab,
                    }
                }
            }
            "apple" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaApple,
                    }
                }
            }
            "android" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaAndroid,
                    }
                }
            }
            "google" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaGoogle,
                    }
                }
            }
            "paypal" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaPaypal,
                    }
                }
            }
            "twitter" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaTwitter,
                    }
                }
            }
            "instagram" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaInstagram,
                    }
                }
            }
            "facebook" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaFacebook,
                    }
                }
            }
            "linkedin" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaLinkedin,
                    }
                }
            }
            "twitch" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaTwitch,
                    }
                }
            }
            "vimeo" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaVimeo,
                    }
                }
            }
            "apple-pay" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaApplePay,
                    }
                }
            }
            "google-pay" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaGooglePay,
                    }
                }
            }
            "zhihu" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaZhihu,
                    }
                }
            }
            "rust" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaRust,
                    }
                }
            }
            "python" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaPython,
                    }
                }
            }
            "java" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaJava,
                    }
                }
            }
            "golang" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaGolang,
                    }
                }
            }
            "php" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaPhp,
                    }
                }
            }
            "node-js" => {
                rsx! {
                    FIcon {
                        icon: fa_brands_icons::FaNodeJs,
                    }
                }
            }
            _ => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaX,
                    }
                }
            }
        },
        _ => match name.as_str() {
            "house" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaHouse,
                    }
                }
            }
            "user" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaUser,
                    }
                }
            }
            "music" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaMusic,
                    }
                }
            }
            "heart" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaHeart,
                    }
                }
            }
            "cloud" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaCloud,
                    }
                }
            }
            "bell" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaBell,
                    }
                }
            }
            "globe" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaGlobe,
                    }
                }
            }
            "bug" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaBug,
                    }
                }
            }
            "sun" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaSun,
                    }
                }
            }
            "moon" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaMoon,
                    }
                }
            }
            "shop" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaShop,
                    }
                }
            }
            "car" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaCar,
                    }
                }
            }
            "wallet" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaWallet,
                    }
                }
            }
            "book" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaBook,
                    }
                }
            }
            "language" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaLanguage,
                    }
                }
            }
            "tag" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaTag,
                    }
                }
            }
            "tags" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaTags,
                    }
                }
            }
            "play" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaPlay,
                    }
                }
            }
            "pause" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaPause,
                    }
                }
            }
            "gear" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaGear,
                    }
                }
            }
            "gears" => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaGears,
                    }
                }
            }
            _ => {
                rsx! {
                    FIcon {
                        icon: fa_solid_icons::FaX,
                    }
                }
            }
        },
    };

    cx.render(icon)
}
