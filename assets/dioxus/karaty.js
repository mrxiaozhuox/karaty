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

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
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
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

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
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
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

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');

    heap[idx] = obj;
    return idx;
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error(`expected a boolean argument, found ${typeof(n)}`);
    }
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error(`expected a number argument, found ${typeof(n)}`);
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

function _assertBigInt(n) {
    if (typeof(n) !== 'bigint') throw new Error(`expected a bigint argument, found ${typeof(n)}`);
}

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
        cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
    }
    return cachedBigInt64Memory0;
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
function __wbg_adapter_48(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures__invoke1_mut__hf4d752464b98983d(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_51(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures__invoke0_mut__h60f5504acf1b3c59(arg0, arg1);
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
        wasm.wasm_bindgen__convert__closures__invoke1_mut_ref__hadf1332ced400bb4(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_57(arg0, arg1, arg2) {
    try {
        _assertNum(arg0);
        _assertNum(arg1);
        wasm.wasm_bindgen__convert__closures__invoke1_mut_ref__h2bf7f9ca821a1998(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_60(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h75cd944c71b4a46b(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_63(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures__invoke0_mut__h5c5a063454d0655d(arg0, arg1);
}

function __wbg_adapter_66(arg0, arg1, arg2) {
    try {
        _assertNum(arg0);
        _assertNum(arg1);
        wasm.wasm_bindgen__convert__closures__invoke1_mut_ref__h47c5bc09bb9e562e(arg0, arg1, addBorrowedObject(arg2));
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

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
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
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
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
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
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
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        if (!isLikeNone(ret)) {
            _assertNum(ret);
        }
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
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
    imports.wbg.__wbg_new_abd8a48ffd951779 = function() { return logError(function (arg0) {
        const ret = new Dioxus(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_rustSend_6175a678357f46b1 = function() { return logError(function (arg0, arg1) {
        getObject(arg0).rustSend(takeObject(arg1));
    }, arguments) };
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
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
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
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
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
imports.wbg.__wbg_queueMicrotask_f61ee94ee663068b = function() { return logError(function (arg0) {
    queueMicrotask(getObject(arg0));
}, arguments) };
imports.wbg.__wbg_queueMicrotask_f82fc5d1e8f816ae = function() { return logError(function (arg0) {
    const ret = getObject(arg0).queueMicrotask;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_is_function = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    _assertBoolean(ret);
    return ret;
};
imports.wbg.__wbg_clearTimeout_541ac0980ffcef74 = function() { return logError(function (arg0) {
    const ret = clearTimeout(takeObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_setTimeout_7d81d052875b0f4f = function() { return handleError(function (arg0, arg1) {
    const ret = setTimeout(getObject(arg0), arg1);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_Window_cee7a886d55e7df5 = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_document_eb7fd66bde3ee213 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_location_b17760ac7977a47a = function() { return logError(function (arg0) {
    const ret = getObject(arg0).location;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_history_6882f83324841599 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).history;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_localStorage_3d538af21ea07fcc = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).localStorage;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_scrollTo_d3f0a8157bc0964a = function() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0).scrollTo(arg1, arg2);
}, arguments) };
imports.wbg.__wbg_get_8986951b1ee310e0 = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0)[v0];
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_fetch_33c84c2bf739f490 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_title_e3049d48b91d4e1c = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).title;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_createElement_03cf347ddad1c8c0 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createElement(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createElementNS_93f8de4acdef6da8 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    const ret = getObject(arg0).createElementNS(v0, v1);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createTextNode_ea32ad2506f7ae78 = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createTextNode(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getElementById_77f2dfdddee12e05 = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).getElementById(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_Element_813f33306edae612 = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_getAttribute_706ae88bd37410fa = function() { return logError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg1).getAttribute(v0);
    var ptr2 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len2;
    getInt32Memory0()[arg0 / 4 + 0] = ptr2;
}, arguments) };
imports.wbg.__wbg_getBoundingClientRect_3b6c47996a55427e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).getBoundingClientRect();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_scrollIntoView_b255e2d848e66b68 = function() { return logError(function (arg0, arg1) {
    getObject(arg0).scrollIntoView(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_toggleAttribute_82e117db0fd89148 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).toggleAttribute(v0);
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlElement_99861aeb7af981c2 = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_blur_3bef2a6e3b1f9734 = function() { return handleError(function (arg0) {
    getObject(arg0).blur();
}, arguments) };
imports.wbg.__wbg_focus_d1373017540aae66 = function() { return handleError(function (arg0) {
    getObject(arg0).focus();
}, arguments) };
imports.wbg.__wbg_instanceof_WorkerGlobalScope_42acbb685bed964e = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_fetch_10edd7d7da150227 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_type_cb363212bc519988 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_target_6795373f170fd786 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).target;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_preventDefault_657cbf753df1396c = function() { return logError(function (arg0) {
    getObject(arg0).preventDefault();
}, arguments) };
imports.wbg.__wbg_altKey_580c95fbc9461164 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).altKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_ctrlKey_032bd6905bacba55 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).ctrlKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_shiftKey_a84ea8856781bd54 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).shiftKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_metaKey_fe405998712e46a0 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).metaKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_location_357143f28d9f53f5 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).location;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_repeat_312cf65195ce4d62 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).repeat;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_key_0527970a852413ca = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).key;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_code_1213e4ccb9c7e5dc = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).code;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_altKey_7ed5692bb9b33f61 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).altKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_metaKey_f500322402501351 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).metaKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_ctrlKey_7ca7aada53e68cbb = function() { return logError(function (arg0) {
    const ret = getObject(arg0).ctrlKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_shiftKey_db83d139ede24518 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).shiftKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_propertyName_c5f4d299928404e7 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).propertyName;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_elapsedTime_c3c06c1450bfbbfa = function() { return logError(function (arg0) {
    const ret = getObject(arg0).elapsedTime;
    return ret;
}, arguments) };
imports.wbg.__wbg_pseudoElement_0286432ea71fd3d6 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).pseudoElement;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_width_faa64c8759fdff80 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).width;
    return ret;
}, arguments) };
imports.wbg.__wbg_height_bdf3f02c617ef055 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).height;
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlInputElement_189f182751dc1f5e = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_checked_30b85a12f3f06fd9 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).checked;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_files_bf2677e1b0984544 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).files;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_type_5044c6bd26d11744 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_value_99f5294791d62576 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).value;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_top_44a8c250dcea0251 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).top;
    return ret;
}, arguments) };
imports.wbg.__wbg_left_52377628791ffcf6 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).left;
    return ret;
}, arguments) };
imports.wbg.__wbg_name_9762a5bb951e00c1 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).name;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_instanceof_Response_b5451a06784a2404 = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_text_24a1c9b21feed3de = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).text();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_deltaX_5ddc4c69f2887db9 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaX;
    return ret;
}, arguments) };
imports.wbg.__wbg_deltaY_0ba2dcd707862292 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaY;
    return ret;
}, arguments) };
imports.wbg.__wbg_deltaZ_f5ece5ad21e77a4f = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaZ;
    return ret;
}, arguments) };
imports.wbg.__wbg_deltaMode_ed2d0b2e0a547b92 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaMode;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_new_4db22fd5d40c5665 = function() { return handleError(function () {
    const ret = new Headers();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_Node_1a1bb325e5134eec = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_parentElement_45a9756dc74ff48b = function() { return logError(function (arg0) {
    const ret = getObject(arg0).parentElement;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_textContent_528ff517a0418a3e = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).textContent;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_appendChild_4153ba1b5d54d73b = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).appendChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_storageArea_e141568c659bf5f4 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).storageArea;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_pageX_fcaa9023bb9e0279 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pageX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_pageY_0a01e9435bf46078 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pageY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_search_6b70a3bf2ceb3f63 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).search;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_setsearch_e3e6802fd5fe58c4 = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).search = v0;
}, arguments) };
imports.wbg.__wbg_new_79acf9a4da56c772 = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new URL(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_debug_a0de8bb323ed3e46 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.debug(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_error_b834525fe62708f5 = function() { return logError(function (arg0) {
    console.error(getObject(arg0));
}, arguments) };
imports.wbg.__wbg_error_621c11091f132493 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_info_0d0cfdd0035dc3f3 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.info(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_log_c957bb910fba09c1 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.log(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_warn_0912b6f3e9479355 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.warn(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_result_0a06634471fffc2d = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).result;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_setonload_37ef6198bfedb8ac = function() { return logError(function (arg0, arg1) {
    getObject(arg0).onload = getObject(arg1);
}, arguments) };
imports.wbg.__wbg_new_1401c89cd913546d = function() { return handleError(function () {
    const ret = new FileReader();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_readAsArrayBuffer_8656ba15dd0b0c0f = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).readAsArrayBuffer(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_readAsText_fa0e2bce8fba49af = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).readAsText(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlSelectElement_38dc60b1fb4f462e = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_value_371f7f7b58c2e0d3 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).value;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_animationName_4f8fa94a009d6f01 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).animationName;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_elapsedTime_a102931f88d14580 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).elapsedTime;
    return ret;
}, arguments) };
imports.wbg.__wbg_pseudoElement_15d1de48b4dfc49b = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).pseudoElement;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_length_29ed7aaf6bb5a432 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_item_37dc09373c5bda40 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).item(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlFormElement_03c5f1936c956219 = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_href_a5b902312c18d121 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg1).href;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_host_3f37d9558f3919b9 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg1).host;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_pointerId_d1b24da15cabd544 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pointerId;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_width_7ceb4528a6279b32 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).width;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_height_fb3b544361a256c0 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).height;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_pressure_30aa4e59e832d19d = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pressure;
    return ret;
}, arguments) };
imports.wbg.__wbg_tangentialPressure_d23884f8219d2b97 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).tangentialPressure;
    return ret;
}, arguments) };
imports.wbg.__wbg_tiltX_6e29efd2593c5114 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).tiltX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_tiltY_a633a81daa4edcfe = function() { return logError(function (arg0) {
    const ret = getObject(arg0).tiltY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_twist_b1b57595f63c850c = function() { return logError(function (arg0) {
    const ret = getObject(arg0).twist;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_pointerType_ac5318b142472092 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).pointerType;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_isPrimary_e6b792a4015b13dd = function() { return logError(function (arg0) {
    const ret = getObject(arg0).isPrimary;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_url_abf923e9619bea18 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).url;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_newwithstr_7a7cde4cfdb27ce4 = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Request(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_newwithstrandinit_11fbc38beb4c26b0 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Request(v0, getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_CompositionEvent_5ced7d3dabe7b653 = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_data_bb29dff4a6557791 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).data;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_pushState_01f73865f6d8789a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    var v1 = getCachedStringFromWasm0(arg4, arg5);
    getObject(arg0).pushState(getObject(arg1), v0, v1);
}, arguments) };
imports.wbg.__wbg_replaceState_05b49e34dd5c56f9 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    var v1 = getCachedStringFromWasm0(arg4, arg5);
    getObject(arg0).replaceState(getObject(arg1), v0, v1);
}, arguments) };
imports.wbg.__wbg_screenX_09af38cf1d075bdc = function() { return logError(function (arg0) {
    const ret = getObject(arg0).screenX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_screenY_ebd1a7b4788873cb = function() { return logError(function (arg0) {
    const ret = getObject(arg0).screenY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_clientX_2d1be024f35f3981 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).clientX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_clientY_967af1c2b0177a9f = function() { return logError(function (arg0) {
    const ret = getObject(arg0).clientY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_offsetX_423f959ec6ca2665 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).offsetX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_offsetY_6d993585185dc75a = function() { return logError(function (arg0) {
    const ret = getObject(arg0).offsetY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_ctrlKey_2817108375a63e7c = function() { return logError(function (arg0) {
    const ret = getObject(arg0).ctrlKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_shiftKey_87d2a9527cefdf3d = function() { return logError(function (arg0) {
    const ret = getObject(arg0).shiftKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_altKey_d4801ef04e1f1e33 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).altKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_metaKey_35f1fd33c4e0c5df = function() { return logError(function (arg0) {
    const ret = getObject(arg0).metaKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_button_43d11b000a7126cf = function() { return logError(function (arg0) {
    const ret = getObject(arg0).button;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_buttons_f87ec06cb30a9c13 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).buttons;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_getItem_5c179cd36e9529e8 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg1).getItem(v0);
    var ptr2 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len2;
    getInt32Memory0()[arg0 / 4 + 0] = ptr2;
}, arguments) };
imports.wbg.__wbg_setItem_7b55989efb4d45f7 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setItem(v0, v1);
}, arguments) };
imports.wbg.__wbg_addEventListener_bc4a7ad4cc72c6bf = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).addEventListener(v0, getObject(arg3), getObject(arg4));
}, arguments) };
imports.wbg.__wbg_removeEventListener_deae10c75ef836f8 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).removeEventListener(v0, getObject(arg3), arg4 !== 0);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlTextAreaElement_1897c40a53bffa72 = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_value_ffef403d62e3df58 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).value;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_new_a72fe5a17d68e2f8 = function() { return handleError(function () {
    const ret = new URLSearchParams();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_charCodeAt_dda38fa2b2e855eb = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).charCodeAt(arg1 >>> 0);
    return ret;
}, arguments) };
imports.wbg.__wbg_get_0ee8ea3c7c984c45 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_length_161c0d89c6535c1d = function() { return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_new_75208e29bddfd88c = function() { return logError(function () {
    const ret = new Array();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_newnoargs_cfecb3965268594c = function() { return logError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Function(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_d1cc518eff6805bb = function() { return logError(function () {
    const ret = new Map();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_next_586204376d2ed373 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).next;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_next_b2d3366343a208b3 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_done_90b14d6f6eacc42f = function() { return logError(function (arg0) {
    const ret = getObject(arg0).done;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_value_3158be908c80a75e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_iterator_40027cdd598da26b = function() { return logError(function () {
    const ret = Symbol.iterator;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_get_3fddfed2c83f434c = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_call_3f093dd26d5569f8 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_632630b5cec17f21 = function() { return logError(function () {
    const ret = new Object();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_length_ceaac4086e667d58 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_self_05040bd9523805b9 = function() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_window_adc720039f2cb14f = function() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_globalThis_622105db80c1457d = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_global_f56b013ed9bcf359 = function() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_eval_c824e170787ad184 = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = eval(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_set_79c308ecd9a1d091 = function() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
}, arguments) };
imports.wbg.__wbg_isArray_e783c41d0dd19b44 = function() { return logError(function (arg0) {
    const ret = Array.isArray(getObject(arg0));
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_ArrayBuffer_9221fa854ffb71b5 = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_instanceof_Error_5869c4f17aac9eb2 = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_message_2a19bb5b62cf8e22 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).message;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_name_405bb0aa047a1bf5 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).name;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_toString_07f01913ec9af122 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).toString();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_newwithargs_a6c3c567747cd30b = function() { return logError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var v1 = getCachedStringFromWasm0(arg2, arg3);
    const ret = new Function(v0, v1);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_call_67f2111acd2dfdb6 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_set_e4cfc2763115ffc7 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_entries_8d2edb6177b49770 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).entries();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_isSafeInteger_a23a66ee7c41b273 = function() { return logError(function (arg0) {
    const ret = Number.isSafeInteger(getObject(arg0));
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_getTime_0e03c3f524be31ef = function() { return logError(function (arg0) {
    const ret = getObject(arg0).getTime();
    return ret;
}, arguments) };
imports.wbg.__wbg_getTimezoneOffset_840b552f34917133 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).getTimezoneOffset();
    return ret;
}, arguments) };
imports.wbg.__wbg_new_a9d80688888b4894 = function() { return logError(function (arg0) {
    const ret = new Date(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new0_7a6141101f2206da = function() { return logError(function () {
    const ret = new Date();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_entries_488960b196cfb6a5 = function() { return logError(function (arg0) {
    const ret = Object.entries(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_is_bd5dc4ae269cba1c = function() { return logError(function (arg0, arg1) {
    const ret = Object.is(getObject(arg0), getObject(arg1));
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_toString_6eb7c1f755c00453 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).toString();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_exec_c6eab43c76cafa2f = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).exec(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_lastindex_b23d35c7bf5bd82f = function() { return logError(function (arg0) {
    const ret = getObject(arg0).lastIndex;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_new_d4c086f687604999 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var v1 = getCachedStringFromWasm0(arg2, arg3);
    const ret = new RegExp(v0, v1);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_resolve_5da6faf2c96fd1d5 = function() { return logError(function (arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_then_f9e58f5a50f43eae = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_then_20a5920e447d1cb1 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_buffer_b914fb8b50ebbc3e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_b1f2d6842d615181 = function() { return logError(function (arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_set_7d988c98e6ced92d = function() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
}, arguments) };
imports.wbg.__wbg_length_21c4b0ae73cba59d = function() { return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_Uint8Array_c299a4ee232e76ba = function() { return logError(function (arg0) {
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
imports.wbg.__wbg_stringify_865daa6fb8c83d5a = function() { return handleError(function (arg0) {
    const ret = JSON.stringify(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_set_961700853a212a39 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
    const v = getObject(arg1);
    const ret = typeof(v) === 'bigint' ? v : undefined;
    if (!isLikeNone(ret)) {
        _assertBigInt(ret);
    }
    getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper1649 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 974, __wbg_adapter_48);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper1650 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 974, __wbg_adapter_51);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper1651 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 974, __wbg_adapter_54);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper3362 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1910, __wbg_adapter_57);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper4615 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2653, __wbg_adapter_60);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper4720 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2711, __wbg_adapter_63);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper4899 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2805, __wbg_adapter_66);
    return addHeapObject(ret);
}, arguments) };
imports['./snippets/dioxus-interpreter-js-85a0a2f8acce2e86/inline0.js'] = __wbg_star0;

return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedBigInt64Memory0 = null;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;


    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
