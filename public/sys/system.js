const { Vector2, delay } = utils;

let webos = window.webos = {};
webos.highestz = 1000;
webos.contextmenu = null;

webos.assetmap = new Map();
webos.assetmap.set("defaulticon", "/sys/assets/file.png");
webos.assetmap.set("closebutton", "/sys/assets/close.png");

webos.sfxmap = new Map();
webos.sfxmap.set("openprogram", "/sys/assets/pop.mp3");

utils.library.enable("keys");

webos.uielements = [];
utils.runAnimation(() => {
	webos.uielements.forEach((item) => item.update());
});

// System methods
class Graphics2D {
	constructor(canvas, init, update, draw) {
		// Declare variables
		this.width = canvas.width;
		this.height = canvas.height;
		this.canvas = canvas;
		this.canvas.self = this;

		this.ctx = canvas.getContext('2d');

		this.init = init;
		this.update = update
		this.draw = draw;
		
		// Resize the canvas
		const resizeCanvas = () => {
			this.canvas.width = this.width = this.canvas.parentElement.clientWidth;
			this.canvas.height = this.height = this.canvas.parentElement.clientHeight;
		}
		window.addEventListener("resize", resizeCanvas);
		resizeCanvas();

		// Initialize the canvas
		this.init();
		utils.runAnimation(async (fps) => {
			await this.draw(fps);
		});

		// Add event listeners
		canvas.addEventListener("click", (e) => { this.update(e) });
		canvas.addEventListener("dblclick", (e) => { this.update(e) });
		canvas.addEventListener("contextmenu", (e) => { this.update(e) });
		window.addEventListener("keydown", (e) => {
			this.update(e)
		});
		window.addEventListener("keyup", (e) => {
			this.update(e);
		});
		
		// TODO:
		// - fillCircle() Draw circle to the screen
		// - strokeCircle() Draw ring of circle to the screen
		// - line(x0, y0, x1, y1, col) Draw line to the screen
	}
	
	cls() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	fillColor(color) {
		this.ctx.fillStyle = color;
	}
	strokeColor(color) {
		this.ctx.strokeStyle = color;
	}
	setFont(font) {
		this.ctx.font = font;
	}
	fillRect(x0, y0, x1, y1) {
		this.ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
	}
	strokeRect(x0, y0, x1, y1) {
		this.ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
	}
	fillBackground() {
		this.ctx.fillRect(0, 0, this.width, this.height);
	}
	async drawImage(src, x, y, w, h) {
		var img = await loadImage(src);
		this.ctx.drawImage(img, x, y, w || img.width, h || img.height);
	}
	writeText(x, y, text) {
		this.ctx.fillText(text, x, y);
	}
}
class UIElement {
	constructor(ele) {
		this.position = new Vector2();
		this.zindex = 1000;

		// Generate id
		while (true) {
			this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			if (!webos.uielements.find((item) => item.id == this.id)) break;
		}
		
		if (ele instanceof Element) { // Load from existing element
			this.element = ele;
			
			if (/[0-9]{1,}px/g.test(ele.style.top)) {
				this.position.y = parseFloat(ele.style.top.replace("px", ''));
			} else {
				this.element.style.top = "0px";
			}
			
			if (/[0-9]{1,}px/g.test(ele.style.left)) {
				this.position.x = parseFloat(ele.style.left.replace("px", ''));
			} else {
				this.element.style.left = "0px";
			}
			
			if (!isNaN(ele.style["z-index"]) && ele.style["z-index"] !== '') {
				this.zindex = parseFloat(ele.style["z-index"]);
			} else {
				ele.style["z-index"] = this.zindex;
			}
		} else { // Create new element
			this.element = document.createElement('div');
			
			this.element.style.top = "0px";
			this.element.style.left = "0px";
			this.element.style["z-index"] = this.zindex;
			
			document.body.appendChild(this.element);
		}
		
		this.element.classList.add("ui_item");
		this.element.self = this;
		webos.uielements.push(this);
	}
	
	update() { // Update element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style["z-index"] = this.zindex;
	}

	remove() {
		webos.uielements.splice(webos.uielements.indexOf(this), 1);
		this.element.remove();
	}
}
class Window extends UIElement {
	constructor(src, options = {}) {
		var ele = document.createElement('div');
		ele.classList.add("window", "hidden");
		
		super(ele);
		
		this.src = src;
		this.options = options;
		this.dragging = false;
		this.dragoffset = new Vector2();
		this.loaded = false;
		
		this.iframe = document.createElement('iframe');
		this.iframe.src = src;

		// Create window top bar
		var wintop = document.createElement('div');
		wintop.classList.add("window_top");
		if (options.color) wintop.style["background-color"] = options.color;
		
		var icon = document.createElement('img');
		icon.classList.add("window_icon");
		icon.src = this.options.icon || webos.assetmap.get("defaulticon");
		wintop.appendChild(icon);

		var title = document.createElement('span');
		title.classList.add("window_title");
		title.innerText = this.options.title || "Window";
		wintop.appendChild(title);

		var close = document.createElement('img');
		close.classList.add("window_close");
		close.src = webos.assetmap.get("closebutton");
		close.addEventListener("click", () => {
			this.remove();
		});
		wintop.appendChild(close);

		var winoverlay = document.createElement('div');
		winoverlay.classList.add("window_overlay", "hidden");

		// Random position on screen
		this.iframe.addEventListener("load", () => {
			this.element.classList.remove("hidden");
			this.position.x = Math.random() * (window.innerWidth - this.element.clientWidth);
			this.position.y = Math.random() * (window.innerHeight - this.element.clientHeight - 48);
			this.update();
			this.focus();

			this.loaded = true;

			this.iframe.contentWindow.addEventListener("click", ({ target }) => {
				this.focus();

				if (webos.contextmenu == null) return;
				if (target == webos.contextmenu) return;
				if (isChildOf(target, webos.contextmenu)) return;
				
				webos.contextmenu.remove();
				webos.contextmenu = null;
			});
		});

		window.addEventListener("blur", () => {
			if (document.activeElement === this.iframe) {
				this.focus();
			}
		});
		
		if (this.options.resizable) {
			this.element.classList.add("resizable");
		}

		// Add draggable functionality
		wintop.addEventListener("mousedown", ({ target, button, clientX, clientY }) => {
			if (target == title && button == 0) {
				this.dragging = true;
				
				winoverlay.classList.remove("hidden");
				this.element.classList.add("dragging");

				this.focus();

				this.dragoffset.x = clientX - this.position.x;
				this.dragoffset.y = clientY - this.position.y;
			}
		});

		window.addEventListener("mouseup", () => {
			this.dragging = false;

			winoverlay.classList.add("hidden");
			this.element.classList.remove("dragging");
		});

		window.addEventListener("mousemove", ({ buttons, clientX, clientY }) => {
			if (buttons !== 1) { // Cancel dragging if mouse button is not held
				this.dragging = false;
			}
			if (!this.dragging) { // Cancel if not dragging
				return;
			}

			// Update position
			this.position.x = clientX - this.dragoffset.x;
			this.position.y = clientY - this.dragoffset.y;
			this.update();
		});
		
		// Append elements
		this.element.appendChild(wintop);
		this.element.appendChild(winoverlay);
		this.element.appendChild(this.iframe);
		document.body.appendChild(this.element);
	}

	focus() { // Focus on window
		this.zindex = webos.highestz;
		webos.highestz += 1;
	}
}

// Context menu functions
window.addEventListener("contextmenu", (e) => {
	e.preventDefault();
});

window.addEventListener("click", ({ target }) => {
	if (webos.contextmenu == null) return;
	if (target == webos.contextmenu) return;
	if (isChildOf(target, webos.contextmenu)) return;
	
	webos.contextmenu.remove();
	webos.contextmenu = null;
});

window.addEventListener("resize", () => {
	if (webos.contextmenu == null) return;
	
	webos.contextmenu.remove();
	webos.contextmenu = null;
});

function createContextMenu(target, initCallback, options = {}) {
	target.addEventListener("contextmenu", async ({ clientX, clientY }) => {
		if (webos.contextmenu !== null) webos.contextmenu.remove();

		webos.contextmenu = document.createElement("div");
		webos.contextmenu.classList.add("contextmenu");

		await initCallback({
			addItem: function(text, grayedout = false) {
				var item = document.createElement("span");
				item.classList.add("contextmenu-item");
				item.innerHTML = text;
				if (grayedout) item.classList.add("grayed-out");
				webos.contextmenu.appendChild(item);
				return item;
			},
			addSpacer: function(text) {
				var line = document.createElement("div");
				line.classList.add("contextmenu-spacer");
				webos.contextmenu.appendChild(line);
				return line;
			},
			remove: function() {
				webos.contextmenu.remove();
				webos.contextmenu = null;
			}
		});

		document.body.appendChild(webos.contextmenu);

		var bounds = webos.contextmenu.getBoundingClientRect();
		webos.contextmenu.style.top = Math.min(window.innerHeight - bounds.height, options.y || clientY) + "px";
		webos.contextmenu.style.left = Math.min(window.innerWidth - bounds.width, options.x || clientX) + "px";
	});
}

// System functions
async function launchProgram(program, options = {}) {
	var src = `/programs/${program}/index.html`;
	
	axios.get(`/programs/${program}/details.json`).then(({ data }) => {
		options = Object.assign(data, options);

		sfx(webos.sfxmap.get("openprogram"));

		return new Window(src, options);
	}).catch(() => {
		console.error("Failed to retrieve program details");

		sfx(webos.sfxmap.get("openprogram"));

		return new Window(src, options);
	});
}

function sfx(src) {
	var audio;
	if (src instanceof Audio) {
		audio = src;
	} else {
		audio = new Audio(src);
	}

	// var pitch = utils.random(8, 12) / 10;
	// audio.playbackRate = pitch;

	audio.play();
}

var imgcache = {};
function loadImage(src) {
	if (typeof imgcache[src] !== 'undefined') return imgcache[src]; // Load image from cache
	
	return new Promise((resolve, reject) => {
		var img = new Image();
		img.src = src;
		img.onload = function() {
			imgcache[src] = img; // Save image to cache
			resolve(img);
		}
	});
}

function isChildOf(target, parent) {
	let iterParent = target.parentElement;
	while (iterParent) {
		if (iterParent === parent) return true;
		iterParent = iterParent.parentElement;
	}
	return false;
}
