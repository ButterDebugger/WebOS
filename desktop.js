function run(self, input) {
	function add(data) {
		document.body.insertAdjacentHTML('beforeend', data);
	}
	function launchTab(source, width, height, icon, name) {
		var x = Math.floor(Math.random() * (window.innerWidth - width))
		var y = Math.floor(Math.random() * (window.innerHeight - height))
		var trueHeight = height + 18;
		add(`<section class="moveable tab" style="top: ${y}px; left: ${x}px; width: ${width}px; height: ${trueHeight}px;">
			<header style="text-overflow: clip;">
				<img class="verticalcenter" style="width: 16px; height: 16px" src="${icon}">
				<span class="verticalcenter" style="color: black;">${name}</span>
				<button class="input" onclick="closeTab(this)" style="float: right;"><span>✕</span></button>
			</header>
			<iframe src="${source}" style="width: ${width}px; height: ${trueHeight}px;" ></iframe>
		</section>`)
	}
	
	let fileName = self.getAttribute('name');
	let fileExtension = fileName.split(".").pop();
	if (fileName.includes(".") == false) fileExtension = null;
	let fileDir = "desktop/" + fileName;
	
	// callFile("./sys/app.json")
	// var launch = getJsonSave("desktop/" + fileName, "exe", null);
	// if (launch == null) return;
	
	if (fileExtension == null) return;
	if (fileExtension == "lnk") {
		launchTab(getJsonSave(fileDir, "exe", ""), getJsonSave(fileDir, "tabWidth", ""), getJsonSave(fileDir, "tabHeight", ""), getJsonSave(fileDir, "icon", ""), getJsonSave(fileDir, "tabName", ""))
	}
	reloadIcons()
}
function callFile(path) {
	function add(data) {
		document.body.insertAdjacentHTML('beforeend', data);
	}
	var id = "json#" + Math.floor(Math.random() * 1000000).toString();
	add(`<iframe id="${id}" class="hidden" style="width: 0px; height: 0px; z-index: -1;" src="${path}"></iframe>`)
	console.log(document.getElementById(id).contentDocument)
	console.log(document.getElementById(id).contentWindow.document)
}



function closeTab(self) { // Close tab function
	self.parentElement.parentElement.remove();
}

windowLoad()
window.onload = window.onresize = windowLoad;
function windowLoad() {
	var footer = document.getElementById("footer");
	footer.style.width = (window.innerWidth - 4) + "px";
	footer.style.zIndex = Math.pow(parseInt(getSave("latestZ", 1000)), 3);
	
	var display = document.getElementById("display");
	display.style.width = window.innerWidth + "px";
	display.style.height = window.innerHeight + "px";
}



document.addEventListener('mouseup', function(event) {
	let items = document.querySelectorAll('.moveable');
	items.forEach(function(item) {
		item.mouseoverfix = true;
	})
});

let latestZ = parseInt(getSave("latestZ", 1000)); // Declare latestZ

reloadIcons()
function reloadIcons() {
	let items = document.querySelectorAll('.moveable');
	items.forEach(function(item) {
		item.style.zIndex = parseInt(getJsonSave("desktop/" + item.getAttribute('name'), "z", 1000));
		
		if (item.classList.contains("tab")) item.style.zIndex = Math.pow(latestZ, 2);
		latestZ++;
		setSave("latestZ", latestZ)
		
		item.onmousedown = function(event) {
			item.mouseoverfix = false;
			let shiftX = event.clientX - item.getBoundingClientRect().left;
			let shiftY = event.clientY - item.getBoundingClientRect().top;
			
			if (event.which !== 1) return;
			item.style.zIndex = latestZ;
			if (item.classList.contains("tab")) item.style.zIndex = latestZ * latestZ;
			latestZ++;
			document.getElementById("footer").style.zIndex = Math.pow(latestZ, 3);
			setSave("latestZ", latestZ)

			moveAt(event.pageX, event.pageY);

			function moveAt(pageX, pageY) {
				item.style.left = pageX - shiftX + 'px';
				item.style.top = pageY - shiftY + 'px';
				if (!item.classList.contains("tab")) item.style.zIndex = Math.pow(latestZ, 4);
			}
			
			function onMouseMove(event) {
				event.preventDefault();
				// item.style.visibility = "inherit";
				if (item.classList.contains("clickable")) {
					item.classList.add("shadow")
				}
				item.style.cursor = "grabbing";
				moveAt(event.pageX, event.pageY);
				
				if (!item.mouseoverfix) item.mouseoverfix = false;
				if (item.mouseoverfix == true) {
					item.mouseoverfix = false;
					item.onmouseup()
					// item.parentNode.replaceChild(item.cloneNode(true), item);
					reloadIcons()
				}
			}

			document.addEventListener('mousemove', onMouseMove);

			item.onmouseup = function() {
				item.style.cursor = null;
				// item.style.visibility = "visible";
				
				// Add shadow Animation
				if (item.classList.contains("clickable")) {
					item.classList.remove("shadow")
					item.classList.add("shadow-after")
					setTimeout(function() {
						item.classList.remove("shadow-after")
					}, 100);
				}
				
				document.removeEventListener('mousemove', onMouseMove);
				if (!item.classList.contains("tab")) item.style.zIndex = latestZ;
				if (typeof item.getAttribute('name') !== 'undefined' && item.getAttribute('name') !== null) {
					setJsonSave("desktop/" + item.getAttribute('name'), "x", item.style.left) // Save position
					setJsonSave("desktop/" + item.getAttribute('name'), "y", item.style.top) // Save position
					setJsonSave("desktop/" + item.getAttribute('name'), "z", latestZ) // Save position
				}
				// document.body.append(item);
				// item.onmouseup = null;
			};
		};

		item.ondragstart = function() {
			return false;
		};
	});
}



function getSave(saveName, ifnot) {
	var storage = window.localStorage;
	if (typeof storage[saveName] !== "undefined") {
		return storage[saveName];
	} else {
		return ifnot;
	}
}
function setSave(saveName, value) {
	window.localStorage.setItem(saveName, value.toString());
}
function getJsonSave(saveName, value, ifnot) {
	var data = getSave(saveName, "{}")
	var json = JSON.parse(data);
	
	if (typeof json[value] !== 'undefined') {
		return json[value];
	} else {
		return ifnot;
	}
}
function setJsonSave(saveName, variable, value) {
	var save = JSON.parse(getSave(saveName, "{}"))
	
	save[variable] = value;
	
	setSave(saveName, JSON.stringify(save))
}