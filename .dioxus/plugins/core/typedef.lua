---@class BuildInfo
---@field name string
---@field platform platform
---@field out_dir string
---@field asset_dir string

---@class ServeStartInfo
---@field name string
---@field timestamp number

---@class ServeRebuildInfo
---@field timestamp number
---@field changed_files string[]

---@class ServeShutdownInfo
---@field timestamp number


---@class DioxusConfig
---@field application ApplicationConfig
---@field web WebConfig
---@field plugin table

---@class ApplicationConfig
---@field name string
---@field default_platform string
---@field out_dir string | nil
---@field assest_dir string | nil
---@field sub_package string | nil

---@class WebConfig
---@field app WebAppConfig
---@field proxy table
---@field watcher WebWatcherConfig
---@field resource WebResourceConfig

---@class WebAppConfig
---@field title string | nil
---@field base_path string | nil

---@class WebWatcherConfig
---@field watch_path string[]
---@field reload_html boolean | nil
---@field index_on_404 boolean | nil

---@class WebResourceConfig
---@field dev WebDevResourceConfig
---@field style string[]
---@field script string[]

---@class WebDevResourceConfig
---@field style string[]
---@field script string[]
