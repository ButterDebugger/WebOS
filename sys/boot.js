let addScript;
window.onload = beforeload;
async function beforeload() {
	addScript = function(file) { // Load Scripts
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = file;
		document.body.append(script);
	}
	await addScript("./sys/utils.js") // Load system utils
	
	await new Promise(res => setTimeout(res, 250)); // Wait for utils to load
	preload()
}

async function preload() {
	add(platform.ua);
	add(new Date());
	add("<br>");
	add("<br>");
	await delay(Math.floor(Math.random() * 1000))
	add("href: " + document.location.href);
	add("<br>");
	add("origin: " + document.location.origin);
	add("<br>");
	add("protocol: " + document.location.protocol);
	add("<br>");
	add("host: " + document.location.host);
	add("<br>");
	add("hostname: " + document.location.hostname);
	add("<br>");
	add("port: " + document.location.port);
	add("<br>");
	add("pathname: " + document.location.pathname);
	add("<br>");
	add("search: " + document.location.search);
	add("<br>");
	add("hash: " + document.location.hash);
	add("<br>");
	add("<br>");
	await delay(Math.floor(Math.random() * 1000))
	add("System v1.3.3 booting on");
	add("<br>");
	add(platform.description);
	add("<br>");
	add("<br>");
	add("boot ... ready");
	add("<br>");
	await delay(Math.floor(Math.random() * 1000))
	add("utils ... ready");
	add("<br>");
	await delay(Math.floor(Math.random() * 1000))
	add("desktop ... ready");
	add("<br>");
	await delay(Math.floor(Math.random() * 1000))
	add("system ... ready");
	add("<br>");
	
	await delay(Math.floor(Math.random() * 1000))
	load()
}

async function load() {
	await delay(Math.floor(Math.random() * 1000))
	document.body.innerHTML = ""; // Remove body loadup text
	
	function createIcon(x, y, z, name, call, img, width, height, rename, title) {
		add(`<section class="moveable clickable" title="${title}" name="${name}" ondblclick="${call}" style="top: ${y}px; left: ${x}px;">
			<center>
			<img style="width: ${width}px; height: ${height}px; zIndex: ${z}px;" src="${img}">
			<br>
			<div class="filename">
				<span>${rename}</span>
			</div>
			</center>
		</section>`)
	}
	
	// Load Desktop
	add(`<footer id="footer" class="content"><button id="start" class="input">Start</button></footer>`)
	add(`<section id="display" style="top: 0px; left: 0px;"></section>`)
	
	var app = [
		{
			x: 8,
			y: 8,
			z: 1000,
			name: "snake.lnk",
			path: "desktop/",
			types: {
				exe: "./sys/exe/snake.html",
				tabWidth: 600,
				tabHeight: 600,
				icon: "./sys/assets/snake-1.png",
				tabName: "Snake"
			},
			call: "run(this)",
			img: "./sys/assets/snake-1.png",
			width: 32,
			height: 32,
			rename: "Snake.exe",
			title: "Play snake"
		},
		{
			x: 72,
			y: 8,
			z: 1000,
			name: "explorer.lnk",
			path: "desktop/",
			types: {
				exe: "./sys/exe/explorer.html",
				tabWidth: 600,
				tabHeight: 600,
				icon: "./sys/assets/globe-1.png",
				tabName: "Explorer"
			},
			call: "run(this)",
			img: "./sys/assets/globe-1.png",
			width: 32,
			height: 32,
			rename: "Explorer.exe",
			title: "Search the internet"
		}
	]
	
	for (let a = 0; a < app.length; a++) { // Add new apps
		createIcon(parseInt(getJsonSave(app[a].path + app[a].name, "x", app[a].x)), parseInt(getJsonSave(app[a].path + app[a].name, "y", app[a].y)), parseInt(getJsonSave(app[a].path + app[a].name, "z", app[a].z)), app[a].name, app[a].call, app[a].img, app[a].width, app[a].height, app[a].rename, app[a].title)
		
		var types = Object.keys(app[a].types);
		for (let t = 0; t < types.length; t++) {
			var result = getJsonSave(app[a].path + app[a].name, types[t], null)
			if (result == null) {
				setJsonSave(app[a].path + app[a].name, types[t], app[a].types[types[t]])
			}
		}
	}
	
	afterload()
}

async function afterload() {
	document.body.classList.remove("terminal");
	await delay(Math.floor(Math.random() * 100))
	
	addScript("./sys/desktop.js")
	addScript("./sys/system.js")
	
	await delay(Math.floor(Math.random() * 100))
	document.body.classList.add("desktop");
}