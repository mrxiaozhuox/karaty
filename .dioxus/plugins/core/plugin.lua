-- This function can convert object (list, table) to string
local function object_to_string(object)
    if type(object) == 'table' then
        local s = '{ '
        for k, v in pairs(object) do
            if type(k) ~= 'number' then k = '"' .. k .. '"' end
            s = s .. '[' .. k .. '] = ' .. object_to_string(v) .. ','
        end
        return s .. '} '
    else
        return tostring(object)
    end
end

---@class PluginApi
local api = {
    log = {
        ---@type fun(info: string)
        trace = function (info)
            local plugin_dir_name = plugin_lib.path.file_name(_temp_plugin_dir)
            plugin_lib.log.trace("[" .. plugin_dir_name .. "] " .. info)
        end,
        ---@type fun(info: string)
        debug = function (info)
            local plugin_dir_name = plugin_lib.path.file_name(_temp_plugin_dir)
            plugin_lib.log.debug("[" .. plugin_dir_name .. "] " .. info)
        end,
        ---@type fun(info: string)
        info = function (info)
            local plugin_dir_name = plugin_lib.path.file_name(_temp_plugin_dir)
            plugin_lib.log.info("[" .. plugin_dir_name .. "] " .. info)
        end,
        ---@type fun(info: string)
        warn = function (info)
            local plugin_dir_name = plugin_lib.path.file_name(_temp_plugin_dir)
            plugin_lib.log.warn("[" .. plugin_dir_name .. "] " .. info)
        end,
        ---@type fun(info: string)
        error = function (info)
            local plugin_dir_name = plugin_lib.path.file_name(_temp_plugin_dir)
            plugin_lib.log.error("[" .. plugin_dir_name .. "] " .. info)
        end,
    },
    command = {
        ---@alias stdio
        --- | '"inhert"'
        --- | '"piped"'
        --- | '"null"'
        ---@type fun(cmd: string[], stdout: stdio, stderr: stdio)
        exec = plugin_lib.command.exec,
    },
    network = {
        ---@type fun(url: string, path: string): boolean
        download_file = plugin_lib.network.download_file,
    },
    json = {
        ---@type fun(value: any): string
        encode = plugin_lib.json.encode,
        ---@type fun(value: string): any
        decode = plugin_lib.json.decode,
    },
    fs = {
        ---@type fun(path: string, recursive: boolean): boolean
        create_dir = plugin_lib.fs.create_dir,
        ---@type fun(path: string): boolean
        remove_dir = plugin_lib.fs.remove_dir,
        ---@type fun(path: string): string
        file_get_content = plugin_lib.fs.file_get_content,
        ---@type fun(path: string, content: string): boolean
        file_set_content = plugin_lib.fs.file_set_content,
        ---@type fun(path: string): boolean
        remove_file = plugin_lib.fs.remove_file,
        ---@type fun(path: string, target: string): boolean
        move_file = plugin_lib.fs.move_file,
        ---@type fun(path: string, target: string): boolean
        copy_file = plugin_lib.fs.copy_file,
        ---@type fun(path: string, target: string): boolean
        unzip_file = plugin_lib.fs.unzip_file,
        ---@type fun(path: string, target: string): boolean
        untar_gz_file = plugin_lib.fs.untar_gz_file,
        ---@type fun(path: string): string[]
        read_dir = plugin_lib.fs.read_dir,
    },
    os = {
        ---@alias platform
        --- | '"windows"'
        --- | '"macos"'
        --- | '"linux"'
        ---@type fun(): platform
        current_platform = plugin_lib.os.current_platform,
    },
    path = {
        ---@type fun(...: string): string
        join = plugin_lib.path.join,
        ---@type fun(path: string): boolean
        exists = plugin_lib.path.exists,
        ---@type fun(path: string): boolean
        is_dir = plugin_lib.path.is_dir,
        ---@type fun(path: string): boolean
        is_file = plugin_lib.path.is_file,
        ---@type fun(path: string): string
        file_name = plugin_lib.path.file_name,
    },
    dirs = {
        ---@type fun(): string
        crate_dir = plugin_lib.dirs.crate_dir,
    },
    tool = {
        ---@type fun(object: any): string
        object_to_string = object_to_string,
    },
    config = {},
}

do
    local private_value = {
        ---@type string | nil
        name = nil,
        ---@type string | nil
        repository = nil,
        ---@type string | nil
        author = nil,
        ---@type string | nil
        version = nil,
        ---@type string | nil
        plugin_dir = nil,
    }

    ---@param manager Manager
    function api.init(manager)
        private_value.name = manager.name
        private_value.repository = manager.repository
        private_value.author = manager.author
        private_value.version = manager.version
        private_value.plugin_dir = _temp_plugin_dir
    end

    ---@return DioxusConfig
    function api.config.dioxus_toml()
        return plugin_config
    end

    ---@return table|nil
    function api.config.plugin_config()
        local config = api.config.dioxus_toml()
        if private_value.name == nil then
        	return nil
        end
        return config.plugin[private_value.name]
    end

    ---@return string
    function api.dirs.plugin_dir()
        ---@type string
        return private_value.plugin_dir
    end

    ---@return string
    function api.dirs.bin_dir()
        local root_dir = api.dirs.plugin_dir()
        return api.path.join(root_dir, "bin")
    end

    ---@return string
    function api.dirs.temp_dir()
        local root_dir = api.dirs.plugin_dir()
        return api.path.join(root_dir, "temp")
    end

    ---@param url string
    ---@param path string
    ---@return boolean
    function api.network.clone_repo(url, path)
        api.command.exec({ "git", "clone", url, path }, "null", "null")
        return api.fs.exists(path) and api.fs.is_dir(path)
    end

end

return api
