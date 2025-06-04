import { registry, type SysRegistry } from "./reg.ts";
import * as storage from "./storage.ts";

// File system methods
const files = new Map<string, SysFile>();

export class SysFile {
	#path: string;
	#cache: unknown | null;

	constructor(path: string) {
		this.#path = path;
		this.#cache = null;
	}

	get path(): string {
		return this.#path;
	}

	get meta(): SysRegistry {
		return registry(`meta:${this.#path}`);
	}

	async get(): Promise<unknown> {
		if (this.#cache) return this.#cache;

		const value = await storage.get(this.#path);
		this.#cache = value;

		return value;
	}

	async set(value: unknown): Promise<boolean> {
		const success = await storage.set(this.#path, value);

		if (success) this.#cache = value;

		return success;
	}

	async remove(): Promise<boolean> {
		const success = await storage.remove(this.#path);

		if (success) this.#cache = null;

		return success;
	}

	async exists(): Promise<boolean> {
		return (await storage.get(this.#path)) !== null;
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

export function splitFilepath(filepath: string): {
	container: string;
	base: string;
	ext: string;
} {
	// Get containing folder and filename
	let container = "";
	let filename = filepath;

	const slashIndex = filepath.lastIndexOf("/");
	if (slashIndex !== -1) {
		container = filepath.substring(0, slashIndex);
		filename = filepath.substring(slashIndex + 1);
	}

	// Get index of last period
	let dotIndex = filename.lastIndexOf(".");
	if (dotIndex === -1) dotIndex = filename.length;

	// Split name and extension
	const base = filename.substring(0, dotIndex);
	const ext = filename.substring(dotIndex);

	return { container, base, ext };
}

export function* ls(path: string): Generator<string> {
	if (!isValidFilePath(path)) throw new Error("Invalid file path.");

	for (const filePath of files.keys()) {
		if (filePath.startsWith(path)) {
			yield filePath.substring(path.length);
		}
	}
}
