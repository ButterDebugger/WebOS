document.addEventListener('contextmenu', function(event) { // Context menu event handler
	event.preventDefault();
	
	let items = document.querySelectorAll('.contextmenu'); // Get all context menus
	items.forEach(function(item) { // Remove old context menus
		item.remove()
	})
	
	add(`<section class="contextmenu" style="left: ${event.clientX}px; top: ${event.clientY}px; z-index: ${Math.pow(parseInt(getSave("latestZ", 1000)), 5)};">
		<ul name="contextmenu" class="menu">
			<li name="refresh" class="menuitem"><span class="menuicon"></span>Refresh</li>
		</ul>
	</section>`)
});
document.getElementById("start").addEventListener("click", function() { // Start menu event handler
	var numberOfButtons = 3; // Number of buttons in the start menu
	var numberOfSeparator = 1; // Number of separator in the start menu
	var trueHeight = (window.innerHeight - (22 + 22)) - (18 * (numberOfButtons - 1)) - (4 * (numberOfSeparator));
	
	add(`<section class="contextmenu" style="left: 0px; top: ${trueHeight}px; z-index: ${Math.pow(parseInt(getSave("latestZ", 1000)), 5)};">
		<ul name="contextmenu" class="menu">
			<li name="reinstall" class="menuitem"><span class="menuicon"></span>Reinstall</li>
			<hr class="menuseparator">
			<li name="refresh" class="menuitem"><span class="menuicon"></span>Reboot</li>
			<li name="shutdown" class="menuitem"><span class="menuicon"></span>Shutdown</li>
		</ul>
	</section>`)
});

document.addEventListener('mousedown', function(event) { // Button down event handler
	let mouseOver = document.elementFromPoint(event.clientX, event.clientY);
	function removeMenus() {
		let items = document.querySelectorAll('.contextmenu');
		items.forEach(function(item) {
			item.remove()
		})
	}
	if (!mouseOver.classList.contains("contextmenu") && !mouseOver.classList.contains("menu") && !mouseOver.classList.contains("menuitem") && !mouseOver.classList.contains("menuseparator") && !mouseOver.classList.contains("menuicon")) {
		removeMenus()
	}
	
	// Menu selection
	if (mouseOver.classList.contains("menuitem") || mouseOver.classList.contains("menuicon")) {
		if (mouseOver.classList.contains("menuicon")) mouseOver = mouseOver.parentElement;
		var menuType = mouseOver.parentElement.getAttribute('name'); // Get menu type
		var itemType = mouseOver.getAttribute('name'); // Get menu item type
		
		if (menuType == "contextmenu") { // Context menu event handler
			if (itemType == "refresh") { // Refresh page
				location.reload();
			}
			if (itemType == "reinstall") { // Reinstall system
				window.localStorage.clear() // Clear stored data
				location.reload()
			}
			if (itemType == "shutdown") { // Shutdown system
				var newHTML = document.open("text/html", "replace"); 
				newHTML.write("It is now safe to close your tab.");
				newHTML.close();
				document.body.style = `background: #000000; color: #ffff00; text-align: center; margin: 0px; padding: ${window.innerHeight / 2 + 12}px; overflow: hidden; font-family: "ＭＳ Ｐゴシック"; font-size: 20px;`;
			}
		}
		removeMenus() // Remove any menus
		// console.log(menuType, itemType)
	}
});


let display = document.getElementById("display");
display.addEventListener('dragenter', handleDragOver, false);
display.addEventListener('dragover', handleDragOver, false);
function handleDragOver(event) {
	event.stopPropagation();
    event.preventDefault();
	// console.log("whoa there")
	
	display.classList.add("highlight")
}
display.addEventListener('dropleave', handleFileSelect, false);
display.addEventListener('drop', handleFileSelect, false);
function handleFileSelect(event) {
	event.stopPropagation();
    event.preventDefault();
	
	var fileList = event.dataTransfer.files;
	for (let f = 0; f < fileList.length; f++) {
		let file = fileList[f];
		// console.log(file)
		
		// console.log(file.__proto__.__proto__.stream())
		// console.log(file.__proto__.__proto__.text())
	}
	
	display.classList.remove("highlight")
}