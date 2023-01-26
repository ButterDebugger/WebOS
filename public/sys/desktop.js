window.addEventListener("load", () => {
	// Setup taskbar
	var taskbar = document.getElementById('taskbar-items');
	webos.taskbar = {
		element: taskbar,
		items: [],
		addItem: function(icon) {
			var img = document.createElement('img');
			img.src = icon;
			img.classList.add("taskbar-item");
			
			webos.taskbar.element.appendChild(img);
			webos.taskbar.items.push(img);
			return img;
		}
	}

	var item = webos.taskbar.addItem(webos.assetmap.get("defaulticon"));
	item.addEventListener("click", () => {
		launchProgram('test_tab');
	});

	setInterval(() => {
		var time = new Date().toLocaleTimeString() + "\n" + new Date().toLocaleDateString();

		document.getElementById("taskbar-time").innerText = time;
	}, 500);
	
	// Setup desktop
	var _init = function() {
		// var { ctx } = this;
	}
	var _update = function({ type }) {
		// if (type == "click") sfx('sys/assets/pop.mp3');
	}
	var _draw = function(fps) {
		this.cls();
		this.fillColor("rgb(0, 127, 255)");
		this.fillBackground();
	}

	webos.desktopbg = new Graphics2D(document.getElementById("desktop-background"), _init, _update, _draw);
	
	// createContextMenu(webos.desktopbg.canvas, ({ addItem, addSpacer, remove }) => {
	// 	addItem("eat me").addEventListener("click", () => {
	// 		alert("i have been eaten");
	// 		remove();
	// 	});

	// 	addSpacer();

	// 	addItem("dont eat me", true);

	// 	addItem("eat them").addEventListener("click", () => {
	// 		alert("they have been eaten");
	// 		remove();
	// 	});
	// })
});