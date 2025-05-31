import * as fs from "./mem/fs.ts";
import { getMouseX, getMouseY } from "./input.ts";
import { elementPageScaler } from "@debutter/helper";
import eventemitter3 from "eventemitter3";
import moment from "moment";
import brokenImagePNG from "./img/broken-image.png";

const desktopContent = document.getElementById("desktop-content");
if (!desktopContent) throw new Error("Failed to get desktop content element");

const canvas = document.getElementById("background") as HTMLCanvasElement;
if (!canvas) throw new Error("Failed to get background canvas element");

const calendarContainer = document.getElementById("notifs-container");
if (!calendarContainer)
	throw new Error("Failed to get calendar container element");

const timeEle = calendarContainer.querySelector<HTMLSpanElement>(".time");
if (!timeEle) throw new Error("Failed to get time element");

// Background
const ctx = canvas?.getContext("2d");
if (!ctx) throw new Error("Failed to get background canvas context");

let hue = 0;

setInterval(() => {
	const color = `hsl(${hue}, 75%, 50%)`;
	hue = (hue + 0.03) % 360;

	ctx.fillStyle = color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}, 33.3333);

elementPageScaler(canvas);

// Calendar
function updateDates(): void {
	// @ts-ignore: timeEle has been asserted to be defined
	timeEle.innerText = moment().format("h:mm A");
}

updateDates();

export const timeInterval = setInterval(updateDates, 100);

// Desktop
export class DesktopItem extends eventemitter3 {
	public ele: HTMLDivElement;

	private iconEle: HTMLImageElement;
	private titleEle: HTMLSpanElement;

	constructor(src: string, title: string, x = 9, y = 9) {
		super();

		this.ele = document.createElement("div");
		this.ele.classList.add("desktop-item", "moveable");
		this.ele.style.left = `${x}px`;
		this.ele.style.top = `${y}px`;

		this.iconEle = document.createElement("img");
		this.iconEle.classList.add("crisp", "no-drag", "icon");
		this.iconEle.src = src;

		this.titleEle = document.createElement("span");
		this.titleEle.classList.add("title", "white-text");
		this.titleEle.innerText = title;

		this.ele.appendChild(this.iconEle);
		this.ele.appendChild(this.titleEle);

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
	}

	set icon(src: string) {
		this.iconEle.src = src;
	}
	get icon(): string {
		return this.iconEle.src || "";
	}

	set title(text: string) {
		this.titleEle.innerText = text;
	}
	get title(): string {
		return this.titleEle.innerText || "";
	}

	set x(scalar: number) {
		this.ele.style.left = `${scalar}px`;

		this.emit("move");
	}
	get x(): number {
		return this.ele.getBoundingClientRect().x;
	}

	set y(scalar: number) {
		this.ele.style.top = `${scalar}px`;

		this.emit("move");
	}
	get y(): number {
		return this.ele.getBoundingClientRect().y;
	}
}

// Load desktop content from memory
fs.file("/home/desktop/broken file").set("nonsense");

for await (const filePath of fs.ls("/home/desktop/")) {
	const itemMeta = fs.file(`/home/desktop/${filePath}`).meta;

	const fileName = filePath.split("/").pop() || "unknown";
	const item = new DesktopItem(brokenImagePNG, fileName);

	item.x = ((await itemMeta.get("x")) as number) ?? 0;
	item.y = ((await itemMeta.get("y")) as number) ?? 0;

	item.on("move", async () => {
		await itemMeta.set("x", item.x);
		await itemMeta.set("y", item.y);
	});
}
