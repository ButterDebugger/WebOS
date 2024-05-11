import * as binforage from "https://debutter.dev/x/js/binforage.js";

// File system methods
const files = new Map();

class SysFile {
    #path;

    constructor(path) {
        this.#path = "file:" + path;
    }

    get path() {
        return this.#path.substring(5);
    }

    get meta() {
        return registry(this.#path);
    }

    async get() {
        return await binforage.get(this.#path);
    }

    async set(value) {
        return await binforage.set(this.#path, value);
    }

    async remove() {
        return await binforage.remove(this.#path);
    }
}

export function file(path) {
    if (!files.has(path)) {
        files.set(path, new SysFile(path));
    }

    return files.get(path);
}

// Registry methods
const registries = new Map();

class SysRegistry {
    #location;
    #cache;

    constructor(location) {
        this.#location = "registry:" + location;
        this.#cache = null;
    }

    get location() {
        return this.#location.substring(9);
    }

    async get(key) {
        if (!(this.#cache instanceof Object)) {
            this.#cache = await binforage.get(this.#location) ?? {};
        }

        return this.#cache[key];
    }

    async set(key, value) {
        if (!(this.#cache instanceof Object)) {
            this.#cache = await binforage.get(this.#location) ?? {};
        }

        this.#cache[key] = value;

        return await binforage.set(this.#location, this.#cache);
    }

    async remove(key) {
        if (!(this.#cache instanceof Object)) {
            this.#cache = await binforage.get(this.#location) ?? {};
        }

        delete this.#cache[key];

        return await binforage.set(this.#location, this.#cache);
    }
}

export function registry(location) {
    if (!registries.has(location)) {
        registries.set(location, new SysRegistry(location));
    }

    return registries.get(location);
}
