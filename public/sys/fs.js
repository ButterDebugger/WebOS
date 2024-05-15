import * as binforage from "https://debutter.dev/x/js/binforage.js";

// File system methods
const files = new Map();

class SysFile {
    #path;

    constructor(path) {
        this.#path = path;
    }

    get path() {
        return this.#path;
    }

    get meta() {
        return registry(`meta:${this.#path}`);
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
    if (!isValidFilePath(path)) throw new Error("Invalid file path.");

    if (!files.has(path)) {
        files.set(path, new SysFile(path));
    }

    return files.get(path);
}

export function isValidFilePath(location) {
    return location.startsWith("/");
}

export function* ls(path) {
    if (!isValidFilePath(path)) throw new Error("Invalid file path.");

    for (let filePath of files.keys()) {
        if (filePath.startsWith(path)) {
            yield filePath.substring(path.length);
        }
    }
}

// Registry methods
const registries = new Map();

class SysRegistry {
    #location;
    #cache;

    constructor(location) {
        this.#location = location;
        this.#cache = null;
    }

    get location() {
        return this.#location;
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
    if (!isValidRegistryLocation(location)) throw new Error("Invalid registry location.");

    if (!registries.has(location)) {
        registries.set(location, new SysRegistry(location));
    }

    return registries.get(location);
}

export function isValidRegistryLocation(location) {
    return /^\w+:/.test(location);
}

// Load all keys
for (let e of await binforage.keys()) {
    if (isValidFilePath(e)) {
        file(e);
    } else if (isValidRegistryLocation(e)) {
        registry(e);
    }
}
