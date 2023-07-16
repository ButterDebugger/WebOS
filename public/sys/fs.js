import localforage from "https://cdn.jsdelivr.net/npm/localforage@1.10.0/+esm";
import * as JSBin from "https://butterycode.com/static/js/jsbin.js";

export async function set(key, value, encode = true) {
    // Try encoding the value
    if (encode) {
        try {
            value = await JSBin.encode(value);
        } catch (err) {}
    }

    // Save the item
    try {
        await localforage.setItem(key, value);
    } catch (err) {
        console.error(err);
        return false;
    }
    return true;
}

export async function get(key) {
    let value = await localforage.getItem(key);

    // Try decoding the value
    if (typeof value == "string") {
        try {
            value = await JSBin.decode(value);
        } catch (err) {}
    }

    return value;
}

export async function remove(key) {
    try {
        await localforage.removeItem(key);
    } catch (err) {
        console.error(err);
        return false;
    }
    return true;
}

export async function clear() {
    try {
        await localforage.clear();
    } catch (err) {
        console.error(err);
        return false;
    }
    return true;
}

export async function length() {
    try {
        return await localforage.length();
    } catch (err) {
        console.error(err);
        return -1;
    }
}

export async function key(index) {
    try {
        return await localforage.key(index);
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function keys() {
    try {
        return await localforage.keys();
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function* iterate() {
    try {
        for (let key of await localforage.keys()) {
            yield await get(key);
        }
    } catch (err) {
        console.error(err);
        return;
    }
}
