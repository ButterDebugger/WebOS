import keys from "https://debutter.dev/x/js/keys.js@1.1.0";
import { dom, collection, html } from "@debutter/dough";
import { randomInt, remapRange } from "https://debutter.dev/x/js/math.js";
import { TaskbarItem } from "./taskbar.ts";
import system from "./system.ts";
import brokenImagePNG from "./img/broken-image.png";

interface WindowElement extends HTMLElement {
	window: Window;
}

export default class Window {
	public ele: WindowElement;
	public taskbarItem: TaskbarItem;
	public minWidth: number;
	public minHeight: number;

	private iconEle: HTMLImageElement;
	private titleEle: HTMLSpanElement;

	constructor(frameSrc: string) {
		this.ele = createWindowComponent(this, frameSrc);
		this.ele.window = this;

		// biome-ignore lint/style/noNonNullAssertion: It is defined
		this.iconEle = this.ele.querySelector<HTMLImageElement>(".app-icon")!;
		// biome-ignore lint/style/noNonNullAssertion: It is defined
		this.titleEle = this.ele.querySelector<HTMLElement>(".title")!;

		this.taskbarItem = new TaskbarItem();
		this.taskbarItem.ele.addEventListener("click", () => {
			if (this.isMinimized()) this.minimize();

			this.focusHandler();
		});

		this.ele.addEventListener("mousedown", () => this.focusHandler());
		this.focusHandler();
		window.addEventListener("click", ({ target }: MouseEvent) => {
			if (
				!this.ele.contains(target as Element) &&
				!this.taskbarItem.ele.contains(target as Element)
			) {
				this.unfocusHandler();
			}
		});

		this.width = this.minWidth = 400;
		this.height = this.minHeight = 300;

		this.x = randomInt(0, window.innerWidth - this.width);
		this.y = randomInt(0, window.innerHeight - this.height);
	}

	set icon(src: string) {
		this.iconEle.src = src;
		this.taskbarItem.icon = src;
	}
	get icon(): string {
		return this.iconEle.src || "";
	}

	set title(text: string) {
		this.titleEle.innerText = text;
		this.taskbarItem.title = text;
	}
	get title(): string {
		return this.titleEle.innerText || "";
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

	set height(scalar: number) {
		this.ele.style.height = `${Math.max(this.minHeight, scalar)}px`;
	}
	get height(): number {
		return this.ele.getBoundingClientRect().height;
	}

	set width(scalar: number) {
		this.ele.style.width = `${Math.max(this.minWidth, scalar)}px`;
	}
	get width(): number {
		return this.ele.getBoundingClientRect().width;
	}

	focusHandler(): void {
		this.ele.style.zIndex = String(system.zIndex);
		this.ele.classList.remove("unfocused");
		this.taskbarItem.active = true;

		for (const win of document.querySelectorAll(".window")) {
			if (win !== this.ele) {
				(win as WindowElement).window.unfocusHandler();
			}
		}
	}
	unfocusHandler(): void {
		this.ele.classList.add("unfocused");
		this.taskbarItem.active = false;
	}

	isMinimized(): boolean {
		return this.ele.classList.contains("minimized");
	}
	minimize(): void {
		this.ele.classList.remove("maximized");
		this.ele.classList.toggle("minimized");
	}

	isMaximized(): boolean {
		return this.ele.classList.contains("maximized");
	}
	maximize(): void {
		this.ele.classList.remove("minimized");
		this.ele.classList.toggle("maximized");
	}

	close(): void {
		this.ele.remove();
		this.taskbarItem.remove();
	}
}

function createWindowComponent(win: Window, frameSrc: string): WindowElement {
	const $ele = dom(html`
		<div class="window gray-container moveable">
			<div class="title-bar">
				<img
					class="app-icon crisp no-drag no-select"
					src="${brokenImagePNG}"
				/>
				<span class="title">Untitled Window</span>
				<div class="flex-spacer"></div>
				<button
					data-ungrabbable
					class="minimize-window crisp zero-padding"
				>
					<div class="icon"></div>
				</button>
				<button
					data-ungrabbable
					class="maximize-window crisp zero-padding"
				>
					<div class="icon"></div>
				</button>
				<button
					data-ungrabbable
					class="close-window crisp zero-padding"
				>
					<div class="icon"></div>
				</button>
			</div>
			<iframe class="frame gray-inset" src="${frameSrc}"></iframe>
		</div>
	`);

	// Add iframe focus event handlers
	setTimeout(() => {
		$ele.find("iframe").element.contentWindow.addEventListener(
			"focus",
			() => {
				win.focusHandler();
			}
		);
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
		nw: [true, true, true, true]
	};

	for (const dir in resizers) {
		const $resizer = dom(html`<div class="resizer-${dir}"></div>`);

		const {
			0: vertical,
			1: invertVertical,
			2: horizontal,
			3: invertHorizontal
		} = resizers[dir];

		$resizer.on("mousedown", () => {
			const offset = {
				x: keys["MouseX"],
				y: keys["MouseY"]
			};
			const initLeft = win.x + win.width - win.minWidth;
			const initTop = win.y + win.height - win.minHeight;

			const dragHandler = () => {
				if (horizontal) {
					// Calculate the x range of where the user can resize
					const minLeft = invertHorizontal ? 0 : win.x + win.minWidth;
					const maxLeft = invertHorizontal
						? initLeft
						: window.innerWidth;

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
					const maxTop = invertVertical
						? initTop
						: window.innerHeight;

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
					once: true
				}
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
			relX = remapRange(
				keys["MouseX"],
				0,
				beforeWidth,
				0,
				win.width,
				true
			);
			relY = keys["MouseY"];
			win.maximize();
		}

		const offset = {
			x: relX ?? keys["MouseX"] - win.x,
			y: relY ?? keys["MouseY"] - win.y
		};

		const dragHandler = () => {
			if (win.isMaximized()) {
				win.maximize();
			}

			if (!win.ele.classList.contains("moving"))
				win.ele.classList.add("moving");

			win.x = Math.max(
				0,
				Math.min(
					window.innerWidth - win.width,
					keys["MouseX"] - offset.x
				)
			);
			win.y = Math.max(
				0,
				Math.min(
					window.innerHeight - win.height,
					keys["MouseY"] - offset.y
				)
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
				once: true
			}
		);
	});

	dom("body").append($ele);
	return $ele.element as WindowElement;
}
