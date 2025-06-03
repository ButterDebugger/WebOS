import { $, html, isChildOf } from "@debutter/dough";

export class ContextMenu {
	public ele: HTMLDivElement;
	public parent: ContextMenu | null;
	public subnet: Set<ContextMenu>;

	constructor() {
		this.ele = html<HTMLDivElement>`<div
			class="context-menu gray-container"
		></div>`;
		this.parent = null;
		this.subnet = new Set();

		window.addEventListener("click", ({ target }: MouseEvent) => {
			// Do not check if this context menu is the child of another
			if (this.parent) return;

			// Check if the clicked element if the child of this context menu
			let isChild = false;

			for (const menu of flattenSubnet(this)) {
				if (target && isChildOf(target as Element, menu.ele)) {
					isChild = true;
				}
			}

			if (!isChild) this.close();
		});
	}

	spawn(x = 0, y = 0): void {
		this.x = x;
		this.y = y;

		document.body.appendChild(this.ele);
	}

	close(): void {
		for (const menu of this.subnet) {
			menu.close();
		}

		this.ele.remove();
	}

	addOption(
		name: string,
		action:
			| ContextMenu
			| ((menu: ContextMenu, event: MouseEvent) => void)
			| ((menu: ContextMenu, event: MouseEvent) => Promise<void>)
			| null = null
	): this {
		const $option = $(html<HTMLDivElement>`<div class="option"></div>`);

		$option.text(name);

		if (action instanceof ContextMenu) {
			this.subnet.add(action);
			action.parent = this;
		} else if (typeof action === "function") {
			$option.on("click", (event) => action(this.root, event));
		}

		$option.on("mouseover", () => {
			for (const menu of this.subnet) {
				menu.close();
			}

			if (action instanceof ContextMenu) {
				const bounds = $option.element.getBoundingClientRect();

				action.spawn(bounds.x + bounds.width, bounds.y);
			}
		});

		$option.on("mouseout", ({ relatedTarget }: MouseEvent) => {
			if (action instanceof ContextMenu) {
				if (
					relatedTarget &&
					(isChildOf(relatedTarget as Element, action.ele) ||
						relatedTarget === action.ele)
				)
					return;

				action.close();
			}
		});

		this.ele.appendChild($option.element);
		return this;
	}

	addDivider(): this {
		const divider = html`<div class="divider"></div>`;

		this.ele.appendChild(divider);
		return this;
	}

	get root(): ContextMenu | this {
		let root: ContextMenu = this;

		while (root.parent) {
			root = root.parent;
		}

		return root;
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

function flattenSubnet(menu: ContextMenu): Set<ContextMenu> {
	const list = new Set<ContextMenu>();
	list.add(menu);

	for (const submenu of menu.subnet) {
		for (const entry of flattenSubnet(submenu)) {
			list.add(entry);
		}
	}

	return list;
}
