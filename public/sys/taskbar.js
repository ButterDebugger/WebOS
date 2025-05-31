import { html } from "@debutter/dough";
import brokenImagePNG from "./img/broken-image.png";

const taskbar = document.getElementById("taskbar");
const taskbarSpacer = taskbar.querySelector(".flex-spacer");

export class TaskbarItem {
	constructor(title = "Untitled item", iconSrc = brokenImagePNG) {
		this.ele = html`
            <button class="taskbar-item">
                <img class="icon crisp no-drag">
                <span class="title"></span>
            </button>
        `;

		this.title = title;
		this.icon = iconSrc;

		taskbar.insertBefore(this.ele, taskbarSpacer);
	}

	set bold(bool = !this.bold) {
		this.ele
			.querySelector(".title")
			.classList[bool ? "add" : "remove"]("bold-text");
	}
	get bold() {
		return this.ele.querySelector(".title").classList.contains("bold-text");
	}

	set active(bool = !this.active) {
		this.ele.classList[bool ? "add" : "remove"]("active");
	}
	get active() {
		return this.ele.classList.contains("active");
	}

	set title(text) {
		this.ele.querySelector(".title").innerText = text;
	}
	get title() {
		return this.ele.querySelector(".title").innerText;
	}

	set icon(src) {
		this.ele.querySelector(".icon").src = src;
	}
	get icon() {
		return this.ele.querySelector(".icon").src;
	}

	remove() {
		this.ele.remove();
	}
}
