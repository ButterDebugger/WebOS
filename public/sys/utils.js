function getSave(saveName, ifnot) { // Get a stored variable
	var storage = window.localStorage;
	if (typeof storage[saveName] !== "undefined") { // Check if stored value exists
		return storage[saveName];
	} else { // If value doesn't exist return ifnot value
		return ifnot;
	}
}
function setSave(saveName, value) { // Store a variable
	window.localStorage.setItem(saveName, value.toString());
}
function getJsonSave(saveName, value, ifnot) { // Get a stored json variable
	var data = getSave(saveName, "{}")
	var json = JSON.parse(data);
	
	if (typeof json[value] !== 'undefined') { // Check if stored json value exists
		return json[value];
	} else { // If value doesn't exist return ifnot value
		return ifnot;
	}
}
function setJsonSave(saveName, variable, value) { // Store a json variable
	var save = JSON.parse(getSave(saveName, "{}")) // Get stored json data
	
	save[variable] = value; // Set the json value
	
	setSave(saveName, JSON.stringify(save)) // Save new json data
}
function add(data) { // Add an element to the page
	document.body.insertAdjacentHTML('beforeend', data); // Add new elements to body
}
const delay = ms => new Promise(res => setTimeout(res, ms)); // Create a delay