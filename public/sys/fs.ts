import * as binforage from "https://debutter.dev/x/js/binforage.js";

// File system methods
const files = new Map<string, SysFile>();

class SysFile {
	#path: string;

	constructor(path: string) {
		this.#path = path;
	}

	get path(): string {
		return this.#path;
	}

	get meta(): SysRegistry {
		return registry(`meta:${this.#path}`);
	}

	async get(): Promise<unknown> {
		return await binforage.get(this.#path);
	}

	async set(value: unknown): Promise<unknown> {
		return await binforage.set(this.#path, value);
	}

	async remove(): Promise<unknown> {
		return await binforage.remove(this.#path);
	}
}

export function file(path: string): SysFile {
	if (!isValidFilePath(path)) throw new Error("Invalid file path.");

	let fileInstance = files.get(path);

	if (!fileInstance) {
		fileInstance = new SysFile(path);
		files.set(path, fileInstance);
	}

	return fileInstance;
}

export function isValidFilePath(location: string): boolean {
	return location.startsWith("/");
}

export function* ls(path: string): Generator<string> {
	if (!isValidFilePath(path)) throw new Error("Invalid file path.");

	for (const filePath of files.keys()) {
		if (filePath.startsWith(path)) {
			yield filePath.substring(path.length);
		}
	}
}

// Registry methods
const registries = new Map<string, SysRegistry>();

class SysRegistry {
	#location: string;

	constructor(location: string) {
		this.#location = location;
	}

	get location(): string {
		return this.#location;
	}

	async get(key: string): Promise<unknown> {
		const table = (await binforage.get(this.#location)) ?? {};

		return (table as Record<string, unknown>)[key];
	}

	async set(key: string, value: unknown): Promise<unknown> {
		const table = (await binforage.get(this.#location)) ?? {};

		(table as Record<string, unknown>)[key] = value;

		return await binforage.set(this.#location, table);
	}

	async remove(key: string): Promise<unknown> {
		const table = (await binforage.get(this.#location)) ?? {};

		delete (table as Record<string, unknown>)[key];

		return await binforage.set(this.#location, table);
	}
}

export function registry(location: string): SysRegistry {
	if (!isValidRegistryLocation(location))
		throw new Error("Invalid registry location.");

	let registryInstance = registries.get(location);

	if (!registryInstance) {
		registryInstance = new SysRegistry(location);
		registries.set(location, registryInstance);
	}

	return registryInstance;
}

export function isValidRegistryLocation(location: string): boolean {
	return /^\w+:/.test(location);
}

// Load all keys
for (const e of await binforage.keys()) {
	if (isValidFilePath(e)) {
		file(e);
	} else if (isValidRegistryLocation(e)) {
		registry(e);
	}
}
