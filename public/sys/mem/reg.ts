import * as storage from "./storage.ts";

const registries = new Map<string, SysRegistry>();

export class SysRegistry {
	#location: string;

	constructor(location: string) {
		this.#location = location;
	}

	get location(): string {
		return this.#location;
	}

	async get(key: string): Promise<unknown> {
		const table = await this.table();

		return (table as Record<string, unknown>)[key];
	}

	async set(key: string, value: unknown): Promise<unknown> {
		const table = await this.table();

		(table as Record<string, unknown>)[key] = value;

		return await storage.set(this.#location, table);
	}

	async update(table: Record<string, unknown>): Promise<boolean> {
		const currentTable = await this.table();

		const newTable = { ...currentTable, ...table };

		return await storage.set(this.#location, newTable);
	}

	async remove(key: string): Promise<unknown> {
		const table = await this.table();

		delete (table as Record<string, unknown>)[key];

		return await storage.set(this.#location, table);
	}

	async table(): Promise<Record<string, unknown>> {
		return (
			((await storage.get(this.#location)) as Record<string, unknown>) ??
			{}
		);
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
