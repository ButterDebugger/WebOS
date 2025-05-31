// Declare variables
const keys: Record<string, boolean | undefined> = {};
const state = {
	focused: false
};
const mouse = {
	x: 0,
	y: 0,
	button: 0,
	over: false,
	pressed: false
};

// Declare keyboard methods
export function isKeyPressed(key: string): boolean {
	return keys[key] ?? false;
}

// Declare window methods
export function isWindowFocused(): boolean {
	return state.focused;
}

export function isWindowBlurred(): boolean {
	return !state.focused;
}

// Declare mouse methods
export function getMouseX(): number {
	return mouse.x;
}

export function getMouseY(): number {
	return mouse.y;
}

export function getMouseButton(): number {
	return mouse.button;
}

export function isMouseOver(): boolean {
	return mouse.over;
}

export function isMouseOut(): boolean {
	return !mouse.over;
}

export function isMousePressed(): boolean {
	return mouse.pressed;
}

// Register listeners
window.addEventListener("focus", () => {
	state.focused = true;
});
window.addEventListener("blur", () => {
	state.focused = false;

	for (var key in keys) {
		keys[key] = false;
	}
});
window.addEventListener("keydown", ({ key, code }: KeyboardEvent) => {
	switch (key) {
		case "Shift":
			keys["Shift"] = true;
			break;
		case "Control":
			keys["Control"] = true;
			break;
		case "Alt":
			keys["Alt"] = true;
			break;
	}
	keys[code] = true;
});
window.addEventListener("keyup", ({ key, code }: KeyboardEvent) => {
	switch (key) {
		case "Shift":
			keys["Shift"] = false;
			break;
		case "Control":
			keys["Control"] = false;
			break;
		case "Alt":
			keys["Alt"] = false;
			break;
	}
	keys[code] = false;
});
window.addEventListener("mousemove", ({ pageX, pageY }: MouseEvent) => {
	mouse.x = pageX;
	mouse.y = pageY;
});
window.addEventListener("mouseover", () => {
	mouse.over = true;
});
window.addEventListener("mouseout", () => {
	mouse.over = false;
});
window.addEventListener("mousedown", ({ which }: MouseEvent) => {
	mouse.pressed = true;
	mouse.button = which;
});
window.addEventListener("mouseup", () => {
	mouse.pressed = false;
	mouse.button = 0;
});
