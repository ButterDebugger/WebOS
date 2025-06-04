import { DesktopItem } from "../desktop.ts";
import { file, isValidFilePath, ls } from "./fs.ts";
import { isValidRegistryLocation, registry } from "./reg.ts";
import { keys } from "./storage.ts";
import computerPNG from "../img/computer.png";

export async function load() {
	// Load all keys from local storage
	await loadKeys();

	// Run initial setup if this is the first time loading
	const loaderReg = registry("sys:loader");

	if ((await loaderReg.get("initial")) !== true) {
		await loaderReg.set("initial", true);

		await initialSetup();
	}

	// Load desktop content from memory
	await loadDesktop();
}

async function loadKeys() {
	for (const e of await keys()) {
		if (isValidFilePath(e)) {
			file(e);
		} else if (isValidRegistryLocation(e)) {
			registry(e);
		}
	}
}

async function loadDesktop() {
	for await (const filePath of ls("/home/desktop/")) {
		new DesktopItem(file(`/home/desktop/${filePath}`));
	}
}

async function initialSetup() {
	// Create default desktop items
	await file("/home/desktop/broken file.txt").set("nonsense");
	await file("/home/desktop/broken file.txt").meta.update({
		x: 90,
		y: 9
	});

	await file("/home/desktop/Random Window").set("nonsense");
	await file("/home/desktop/Random Window").meta.update({
		icon: computerPNG,
		x: 9,
		y: 9
	});
}
