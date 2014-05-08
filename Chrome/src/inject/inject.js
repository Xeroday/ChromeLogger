chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
        var s = document.createElement('script');
        s.src = chrome.extension.getURL("src/inject/payload.js");
        s.onload = function() {
            this.parentNode.removeChild(this);
        };
        (document.head||document.documentElement).appendChild(s);
		// ----------------------------------------------------------

	}
	}, 1000);
});