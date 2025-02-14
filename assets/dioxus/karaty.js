import { create, get_node, save_template } from './snippets/dioxus-interpreter-js-85a0a2f8acce2e86/inline0.js';
import { setAttributeInner } from './snippets/dioxus-interpreter-js-85a0a2f8acce2e86/src/common.js';
import { Dioxus } from './snippets/dioxus-web-a95d8cc6c91ff8eb/src/eval.js';
import * as __wbg_star0 from './snippets/dioxus-interpreter-js-85a0a2f8acce2e86/inline0.js';
import * as __wbg_star1 from './snippets/dioxus-web-a95d8cc6c91ff8eb/inline0.js';

let wasm;

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (typeof(arg) !== 'string') throw new Error(`expected a string argument, found ${typeof(arg)}`);

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

function getFromExternrefTable0(idx) { return wasm.__wbindgen_export_2.get(idx); }

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getFromExternrefTable0(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error(`expected a boolean argument, found ${typeof(n)}`);
    }
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error(`expected a number argument, found ${typeof(n)}`);
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_2.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function _assertBigInt(n) {
    if (typeof(n) !== 'bigint') throw new Error(`expected a bigint argument, found ${typeof(n)}`);
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_7.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_7.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
function __wbg_adapter_50(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h889f63ea5efad5a8(arg0, arg1);
}

function __wbg_adapter_53(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure956_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_56(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure960_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_59(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure1918_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_62(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure2660_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_65(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h2c9b6790aa97fec7(arg0, arg1);
}

function __wbg_adapter_68(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure2787_externref_shim(arg0, arg1, arg2);
}

const __wbindgen_enum_ScrollBehavior = ["auto", "instant", "smooth"];

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_String_eecc4a11987127d6 = function() { return logError(function (arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_addEventListener_84ae3eac6e15480a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        arg0.addEventListener(v0, arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_altKey_c33c03aed82e4275 = function() { return logError(function (arg0) {
        const ret = arg0.altKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_altKey_d7495666df921121 = function() { return logError(function (arg0) {
        const ret = arg0.altKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_altKey_e86f36ea33b3de8b = function() { return logError(function (arg0) {
        const ret = arg0.altKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_animationName_e8ef6512e25f6a3b = function() { return logError(function (arg0, arg1) {
        const ret = arg1.animationName;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_appendChild_8204974b7328bf98 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.appendChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_blur_c2ad8cc71bac3974 = function() { return handleError(function (arg0) {
        arg0.blur();
    }, arguments) };
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function() { return logError(function (arg0) {
        const ret = arg0.buffer;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_button_f75c56aec440ea04 = function() { return logError(function (arg0) {
        const ret = arg0.button;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buttons_b6346af6f04e4686 = function() { return logError(function (arg0) {
        const ret = arg0.buttons;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_charCodeAt_abe5953e37f4b5a6 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.charCodeAt(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_checked_0591091c28a685f0 = function() { return logError(function (arg0) {
        const ret = arg0.checked;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clearTimeout_5a54f8841c30079a = function() { return logError(function (arg0) {
        const ret = clearTimeout(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clientX_5eb380a5f1fec6fd = function() { return logError(function (arg0) {
        const ret = arg0.clientX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clientY_d8b9c7f0c4e2e677 = function() { return logError(function (arg0) {
        const ret = arg0.clientY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clipboard_93f8aa8cc426db44 = function() { return logError(function (arg0) {
        const ret = arg0.clipboard;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_code_459c120478e1ab6e = function() { return logError(function (arg0, arg1) {
        const ret = arg1.code;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_createElementNS_914d752e521987da = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        var v1 = getCachedStringFromWasm0(arg3, arg4);
        const ret = arg0.createElementNS(v0, v1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createElement_8c9931a732ee2fea = function() { return handleError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = arg0.createElement(v0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createTextNode_42af1a9f21bb3360 = function() { return logError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = arg0.createTextNode(v0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_create_2730e76277524bbd = function() { return logError(function (arg0) {
        create(arg0 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_ctrlKey_1e826e468105ac11 = function() { return logError(function (arg0) {
        const ret = arg0.ctrlKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_ctrlKey_cdbe8154dfb00d1f = function() { return logError(function (arg0) {
        const ret = arg0.ctrlKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_ctrlKey_fb23aad8b73f7459 = function() { return logError(function (arg0) {
        const ret = arg0.ctrlKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_data_e77bd5c125ecc8a8 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.data;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_debug_e17b51583ca6a632 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        console.debug(arg0, arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_deltaMode_9bfd9fe3f6b4b240 = function() { return logError(function (arg0) {
        const ret = arg0.deltaMode;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_deltaX_5c1121715746e4b7 = function() { return logError(function (arg0) {
        const ret = arg0.deltaX;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_deltaY_f9318542caea0c36 = function() { return logError(function (arg0) {
        const ret = arg0.deltaY;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_deltaZ_a515df5539e84914 = function() { return logError(function (arg0) {
        const ret = arg0.deltaZ;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_document_d249400bd7bd996d = function() { return logError(function (arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_done_769e5ede4b31c67b = function() { return logError(function (arg0) {
        const ret = arg0.done;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_elapsedTime_0bb4cd6e7aefb5bb = function() { return logError(function (arg0) {
        const ret = arg0.elapsedTime;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_elapsedTime_1aa80b6dcb7427f3 = function() { return logError(function (arg0) {
        const ret = arg0.elapsedTime;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_entries_3265d4158b33e5dc = function() { return logError(function (arg0) {
        const ret = Object.entries(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_entries_c8a90a7ed73e84ce = function() { return logError(function (arg0) {
        const ret = arg0.entries();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_error_524f506f44df1645 = function() { return logError(function (arg0) {
        console.error(arg0);
    }, arguments) };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function() { return logError(function (arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
        if (arg0 !== 0) { wasm.__wbindgen_free(arg0, arg1, 1); }
        console.error(v0);
    }, arguments) };
    imports.wbg.__wbg_error_80de38b3f7cc3c3c = function() { return logError(function (arg0, arg1, arg2, arg3) {
        console.error(arg0, arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_eval_e10dc02e9547f640 = function() { return handleError(function (arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
        const ret = eval(v0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_exec_3e2d2d0644c927df = function() { return logError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = arg0.exec(v0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_fetch_509096533071c657 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.fetch(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_fetch_b7bf320f681242d2 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.fetch(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_files_790cda07a2445fac = function() { return logError(function (arg0) {
        const ret = arg0.files;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_focus_7d08b55eba7b368d = function() { return handleError(function (arg0) {
        arg0.focus();
    }, arguments) };
    imports.wbg.__wbg_getAttribute_ea5166be2deba45e = function() { return logError(function (arg0, arg1, arg2, arg3) {
        var v0 = getCachedStringFromWasm0(arg2, arg3);
        const ret = arg1.getAttribute(v0);
        var ptr2 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len2, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr2, true);
    }, arguments) };
    imports.wbg.__wbg_getBoundingClientRect_9073b0ff7574d76b = function() { return logError(function (arg0) {
        const ret = arg0.getBoundingClientRect();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getElementById_f827f0d6648718a8 = function() { return logError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = arg0.getElementById(v0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getItem_17f98dee3b43fa7e = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        var v0 = getCachedStringFromWasm0(arg2, arg3);
        const ret = arg1.getItem(v0);
        var ptr2 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len2, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr2, true);
    }, arguments) };
    imports.wbg.__wbg_getTime_46267b1c24877e30 = function() { return logError(function (arg0) {
        const ret = arg0.getTime();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getTimezoneOffset_6b5752021c499c47 = function() { return logError(function (arg0) {
        const ret = arg0.getTimezoneOffset();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_74b8744f6a23f4fa = function() { return logError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = arg0[v0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_get_b9b93047fe3cf45b = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getnode_ce6fef8a26bbbcf8 = function() { return logError(function (arg0) {
        const ret = get_node(arg0 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_height_46ca33dbfea52e29 = function() { return logError(function (arg0) {
        const ret = arg0.height;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_height_592a89ec0fb63726 = function() { return logError(function (arg0) {
        const ret = arg0.height;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_history_b8221edd09c17656 = function() { return handleError(function (arg0) {
        const ret = arg0.history;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_host_9bd7b5dc07c48606 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.host;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_href_87d60a783a012377 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.href;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_info_033d8b8a0838f1d3 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        console.info(arg0, arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_instanceof_ArrayBuffer_e14585432e3737fc = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_CompositionEvent_604a5878ac51c696 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof CompositionEvent;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Element_0af65443936d5154 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Element;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Error_4d54113b22d20306 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Error;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlElement_51378c201250b16c = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlFormElement_339aa0fb9076db8e = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLFormElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlInputElement_12d71bf2d15dd19e = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLInputElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlSelectElement_2ae72edd07bf938c = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLSelectElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlTextAreaElement_83a92f8ba4fb63ae = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLTextAreaElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Node_fbc6b87f5ed2e230 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Node;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Response_f2cc20d9f7dfd644 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Response;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Uint8Array_17156bcf118086a9 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_WorkerGlobalScope_dbdbdea7e3b56493 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof WorkerGlobalScope;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isArray_a1eab7e0d067391b = function() { return logError(function (arg0) {
        const ret = Array.isArray(arg0);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isPrimary_50d7d610b8b63e41 = function() { return logError(function (arg0) {
        const ret = arg0.isPrimary;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isSafeInteger_343e2beeeece1bb0 = function() { return logError(function (arg0) {
        const ret = Number.isSafeInteger(arg0);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_is_c7481c65e7e5df9e = function() { return logError(function (arg0, arg1) {
        const ret = Object.is(arg0, arg1);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_item_152181ce9027baaf = function() { return logError(function (arg0, arg1) {
        const ret = arg0.item(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_iterator_9a24c88df860dc65 = function() { return logError(function () {
        const ret = Symbol.iterator;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_key_7b5c6cb539be8e13 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.key;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_lastindex_cfde6ee9213d18e2 = function() { return logError(function (arg0) {
        const ret = arg0.lastIndex;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_left_e46801720267b66d = function() { return logError(function (arg0) {
        const ret = arg0.left;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_a446193dc22c12f8 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_cfc862ec0ccc7ca0 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_d56737991078581b = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_e2d2a49132c1b256 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_localStorage_1406c99c39728187 = function() { return handleError(function (arg0) {
        const ret = arg0.localStorage;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_location_350d99456c2f3693 = function() { return logError(function (arg0) {
        const ret = arg0.location;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_location_9b435486be8f98c2 = function() { return logError(function (arg0) {
        const ret = arg0.location;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_log_cad59bb680daec67 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        console.log(arg0, arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_message_97a2af9b89d693a3 = function() { return logError(function (arg0) {
        const ret = arg0.message;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_metaKey_0b25f7848e014cc8 = function() { return logError(function (arg0) {
        const ret = arg0.metaKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_metaKey_5734dfddca604fc6 = function() { return logError(function (arg0) {
        const ret = arg0.metaKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_metaKey_e1dd47d709a80ce5 = function() { return logError(function (arg0) {
        const ret = arg0.metaKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_name_0b327d569f00ebee = function() { return logError(function (arg0) {
        const ret = arg0.name;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_name_28c43f147574bf08 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_navigator_1577371c070c8947 = function() { return logError(function (arg0) {
        const ret = arg0.navigator;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new0_f788a2397c7ca929 = function() { return logError(function () {
        const ret = new Date();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_018dcc2d6c8c2f6a = function() { return handleError(function () {
        const ret = new Headers();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_05f3be6be697d7ec = function() { return logError(function (arg0) {
        const ret = new Dioxus(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_31a97dac4f10fab7 = function() { return logError(function (arg0) {
        const ret = new Date(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() { return logError(function () {
        const ret = new Object();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_46e8134c3341d05a = function() { return handleError(function () {
        const ret = new FileReader();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_5e0be73521bc8c17 = function() { return logError(function () {
        const ret = new Map();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_63847613cde5d4bc = function() { return logError(function (arg0, arg1, arg2, arg3) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
        var v1 = getCachedStringFromWasm0(arg2, arg3);
        const ret = new RegExp(v0, v1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_78feb108b6472713 = function() { return logError(function () {
        const ret = new Array();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_80bf4ee74f41ff92 = function() { return handleError(function () {
        const ret = new URLSearchParams();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() { return logError(function () {
        const ret = new Error();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_9ffbe0a71eff35e3 = function() { return handleError(function (arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
        const ret = new URL(v0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_a12002a7f91c75be = function() { return logError(function (arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function() { return logError(function (arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
        const ret = new Function(v0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithargs_ab6ffe8cd6c19c04 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
        var v1 = getCachedStringFromWasm0(arg2, arg3);
        const ret = new Function(v0, v1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithstr_78e86e03c4ae814e = function() { return handleError(function (arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
        const ret = new Request(v0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithstrandinit_06c535e0a867c635 = function() { return handleError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
        const ret = new Request(v0, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_25feadfc0913fea9 = function() { return logError(function (arg0) {
        const ret = arg0.next;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_6574e1a8a62d1055 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_offsetX_adb14e39bdd32e22 = function() { return logError(function (arg0) {
        const ret = arg0.offsetX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_offsetY_e88dc24ec0418dd4 = function() { return logError(function (arg0) {
        const ret = arg0.offsetY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_pageX_ce146fc8b9d1c155 = function() { return logError(function (arg0) {
        const ret = arg0.pageX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_pageY_4d1412e9ba1fdcde = function() { return logError(function (arg0) {
        const ret = arg0.pageY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_parentElement_be28a1a931f9c9b7 = function() { return logError(function (arg0) {
        const ret = arg0.parentElement;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_pointerId_585e63ee80a49927 = function() { return logError(function (arg0) {
        const ret = arg0.pointerId;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_pointerType_6bd934aa20d9db49 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.pointerType;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_pressure_adda5a83a9cec94d = function() { return logError(function (arg0) {
        const ret = arg0.pressure;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_preventDefault_c2314fd813c02b3c = function() { return logError(function (arg0) {
        arg0.preventDefault();
    }, arguments) };
    imports.wbg.__wbg_propertyName_95755b7de403ec53 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.propertyName;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_pseudoElement_4aac34144e5bd419 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.pseudoElement;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_pseudoElement_652df792fba77dd6 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.pseudoElement;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_pushState_d132f15566570786 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        var v0 = getCachedStringFromWasm0(arg2, arg3);
        var v1 = getCachedStringFromWasm0(arg4, arg5);
        arg0.pushState(arg1, v0, v1);
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function() { return logError(function (arg0) {
        queueMicrotask(arg0);
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function() { return logError(function (arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_readAsArrayBuffer_e51cb3c4fcc962de = function() { return handleError(function (arg0, arg1) {
        arg0.readAsArrayBuffer(arg1);
    }, arguments) };
    imports.wbg.__wbg_readAsText_b48ba55794326a02 = function() { return handleError(function (arg0, arg1) {
        arg0.readAsText(arg1);
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_d365ee1c2a7b08f0 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        arg0.removeEventListener(v0, arg3, arg4 !== 0);
    }, arguments) };
    imports.wbg.__wbg_repeat_1882aa0d0072c705 = function() { return logError(function (arg0) {
        const ret = arg0.repeat;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_replaceState_79f3b896be12c919 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        var v0 = getCachedStringFromWasm0(arg2, arg3);
        var v1 = getCachedStringFromWasm0(arg4, arg5);
        arg0.replaceState(arg1, v0, v1);
    }, arguments) };
    imports.wbg.__wbg_resolve_4851785c9c5f573d = function() { return logError(function (arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_result_dadbdcc801180072 = function() { return handleError(function (arg0) {
        const ret = arg0.result;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_rustSend_c5f884ac2b3b901a = function() { return logError(function (arg0, arg1) {
        arg0.rustSend(arg1);
    }, arguments) };
    imports.wbg.__wbg_savetemplate_e40a97aff0e5f039 = function() { return logError(function (arg0, arg1, arg2) {
        var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
        wasm.__wbindgen_free(arg0, arg1 * 4, 4);
        save_template(v0, arg2 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_screenX_ad7e620ee9a265ab = function() { return logError(function (arg0) {
        const ret = arg0.screenX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_screenY_f77ce1ae06a86fff = function() { return logError(function (arg0) {
        const ret = arg0.screenY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scrollIntoView_c8c0faa10ba6968a = function() { return logError(function (arg0, arg1) {
        arg0.scrollIntoView(arg1);
    }, arguments) };
    imports.wbg.__wbg_scrollTo_26cd993048111460 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.scrollTo(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_search_e0e79cfe010c5c23 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.search;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_setAttributeInner_d9036cafe5be3e2d = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        var v1 = getCachedStringFromWasm0(arg4, arg5);
        setAttributeInner(arg0, v0, arg3, v1);
    }, arguments) };
    imports.wbg.__wbg_setItem_212ecc915942ab0a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        var v1 = getCachedStringFromWasm0(arg3, arg4);
        arg0.setItem(v0, v1);
    }, arguments) };
    imports.wbg.__wbg_setTimeout_db2dbaeefb6f39c7 = function() { return handleError(function (arg0, arg1) {
        const ret = setTimeout(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_37837023f3d740e8 = function() { return logError(function (arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    }, arguments) };
    imports.wbg.__wbg_set_3807d5f0bfc24aa7 = function() { return logError(function (arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    }, arguments) };
    imports.wbg.__wbg_set_65595bdd868b3009 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_set_8fc6bf8a5b1071d1 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.set(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setbehavior_7927939a0bc6d379 = function() { return logError(function (arg0, arg1) {
        arg0.behavior = __wbindgen_enum_ScrollBehavior[arg1];
    }, arguments) };
    imports.wbg.__wbg_setcapture_46bd7043887eba02 = function() { return logError(function (arg0, arg1) {
        arg0.capture = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_setheaders_834c0bdb6a8949ad = function() { return logError(function (arg0, arg1) {
        arg0.headers = arg1;
    }, arguments) };
    imports.wbg.__wbg_setmethod_3c5280fe5d890842 = function() { return logError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        arg0.method = v0;
    }, arguments) };
    imports.wbg.__wbg_setonce_0cb80aea26303a35 = function() { return logError(function (arg0, arg1) {
        arg0.once = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_setonload_1302417ca59f658b = function() { return logError(function (arg0, arg1) {
        arg0.onload = arg1;
    }, arguments) };
    imports.wbg.__wbg_setpassive_57a5a4c4b00a7c62 = function() { return logError(function (arg0, arg1) {
        arg0.passive = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_setsearch_609451e9e712f3c6 = function() { return logError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        arg0.search = v0;
    }, arguments) };
    imports.wbg.__wbg_shiftKey_2bebb3b703254f47 = function() { return logError(function (arg0) {
        const ret = arg0.shiftKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_shiftKey_86e737105bab1a54 = function() { return logError(function (arg0) {
        const ret = arg0.shiftKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_shiftKey_c745a96baa2d27af = function() { return logError(function (arg0) {
        const ret = arg0.shiftKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function() { return logError(function (arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() { return logError(function () {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() { return logError(function () {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() { return logError(function () {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() { return logError(function () {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_storageArea_6aa8b917ab586d80 = function() { return logError(function (arg0) {
        const ret = arg0.storageArea;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_stringify_f7ed6987935b4a24 = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_tangentialPressure_ee3abd4259233d0a = function() { return logError(function (arg0) {
        const ret = arg0.tangentialPressure;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_target_0a62d9d79a2a1ede = function() { return logError(function (arg0) {
        const ret = arg0.target;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_textContent_215d0f87d539368a = function() { return logError(function (arg0, arg1) {
        const ret = arg1.textContent;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_text_7805bea50de2af49 = function() { return handleError(function (arg0) {
        const ret = arg0.text();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_then_44b73946d2fb3e7d = function() { return logError(function (arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_then_48b406749878a531 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_tiltX_ffc5b340f3484031 = function() { return logError(function (arg0) {
        const ret = arg0.tiltX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_tiltY_e01bc77dd789806e = function() { return logError(function (arg0) {
        const ret = arg0.tiltY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_title_09f6e06f98d0b686 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.title;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_toString_5285597960676b7b = function() { return logError(function (arg0) {
        const ret = arg0.toString();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_toString_c813bbd34d063839 = function() { return logError(function (arg0) {
        const ret = arg0.toString();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_toggleAttribute_afba3a9c057ca8b4 = function() { return handleError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = arg0.toggleAttribute(v0);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_top_ec9fceb1f030f2ea = function() { return logError(function (arg0) {
        const ret = arg0.top;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_twist_a22a43045193e78f = function() { return logError(function (arg0) {
        const ret = arg0.twist;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_type_16f2b8031796512f = function() { return logError(function (arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_type_647b08efadd633f2 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_url_8f9653b899456042 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.url;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_value_1d971aac958c6f2f = function() { return logError(function (arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_value_91cbf0dd3ab84c1e = function() { return logError(function (arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_value_cd1ffa7b1ab794f1 = function() { return logError(function (arg0) {
        const ret = arg0.value;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_value_d2c3b815cdf98d46 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_warn_aaf1f4664a035bd6 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        console.warn(arg0, arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_width_aed87bf6026ca08f = function() { return logError(function (arg0) {
        const ret = arg0.width;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_width_f0759bd8bad335bd = function() { return logError(function (arg0) {
        const ret = arg0.width;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_writeText_51c338e8ae4b85b9 = function() { return logError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = arg0.writeText(v0);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        if (!isLikeNone(ret)) {
            _assertBigInt(ret);
        }
        getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        _assertNum(ret);
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1668 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 957, __wbg_adapter_50);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper1669 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 957, __wbg_adapter_53);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper1671 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 957, __wbg_adapter_56);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper3489 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 1919, __wbg_adapter_59);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper4743 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2661, __wbg_adapter_62);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper4831 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2702, __wbg_adapter_65);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper5036 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2788, __wbg_adapter_68);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = arg0 === arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = arg0 == arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        if (!isLikeNone(ret)) {
            _assertNum(ret);
        }
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports['./snippets/dioxus-interpreter-js-85a0a2f8acce2e86/inline0.js'] = __wbg_star0;
    imports['./snippets/dioxus-web-a95d8cc6c91ff8eb/inline0.js'] = __wbg_star1;

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }


    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
