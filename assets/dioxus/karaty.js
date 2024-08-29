import { create, update_memory, save_template, get_node, initilize } from './snippets/dioxus-interpreter-js-85a0a2f8acce2e86/inline0.js';
import { setAttributeInner } from './snippets/dioxus-interpreter-js-85a0a2f8acce2e86/src/common.js';
import { get_form_data } from './snippets/dioxus-web-a95d8cc6c91ff8eb/inline0.js';
import { Dioxus } from './snippets/dioxus-web-a95d8cc6c91ff8eb/src/eval.js';
import * as __wbg_star0 from './snippets/dioxus-interpreter-js-85a0a2f8acce2e86/inline0.js';

let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error(`expected a boolean argument, found ${typeof(n)}`);
    }
}

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

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');

    heap[idx] = obj;
    return idx;
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error(`expected a number argument, found ${typeof(n)}`);
}

function _assertBigInt(n) {
    if (typeof(n) !== 'bigint') throw new Error(`expected a bigint argument, found ${typeof(n)}`);
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
    if (builtInMatches.length > 1) {
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

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b)
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
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
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
function __wbg_adapter_48(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h12ce30bafd147f4d(arg0, arg1);
}

function __wbg_adapter_51(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h59ad68de13c836e2(arg0, arg1, addHeapObject(arg2));
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
function __wbg_adapter_54(arg0, arg1, arg2) {
    try {
        _assertNum(arg0);
        _assertNum(arg1);
        wasm._dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h64ec967e03bf35d7(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_57(arg0, arg1, arg2) {
    try {
        _assertNum(arg0);
        _assertNum(arg1);
        wasm._dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h20bf65117d19ab86(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_60(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4ef56fd45e4a020a(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_63(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hca6f2d94965ef366(arg0, arg1);
}

function __wbg_adapter_66(arg0, arg1, arg2) {
    try {
        _assertNum(arg0);
        _assertNum(arg1);
        wasm._dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h6a268a1b33ca4e2e(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getObject(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

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
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        _assertNum(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'bigint';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        if (!isLikeNone(ret)) {
            _assertNum(ret);
        }
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = getObject(arg0) in getObject(arg1);
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = getObject(arg0) === getObject(arg1);
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_abd8a48ffd951779 = function() { return logError(function (arg0) {
        const ret = new Dioxus(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_rustSend_6175a678357f46b1 = function() { return logError(function (arg0, arg1) {
        getObject(arg0).rustSend(takeObject(arg1));
    }, arguments) };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getformdata_7206b99ef44b788e = function() { return logError(function (arg0) {
        const ret = get_form_data(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() { return logError(function () {
        const ret = new Error();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function() { return logError(function (arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function() { return logError(function (arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
    if (arg0 !== 0) { wasm.__wbindgen_free(arg0, arg1, 1); }
    console.error(v0);
}, arguments) };
imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
    const ret = getObject(arg0) == getObject(arg1);
    _assertBoolean(ret);
    return ret;
};
imports.wbg.__wbindgen_number_new = function(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};
imports.wbg.__wbg_set_841ac57cff3d672b = function() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
}, arguments) };
imports.wbg.__wbg_String_88810dfeb4021902 = function() { return logError(function (arg0, arg1) {
    const ret = String(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_create_e7a4871bd307ada9 = function() { return logError(function (arg0) {
    create(arg0 >>> 0);
}, arguments) };
imports.wbg.__wbg_updatememory_acd4e8342aa8de4a = function() { return logError(function (arg0) {
    update_memory(takeObject(arg0));
}, arguments) };
imports.wbg.__wbg_savetemplate_c4cab19a5b168471 = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
    wasm.__wbindgen_free(arg0, arg1 * 4, 4);
    save_template(v0, arg2 >>> 0);
}, arguments) };
imports.wbg.__wbg_getnode_f20ae005be1aee22 = function() { return logError(function (arg0) {
    const ret = get_node(arg0 >>> 0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_initilize_bfb3db58295295dd = function() { return logError(function (arg0, arg1) {
    initilize(takeObject(arg0), getObject(arg1));
}, arguments) };
imports.wbg.__wbg_setAttributeInner_605314ec1c8cafdf = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg4, arg5);
    setAttributeInner(takeObject(arg0), v0, takeObject(arg3), v1);
}, arguments) };
imports.wbg.__wbg_queueMicrotask_48421b3cc9052b68 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).queueMicrotask;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_is_function = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    _assertBoolean(ret);
    return ret;
};
imports.wbg.__wbg_queueMicrotask_12a30234db4045d3 = function() { return logError(function (arg0) {
    queueMicrotask(getObject(arg0));
}, arguments) };
imports.wbg.__wbg_clearTimeout_541ac0980ffcef74 = function() { return logError(function (arg0) {
    const ret = clearTimeout(takeObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_setTimeout_7d81d052875b0f4f = function() { return handleError(function (arg0, arg1) {
    const ret = setTimeout(getObject(arg0), arg1);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_Window_5012736c80a01584 = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_document_8554450897a855b9 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_location_af118da6c50d4c3f = function() { return logError(function (arg0) {
    const ret = getObject(arg0).location;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_history_489e13d0b625263c = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).history;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_localStorage_90db5cb66e840248 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).localStorage;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_scrollTo_19dc1dbbc8c19fa8 = function() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0).scrollTo(arg1, arg2);
}, arguments) };
imports.wbg.__wbg_get_8917711b0035218d = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0)[v0];
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_fetch_f3adf866d8944b41 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_title_9f8400307c17c229 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).title;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_createElement_5921e9eb06b9ec89 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createElement(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createElementNS_78308ee7091c53f7 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    const ret = getObject(arg0).createElementNS(v0, v1);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createTextNode_8bce33cf33bf8f6e = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createTextNode(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getElementById_f56c8e6a15a6926d = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).getElementById(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_Element_cc034878d52a64fa = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Element;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_getAttribute_e867e037f066c410 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg1).getAttribute(v0);
    var ptr2 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len2, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr2, true);
}, arguments) };
imports.wbg.__wbg_getBoundingClientRect_35fc4d8fa10e0463 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).getBoundingClientRect();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_scrollIntoView_569698f4895545a5 = function() { return logError(function (arg0, arg1) {
    getObject(arg0).scrollIntoView(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_toggleAttribute_38f9aa9917ec0dbb = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).toggleAttribute(v0);
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlElement_ee6cb55e6b90ae79 = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_blur_2097e550054a8dc8 = function() { return handleError(function (arg0) {
    getObject(arg0).blur();
}, arguments) };
imports.wbg.__wbg_focus_06621101cc79f5d8 = function() { return handleError(function (arg0) {
    getObject(arg0).focus();
}, arguments) };
imports.wbg.__wbg_instanceof_Response_e91b7eb7c611a9ae = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Response;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_text_a94b91ea8700357a = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).text();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_storageArea_6d50769c3ef4494d = function() { return logError(function (arg0) {
    const ret = getObject(arg0).storageArea;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_deltaX_7f4a9de8338c7ca6 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaX;
    return ret;
}, arguments) };
imports.wbg.__wbg_deltaY_606f12aa66daba69 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaY;
    return ret;
}, arguments) };
imports.wbg.__wbg_deltaZ_26a5a3b333712a18 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaZ;
    return ret;
}, arguments) };
imports.wbg.__wbg_deltaMode_d6b849e45efd0f5e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaMode;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_addEventListener_14b036ff7cb8747c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).addEventListener(v0, getObject(arg3), getObject(arg4));
}, arguments) };
imports.wbg.__wbg_removeEventListener_7878b86efe1ab901 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).removeEventListener(v0, getObject(arg3), arg4 !== 0);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlSelectElement_c54017bd3db58d85 = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLSelectElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_value_9991233a797a5fbc = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).value;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlTextAreaElement_75bfdd55ca1a4a97 = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLTextAreaElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_value_2bde81aca5570118 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).value;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_setbehavior_689064979b5313ca = function() { return logError(function (arg0, arg1) {
    getObject(arg0).behavior = ["auto","instant","smooth",][arg1];
}, arguments) };
imports.wbg.__wbg_name_ed3cda975cce080d = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).name;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_href_9c2fe204628af7a3 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg1).href;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_host_a46347409a9511bd = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg1).host;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_url_87b699cb6519ba34 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).url;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_newwithstr_31920be5b8b6d221 = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Request(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_newwithstrandinit_a31c69e4cc337183 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Request(v0, getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_WorkerGlobalScope_e34c8a505711a78e = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof WorkerGlobalScope;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_fetch_ba7fe179e527d942 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_CompositionEvent_682a98021ca8fb13 = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof CompositionEvent;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_data_ee8c1a738c70cbe1 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).data;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_width_85b26c6209197aa9 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).width;
    return ret;
}, arguments) };
imports.wbg.__wbg_height_f270f53dbfb3a632 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).height;
    return ret;
}, arguments) };
imports.wbg.__wbg_type_de7927c168e34c94 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_target_b7cb1739bee70928 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).target;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_preventDefault_c55d86c27b2dfa6e = function() { return logError(function (arg0) {
    getObject(arg0).preventDefault();
}, arguments) };
imports.wbg.__wbg_screenX_a2b9e6e22863d206 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).screenX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_screenY_6c27a423dc6f291e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).screenY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_clientX_3967ecd5e962e1b2 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).clientX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_clientY_37d418b8d9c0bb52 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).clientY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_offsetX_e7047852d4b4b482 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).offsetX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_offsetY_76fc66e0e449645e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).offsetY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_ctrlKey_957c6c31b62b4550 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).ctrlKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_shiftKey_8c0f9a5ca3ff8f93 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).shiftKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_altKey_d3fbce7596aac8cf = function() { return logError(function (arg0) {
    const ret = getObject(arg0).altKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_metaKey_be0158b14b1cef4a = function() { return logError(function (arg0) {
    const ret = getObject(arg0).metaKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_button_460cdec9f2512a91 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).button;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_buttons_a302533e27733599 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).buttons;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_new_ac9dbf743c2383ee = function() { return handleError(function () {
    const ret = new URLSearchParams();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_length_f2469772b8ec9ea3 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_item_9b2e820a37b4fd3f = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).item(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_pushState_fc8b2d0c45854901 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    var v1 = getCachedStringFromWasm0(arg4, arg5);
    getObject(arg0).pushState(getObject(arg1), v0, v1);
}, arguments) };
imports.wbg.__wbg_replaceState_c3213575ed65bac2 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    var v1 = getCachedStringFromWasm0(arg4, arg5);
    getObject(arg0).replaceState(getObject(arg1), v0, v1);
}, arguments) };
imports.wbg.__wbg_debug_d7780810b3a93632 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.debug(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_error_09480e4aadca50ad = function() { return logError(function (arg0) {
    console.error(getObject(arg0));
}, arguments) };
imports.wbg.__wbg_error_f02f3d66b42c6251 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_info_123d8c35ec14384a = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.info(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_log_22aecf4cc2edc319 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.log(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_warn_60924fcf321399f0 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.warn(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_setcapture_4818ebe9ef88b2f6 = function() { return logError(function (arg0, arg1) {
    getObject(arg0).capture = arg1 !== 0;
}, arguments) };
imports.wbg.__wbg_setonce_06b35a72a3fafc15 = function() { return logError(function (arg0, arg1) {
    getObject(arg0).once = arg1 !== 0;
}, arguments) };
imports.wbg.__wbg_setpassive_70ce6704aec553f6 = function() { return logError(function (arg0, arg1) {
    getObject(arg0).passive = arg1 !== 0;
}, arguments) };
imports.wbg.__wbg_setheaders_be10a5ab566fd06f = function() { return logError(function (arg0, arg1) {
    getObject(arg0).headers = getObject(arg1);
}, arguments) };
imports.wbg.__wbg_setmethod_dc68a742c2db5c6a = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).method = v0;
}, arguments) };
imports.wbg.__wbg_animationName_a25d2fb38e676a5c = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).animationName;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_elapsedTime_7c25b13bb9c48d8b = function() { return logError(function (arg0) {
    const ret = getObject(arg0).elapsedTime;
    return ret;
}, arguments) };
imports.wbg.__wbg_pseudoElement_275ba9e63313f644 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).pseudoElement;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_result_3869032b57f861ac = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).result;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_setonload_71d51f79887a9257 = function() { return logError(function (arg0, arg1) {
    getObject(arg0).onload = getObject(arg1);
}, arguments) };
imports.wbg.__wbg_new_8515b7401632bd44 = function() { return handleError(function () {
    const ret = new FileReader();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_readAsArrayBuffer_6475a86a924a8856 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).readAsArrayBuffer(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_readAsText_c056625cb937da4e = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).readAsText(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_getItem_cab39762abab3e70 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg1).getItem(v0);
    var ptr2 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len2, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr2, true);
}, arguments) };
imports.wbg.__wbg_setItem_9482185c870abba6 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setItem(v0, v1);
}, arguments) };
imports.wbg.__wbg_top_322638693276a225 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).top;
    return ret;
}, arguments) };
imports.wbg.__wbg_left_ec3af38bed003a86 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).left;
    return ret;
}, arguments) };
imports.wbg.__wbg_pointerId_37ae0c4682f85248 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pointerId;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_width_70c5d7e6af348a38 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).width;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_height_a5d778a85404eb96 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).height;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_pressure_95cee3909a8549a9 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pressure;
    return ret;
}, arguments) };
imports.wbg.__wbg_tangentialPressure_84b6cda1a0a6cdd3 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).tangentialPressure;
    return ret;
}, arguments) };
imports.wbg.__wbg_tiltX_03e16b531a55705c = function() { return logError(function (arg0) {
    const ret = getObject(arg0).tiltX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_tiltY_c4495a000352e925 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).tiltY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_twist_097164cec18dfd43 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).twist;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_pointerType_d375491a3013a9bc = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).pointerType;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_isPrimary_30dbb508f538b2c6 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).isPrimary;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_search_f384756d8e27fd66 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).search;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_setsearch_b9d03a586b9a2fa4 = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).search = v0;
}, arguments) };
imports.wbg.__wbg_new_33db4be5d9963ec1 = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new URL(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlFormElement_f1c49500e9c5fd42 = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLFormElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_altKey_5a6eb49ec8194792 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).altKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_ctrlKey_319ff2374dc7f372 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).ctrlKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_shiftKey_f38dee34420e0d62 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).shiftKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_metaKey_00fdcfadf1968d45 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).metaKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_location_d7fe3090ad7e80d7 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).location;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_repeat_8451a79b3608855b = function() { return logError(function (arg0) {
    const ret = getObject(arg0).repeat;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_key_a626396efbca2b95 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).key;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_code_01dc6af887ca9ecb = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).code;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_propertyName_c388e5bef92996bc = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).propertyName;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_elapsedTime_6560901e49831891 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).elapsedTime;
    return ret;
}, arguments) };
imports.wbg.__wbg_pseudoElement_fb75011eff7853cb = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).pseudoElement;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlInputElement_88bf515ab1d9511d = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLInputElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_checked_1502c0098821afb3 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).checked;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_files_b94d8f21e2b53924 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).files;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_type_c29d14b7056ba1f2 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_value_d4a95e7a0d390578 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).value;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_new_e27c93803e1acc42 = function() { return handleError(function () {
    const ret = new Headers();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_Node_807587297afc161b = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Node;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_parentElement_fbf8d048e797326d = function() { return logError(function (arg0) {
    const ret = getObject(arg0).parentElement;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_textContent_a049d1ce093c3d21 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).textContent;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_appendChild_ac45d1abddf1b89b = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).appendChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_altKey_cac6fdedfe2f5107 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).altKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_metaKey_795ff1b49c71ce3a = function() { return logError(function (arg0) {
    const ret = getObject(arg0).metaKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_ctrlKey_70bbb597e1c54bbb = function() { return logError(function (arg0) {
    const ret = getObject(arg0).ctrlKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_shiftKey_fd3ea494de0c3475 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).shiftKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_pageX_659907bf27190521 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pageX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_pageY_b68450e73ec8e0cd = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pageY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_charCodeAt_e6c7cb2b8c394908 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).charCodeAt(arg1 >>> 0);
    return ret;
}, arguments) };
imports.wbg.__wbg_get_3baa728f9d58d3f6 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_length_ae22078168b726f5 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_new_a220cf903aa02ca2 = function() { return logError(function () {
    const ret = new Array();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_newnoargs_76313bd6ff35d0f2 = function() { return logError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Function(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_8608a2b51a5f6737 = function() { return logError(function () {
    const ret = new Map();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_next_de3e9db4440638b2 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).next;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_next_f9cb570345655b9a = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_done_bfda7aa8f252b39f = function() { return logError(function (arg0) {
    const ret = getObject(arg0).done;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_value_6d39332ab4788d86 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_iterator_888179a48810a9fe = function() { return logError(function () {
    const ret = Symbol.iterator;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_get_224d16597dbbfd96 = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_call_1084a111329e68ce = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_525245e2b9901204 = function() { return logError(function () {
    const ret = new Object();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_length_c582046780042f90 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_self_3093d5d1f7bcb682 = function() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_window_3bcfc4d31bc012f8 = function() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_globalThis_86b222e13bdf32ed = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_global_e5a3fe56f8be9485 = function() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_eval_6e4fc17d87772f52 = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = eval(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_set_673dda6c73d19609 = function() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
}, arguments) };
imports.wbg.__wbg_isArray_8364a5371e9737d8 = function() { return logError(function (arg0) {
    const ret = Array.isArray(getObject(arg0));
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_ArrayBuffer_61dfc3198373c902 = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_Error_69bde193b0cc95e3 = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Error;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_message_e18bae0a0e2c097a = function() { return logError(function (arg0) {
    const ret = getObject(arg0).message;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_name_ac78212e803c7941 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).name;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_toString_9d18e102ca933e68 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).toString();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_newwithargs_7bac380a0f0eff16 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var v1 = getCachedStringFromWasm0(arg2, arg3);
    const ret = new Function(v0, v1);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_call_89af060b4e1523f2 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_set_49185437f0ab06f8 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_entries_2f5ddf03b53c6730 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).entries();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_isSafeInteger_7f1ed56200d90674 = function() { return logError(function (arg0) {
    const ret = Number.isSafeInteger(getObject(arg0));
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_getTime_91058879093a1589 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).getTime();
    return ret;
}, arguments) };
imports.wbg.__wbg_getTimezoneOffset_c9929a3cc94500fe = function() { return logError(function (arg0) {
    const ret = getObject(arg0).getTimezoneOffset();
    return ret;
}, arguments) };
imports.wbg.__wbg_new_7982fb43cfca37ae = function() { return logError(function (arg0) {
    const ret = new Date(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new0_65387337a95cf44d = function() { return logError(function () {
    const ret = new Date();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_entries_7a0e06255456ebcd = function() { return logError(function (arg0) {
    const ret = Object.entries(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_is_009b1ef508712fda = function() { return logError(function (arg0, arg1) {
    const ret = Object.is(getObject(arg0), getObject(arg1));
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_toString_e17a6671146f47c1 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).toString();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_exec_a29a4ce5544bd3be = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).exec(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_lastindex_d250a1fd49244f35 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).lastIndex;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_new_13847c66f41dda63 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var v1 = getCachedStringFromWasm0(arg2, arg3);
    const ret = new RegExp(v0, v1);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_resolve_570458cb99d56a43 = function() { return logError(function (arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_then_95e6edc0f89b73b1 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_then_876bb3c633745cc6 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_buffer_b7b08af79b0b0974 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_ea1883e1e5e86686 = function() { return logError(function (arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_set_d1e79e2388520f18 = function() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
}, arguments) };
imports.wbg.__wbg_length_8339fcf5d8ecd12e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_Uint8Array_247a91427532499e = function() { return logError(function (arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_stringify_bbf45426c92a6bf5 = function() { return handleError(function (arg0) {
    const ret = JSON.stringify(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
    const v = getObject(arg1);
    const ret = typeof(v) === 'bigint' ? v : undefined;
    if (!isLikeNone(ret)) {
        _assertBigInt(ret);
    }
    getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper1636 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 929, __wbg_adapter_48);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper1637 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 929, __wbg_adapter_51);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper1639 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 929, __wbg_adapter_54);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper3426 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1886, __wbg_adapter_57);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper4616 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2585, __wbg_adapter_60);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper4716 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2636, __wbg_adapter_63);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper4901 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2718, __wbg_adapter_66);
    return addHeapObject(ret);
}, arguments) };
imports['./snippets/dioxus-interpreter-js-85a0a2f8acce2e86/inline0.js'] = __wbg_star0;

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


    if (typeof module !== 'undefined' && Object.getPrototypeOf(module) === Object.prototype)
    ({module} = module)
    else
    console.warn('using deprecated parameters for `initSync()`; pass a single object instead')

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


    if (typeof module_or_path !== 'undefined' && Object.getPrototypeOf(module_or_path) === Object.prototype)
    ({module_or_path} = module_or_path)
    else
    console.warn('using deprecated parameters for the initialization function; pass a single object instead')


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
