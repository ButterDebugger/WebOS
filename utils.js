function getSave(saveName, ifnot) { // Get a stored variable
	var storage = window.localStorage;
	if (typeof storage[saveName] !== "undefined") {
		return storage[saveName];
	} else {
		return ifnot;
	}
}
function setSave(saveName, value) { // Store a variable
	window.localStorage.setItem(saveName, value.toString());
}
function getJsonSave(saveName, value, ifnot) { // Get a stored json variable
	var data = getSave(saveName, "{}")
	var json = JSON.parse(data);
	
	if (typeof json[value] !== 'undefined') {
		return json[value];
	} else {
		return ifnot;
	}
}
function setJsonSave(saveName, variable, value) { // Store a json variable
	var save = JSON.parse(getSave(saveName, "{}"))
	
	save[variable] = value;
	
	setSave(saveName, JSON.stringify(save))
}
function add(data) { // Add an element to the page
	document.body.insertAdjacentHTML('beforeend', data);
}
const delay = ms => new Promise(res => setTimeout(res, ms)); // Create a delay