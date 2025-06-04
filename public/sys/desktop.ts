import * as fs from "./mem/fs.ts";
import type { SysFile } from "./mem/fs.ts";
import { getMouseX, getMouseY } from "./input.ts";
import { elementPageScaler } from "@debutter/helper";
import EventEmitter from "eventemitter3";
import brokenImagePNG from "./img/broken-image.png";
import { ContextMenu } from "./gui.ts";
import { collection, html } from "@debutter/dough";
import { registry } from "./mem/reg.ts";

const desktopContent = document.getElementById("desktop-content");
if (!desktopContent) throw new Error("Failed to get desktop content element");

const canvas = document.getElementById("background") as HTMLCanvasElement;
if (!canvas) throw new Error("Failed to get background canvas element");

// Background
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Failed to get background canvas context");

let hue = 30;

setInterval(() => {
	const color = `oklch(0.6499 0.213 ${hue})`;
	hue = (hue + 0.03) % 360;

	ctx.fillStyle = color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}, 33.3333);

elementPageScaler(canvas);

// Check view settings
const viewReg = registry("sys:view");

let showExtensions = false;

if ((await viewReg.get("showExtensions")) === true) {
	showExtensions = true;
}

// Desktop
export class DesktopItem extends EventEmitter<{
	placed: () => void;
	open: () => void;
	contextmenu: (position: { x: number; y: number }) => void;
}> {
	private ele: HTMLDivElement;
	private iconEle: HTMLImageElement;
	private nameEle: HTMLDivElement;

	private file: SysFile;

	constructor(file: SysFile) {
		super();

		this.file = file;

		this.ele = document.createElement("div");
		this.ele.classList.add("desktop-item", "moveable", "hidden");

		this.iconEle = document.createElement("img");
		this.iconEle.classList.add("crisp", "no-drag", "icon");

		this.nameEle = <HTMLDivElement>html`<div class="filename">
			<span class="name white-text"></span>
			<span class="extension white-text"></span>
		</div>`;

		if (!showExtensions) {
			this.nameEle
				.querySelector<HTMLSpanElement>(".extension")!
				.classList.add("hidden");
		}

		this.ele.appendChild(this.iconEle);
		this.ele.appendChild(this.nameEle);

		// Add double click (open) listener
		this.ele.addEventListener("dblclick", () => {
			this.emit("open");
		});

		// Add context menu listener
		this.ele.addEventListener("contextmenu", (event: MouseEvent) => {
			event.preventDefault();

			this.emit("contextmenu", { x: event.clientX, y: event.clientY });
		});

		// Add drag handler
		this.ele.addEventListener("mousedown", ({ button }: MouseEvent) => {
			if (button !== 0) return;

			const bounds = this.ele.getBoundingClientRect();
			const offset = {
				x: getMouseX() - this.x,
				y: getMouseY() - this.y
			};

			const dragHandler = () => {
				if (!this.ele.classList.contains("moving"))
					this.ele.classList.add("moving");

				this.x = Math.max(
					0,
					Math.min(
						window.innerWidth - bounds.width,
						getMouseX() - offset.x
					)
				);
				this.y = Math.max(
					0,
					Math.min(
						window.innerHeight - bounds.height,
						getMouseY() - offset.y
					)
				);
			};

			const dragEndHandler = ({ button }: MouseEvent) => {
				if (button !== 0) return;

				window.removeEventListener("mousemove", dragHandler);
				window.removeEventListener("mouseup", dragEndHandler);

				this.ele.classList.remove("moving");

				for (const iframe of document.querySelectorAll("iframe")) {
					iframe.classList.remove("fix-drag");
				}

				this.emit("placed");
			};

			for (const iframe of document.querySelectorAll("iframe")) {
				iframe.classList.add("fix-drag");
			}
			window.addEventListener("mousemove", dragHandler);
			window.addEventListener("mouseup", dragEndHandler);
		});

		if (desktopContent) {
			desktopContent.appendChild(this.ele);
		}

		this.load();
	}

	private async load() {
		const meta = this.file.meta;

		const [src, x, y] = await Promise.all([
			meta.get("icon"),
			meta.get("x"),
			meta.get("y")
		]);

		this.icon = (src as string) ?? brokenImagePNG;
		this.name = this.file.path;
		this.x = (x as number) ?? 0;
		this.y = (y as number) ?? 0;

		this.ele.classList.remove("hidden");

		this.on("placed", async () => {
			await meta.update({ x: this.x, y: this.y });
		});
	}

	set icon(src: string) {
		this.iconEle.src = src;
	}
	get icon(): string {
		return this.iconEle.src || "";
	}

	set name(text: string) {
		const { base, ext } = fs.splitFilepath(text);

		// Set name
		this.nameEle.querySelector<HTMLSpanElement>(".name")!.innerText = base;

		// Set extension
		const extEle =
			this.nameEle.querySelector<HTMLSpanElement>(".extension")!;
		extEle.innerText = ext;
		extEle.setAttribute("data-ext", ext.substring(1));
	}
	get name(): string {
		let base =
			this.nameEle.querySelector<HTMLSpanElement>(".name")!.innerText;
		let ext =
			this.nameEle.querySelector<HTMLSpanElement>(
				".extension"
			)!.innerText;

		return base + ext;
	}

	set x(scalar: number) {
		this.ele.style.left = `${scalar}px`;
	}
	get x(): number {
		return this.ele.getBoundingClientRect().x;
	}

	set y(scalar: number) {
		this.ele.style.top = `${scalar}px`;
	}
	get y(): number {
		return this.ele.getBoundingClientRect().y;
	}
}

// Add context menu
const desktopMenu = new ContextMenu()
	.addOption(
		"Create New",
		new ContextMenu()
			.addOption("File", async (ctx) => {
				// Get available filename
				let files = Array.from(fs.ls("/home/desktop/"));
				let filename = "new file";

				if (files.includes(filename)) {
					let i = 1;

					while (files.includes(`${filename} (${i})`)) {
						i++;
					}

					filename += ` (${i})`;
				}

				// Save file to memory
				let file = fs.file("/home/desktop/" + filename);

				await file.set("nonsense");
				await file.meta.update({ x: ctx.x, y: ctx.y });

				// Create desktop item
				new DesktopItem(file);

				// Close context menu
				ctx.close();
			})
			.addOption("Folder")
	)
	.addOption("Toggle Extensions", () => {
		showExtensions = !showExtensions;

		viewReg.set("showExtensions", showExtensions);

		// Toggle extensions on all desktop items
		const $exts = collection(".desktop-item .extension");

		if (showExtensions) {
			$exts.removeClass("hidden");
		} else {
			$exts.addClass("hidden");
		}
	})
	.addOption("Refresh", () => location.reload());

canvas.addEventListener("contextmenu", (event: MouseEvent) => {
	event.preventDefault();

	desktopMenu.spawn(event.clientX, event.clientY);
});
