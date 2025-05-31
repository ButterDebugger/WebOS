import keys from "https://debutter.dev/x/js/keys.js@1.1.0";
import { dom, collection } from "https://debutter.dev/x/js/dom.js@1.0.0?min";
import { randomInt, remapRange } from "https://debutter.dev/x/js/math.js";
import { TaskbarItem } from "./taskbar.js";
import system from "./system.js";
import brokenImagePNG from "./img/broken-image.png";

export default class Window {
	constructor(frameSrc) {
		this.ele = createWindowComponent(this, frameSrc);
		this.ele.window = this;

		this.taskbarItem = new TaskbarItem();
		this.taskbarItem.ele.addEventListener("click", () => {
			if (this.isMinimized()) this.minimize();

			this.focusHandler();
		});

		this.ele.addEventListener("mousedown", () => this.focusHandler());
		this.focusHandler();
		window.addEventListener("click", ({ target }) => {
			if (
				!this.ele.contains(target) &&
				!this.taskbarItem.ele.contains(target)
			) {
				this.unfocusHandler();
			}
		});

		this.width = this.minWidth = 400;
		this.height = this.minHeight = 300;

		this.x = randomInt(0, window.innerWidth - this.width);
		this.y = randomInt(0, window.innerHeight - this.height);
	}

	set icon(src) {
		this.ele.querySelector(".app-icon").src = src;
		this.taskbarItem.icon = src;
	}
	get icon() {
		return this.ele.querySelector(".app-icon").src;
	}

	set title(text) {
		this.ele.querySelector(".title").innerText = text;
		this.taskbarItem.title = text;
	}
	get title() {
		return this.ele.querySelector(".title").innerText;
	}

	set x(scalar) {
		this.ele.style.left = `${scalar}px`;
	}
	get x() {
		return this.ele.getBoundingClientRect().x;
	}

	set y(scalar) {
		this.ele.style.top = `${scalar}px`;
	}
	get y() {
		return this.ele.getBoundingClientRect().y;
	}

	set height(scalar) {
		this.ele.style.height = `${Math.max(this.minHeight, scalar)}px`;
	}
	get height() {
		return this.ele.getBoundingClientRect().height;
	}

	set width(scalar) {
		this.ele.style.width = `${Math.max(this.minWidth, scalar)}px`;
	}
	get width() {
		return this.ele.getBoundingClientRect().width;
	}

	focusHandler() {
		this.ele.style.zIndex = system.zIndex;
		this.ele.classList.remove("unfocused");
		this.taskbarItem.active = true;
		document.querySelectorAll(".window").forEach((win) => {
			if (win !== this.ele) win.window.unfocusHandler();
		});
	}
	unfocusHandler() {
		this.ele.classList.add("unfocused");
		this.taskbarItem.active = false;
	}

	isMinimized() {
		return this.ele.classList.contains("minimized");
	}
	minimize() {
		this.ele.classList.remove("maximized");
		this.ele.classList.toggle("minimized");
	}

	isMaximized() {
		return this.ele.classList.contains("maximized");
	}
	maximize() {
		this.ele.classList.remove("minimized");
		this.ele.classList.toggle("maximized");
	}

	close() {
		this.ele.remove();
		this.taskbarItem.remove();
	}
}

function createWindowComponent(win, frameSrc) {
	const $ele = dom(`
        <div class="window gray-container moveable">
            <div class="title-bar">
                <img class="app-icon crisp no-drag no-select" src="${brokenImagePNG}">
                <span class="title">Untitled Window</span>
                <div class="flex-spacer"></div>
                <button data-ungrabbable class="minimize-window crisp zero-padding"><div class="icon"></div></button>
                <button data-ungrabbable class="maximize-window crisp zero-padding"><div class="icon"></div></button>
                <button data-ungrabbable class="close-window crisp zero-padding"><div class="icon"></div></button>
            </div>
            <iframe class="frame gray-inset" src="${frameSrc}"></iframe>
        </div>
    `);

	// Add iframe focus event handlers
	setTimeout(() => {
		$ele.find("iframe").element.contentWindow.addEventListener("focus", () => {
			win.focusHandler();
		});
	}, 0);

	// Add button handlers
	$ele.find("button.minimize-window").on("click", () => win.minimize());
	$ele.find("button.maximize-window").on("click", () => win.maximize());
	$ele.find("button.close-window").on("click", () => win.close());

	// Add window resizers
	const resizers = {
		// vertical, invertVertical, horizontal, invertHorizontal
		n: [true, true, false, false],
		e: [false, false, true, false],
		s: [true, false, false, false],
		w: [false, false, true, true],
		ne: [true, true, true, false],
		se: [true, false, true, false],
		sw: [true, false, true, true],
		nw: [true, true, true, true],
	};

	for (const dir in resizers) {
		const $resizer = dom(`<div class="resizer-${dir}"></div>`);

		const {
			0: vertical,
			1: invertVertical,
			2: horizontal,
			3: invertHorizontal,
		} = resizers[dir];

		$resizer.on("mousedown", () => {
			const offset = {
				x: keys["MouseX"],
				y: keys["MouseY"],
			};
			const initLeft = win.x + win.width - win.minWidth;
			const initTop = win.y + win.height - win.minHeight;

			const dragHandler = () => {
				if (horizontal) {
					// Calculate the x range of where the user can resize
					const minLeft = invertHorizontal ? 0 : win.x + win.minWidth;
					const maxLeft = invertHorizontal ? initLeft : window.innerWidth;

					// Calculate the mouse position difference
					const diff =
						Math.max(minLeft, Math.min(maxLeft, keys["MouseX"])) -
						Math.max(minLeft, Math.min(maxLeft, offset.x));

					// Update the width and or x position of the window
					if (invertHorizontal) {
						win.width -= diff;
						win.x += diff;
					} else {
						win.width += diff;
					}
				}
				if (vertical) {
					// Calculate the y range of where the user can resize
					const minTop = invertVertical ? 0 : win.y + win.minHeight;
					const maxTop = invertVertical ? initTop : window.innerHeight;

					// Calculate the mouse position difference
					const diff =
						Math.max(minTop, Math.min(maxTop, keys["MouseY"])) -
						Math.max(minTop, Math.min(maxTop, offset.y));

					// Update the height and or y position of the window
					if (invertVertical) {
						win.height -= diff;
						win.y += diff;
					} else {
						win.height += diff;
					}
				}

				offset.x = keys["MouseX"];
				offset.y = keys["MouseY"];
			};

			collection("iframe").addClass("fix-drag");
			window.addEventListener("mousemove", dragHandler);

			window.addEventListener(
				"mouseup",
				() => {
					window.removeEventListener("mousemove", dragHandler);
					collection("iframe").removeClass("fix-drag");
				},
				{
					once: true,
				},
			);
		});

		$ele.append($resizer);
	}

	// Add window drag event handlers
	const $titleBar = $ele.find(".title-bar");

	$titleBar.on("mousedown", ({ target }) => {
		if (target.hasAttribute("data-ungrabbable")) return;

		let relX;
		let relY;

		if (win.isMaximized()) {
			const beforeWidth = win.width;
			win.maximize();
			relX = remapRange(keys["MouseX"], 0, beforeWidth, 0, win.width, true);
			relY = keys["MouseY"];
			win.maximize();
		}

		const offset = {
			x: relX ?? keys["MouseX"] - win.x,
			y: relY ?? keys["MouseY"] - win.y,
		};

		const dragHandler = () => {
			if (win.isMaximized()) {
				win.maximize();
			}

			if (!win.ele.classList.contains("moving"))
				win.ele.classList.add("moving");

			win.x = Math.max(
				0,
				Math.min(window.innerWidth - win.width, keys["MouseX"] - offset.x),
			);
			win.y = Math.max(
				0,
				Math.min(window.innerHeight - win.height, keys["MouseY"] - offset.y),
			);
		};

		collection("iframe").addClass("fix-drag");
		window.addEventListener("mousemove", dragHandler);

		window.addEventListener(
			"mouseup",
			() => {
				window.removeEventListener("mousemove", dragHandler);
				$ele.removeClass("moving");
				collection("iframe").removeClass("fix-drag");
			},
			{
				once: true,
			},
		);
	});

	dom("body").append($ele);
	return $ele.element;
}
