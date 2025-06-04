import EventEmitter from "eventemitter3";
import moment from "moment";
import brokenImagePNG from "./img/broken-image.png";
import computerPNG from "./img/computer.png";

const taskbar = document.getElementById("taskbar");
const taskbarSpacer = taskbar?.querySelector(".flex-spacer");

export class TaskbarItem extends EventEmitter<{
	click: () => void;
}> {
	private ele: HTMLButtonElement;
	private iconEle: HTMLImageElement;
	private titleEle: HTMLSpanElement;

	constructor(title = "Untitled item", iconSrc = brokenImagePNG) {
		super();

		this.ele = document.createElement("button");
		this.ele.classList.add("taskbar-item");

		this.ele.addEventListener("click", () => {
			this.emit("click");
		});

		this.iconEle = document.createElement("img");
		this.iconEle.classList.add("icon", "crisp", "no-drag");
		this.iconEle.src = iconSrc;
		this.ele.appendChild(this.iconEle);

		this.titleEle = document.createElement("span");
		this.titleEle.classList.add("title");
		this.titleEle.innerText = title;
		this.ele.appendChild(this.titleEle);

		if (taskbar && taskbarSpacer) {
			taskbar.insertBefore(this.ele, taskbarSpacer);
		}
	}

	get element(): HTMLButtonElement {
		return this.ele;
	}

	set bold(bool: boolean) {
		this.titleEle.classList[bool ? "add" : "remove"]("bold-text");
	}
	get bold(): boolean {
		return this.titleEle.classList.contains("bold-text") || false;
	}

	set active(bool: boolean) {
		this.ele.classList[bool ? "add" : "remove"]("active");
	}
	get active(): boolean {
		return this.ele.classList.contains("active");
	}

	set title(text: string) {
		this.titleEle.innerText = text;
	}
	get title(): string {
		return this.titleEle.innerText || "";
	}

	set icon(src: string) {
		this.iconEle.src = src;
	}
	get icon(): string {
		return this.iconEle.src || "";
	}

	remove(): void {
		this.ele.remove();
	}
}

// Calendar
const calendarContainer = document.getElementById("notifs-container");
if (!calendarContainer)
	throw new Error("Failed to get calendar container element");

const timeEle = calendarContainer.querySelector<HTMLSpanElement>(".time");
if (!timeEle) throw new Error("Failed to get time element");

function updateDates(): void {
	// @ts-ignore: timeEle has been asserted to be defined
	timeEle.innerText = moment().format("h:mm A");
}

updateDates();

export const timeInterval = setInterval(updateDates, 100);

// Start button
const startBtn = new TaskbarItem("Start", computerPNG);
startBtn.bold = true;
