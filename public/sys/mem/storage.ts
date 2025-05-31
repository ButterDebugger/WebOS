import localforage from "localforage";
import { encode, decode } from "@debutter/jsbin";
import { fromUint8Array, toUint8Array } from "@debutter/helper";

export async function set(key: string, value: unknown) {
	try {
		// Try encoding the value
		const encodedValue = fromUint8Array(encode(value));

		// Save the item
		await localforage.setItem(key, encodedValue);
	} catch (err) {
		console.error(err);
		return false;
	}
	return true;
}

export async function get(key: string) {
	try {
		// Retrieve the data
		const value = await localforage.getItem(key);
		if (typeof value !== "string") return null;

		// Return the decoded value
		return decode(toUint8Array(value));
	} catch (err) {
		console.error(err);
	}

	return null;
}

export async function remove(key: string) {
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

export async function key(index: number) {
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
		for (const key of await localforage.keys()) {
			yield await get(key);
		}
	} catch (err) {
		console.error(err);
		return;
	}
}
