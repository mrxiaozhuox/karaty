local plugin = require("plugin")
local manager = require("manager")

-- deconstruct api functions
local log = plugin.log
local path = plugin.path
local fs = plugin.fs
local dirs = plugin.dirs
local dioxus = plugin.config.dioxus_toml()

-- plugin information
manager.name = "Karaty CLI Extra"
manager.repository = "https://github.com/mrxiaozhuox/karaty"
manager.author = "YuKun Liu <mrxzx.info@gmail.com>"
manager.version = "0.0.1"

-- init manager plugin api
plugin.init(manager)

manager.on_init = function ()
    return true
end

---@param info BuildInfo
manager.build.on_finish = function (info)
    local config = dioxus.plugin["karaty"]
    CopyKartyConfig()
    if config ~= nil then
        if config["local-source"] ~= nil then
            if config["ocal-sourc"]["on-build"] == true then
                CopyLocalSource()
            end
        end
    end
end

---@param info ServeStartInfo
manager.serve.on_start = function (info)
    CopyKartyConfig()
    CopyLocalSource()
end

---@param info ServeRebuildInfo
manager.serve.on_rebuild_end = function (info)
    CopyKartyConfig()
end

function CopyKartyConfig()
    local out_dir = dioxus.application.out_dir
    local crate_dir = dirs.crate_dir()
    local target = path.join(crate_dir, out_dir, "karaty.toml")
    if path.is_file(target) then
        fs.remove_file(target)
    end
    fs.copy_file(path.join(crate_dir, "karaty.toml"), target)
end

function CopyLocalSource()
    local config = dioxus.plugin["karaty"]
    local out_dir = dioxus.application.out_dir
    local crate_dir = dirs.crate_dir()
    if config == nil then
        config = {}
    end
    if config["local-source"] ~= nil then
        if config["local-source"]["dir"] ~= nil then
            CopyFiles(
                path.join(crate_dir, config["local-source"]["dir"]),
                path.join(crate_dir, out_dir, "source")
            )
        end
    end
end

---@param dir string
---@param target string
function CopyFiles(dir, target)
    if path.is_dir(dir) ~= true then
        return
    end
    local list = fs.read_dir(dir)
    if path.is_dir(target) == false then
        fs.create_dir(target, true)
    end

    local index = {}
    for _, value in ipairs(list) do
        local child_f = path.join(dir, path.file_name(value))
        local child_t = path.join(target, path.file_name(value))
        if path.is_dir(value) then
            CopyFiles(child_f, child_t)
            table.insert(index, {
                type = "dir",
                name = path.file_name(child_t)
            })
        else
            fs.copy_file(child_f, child_t)
            table.insert(index, {
                type = "file",
                name = path.file_name(child_t)
            })
        end
    end
    fs.file_set_content(path.join(target, "index.json"), plugin.json.encode(index))
end

return manager