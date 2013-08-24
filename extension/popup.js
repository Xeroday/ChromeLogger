document.addEventListener('DOMContentLoaded', function () {
  $('#viewerLink').click(function() {
    chrome.tabs.create({url: "/viewer.html"});
  });
  $('#optionsLink').click(function() {
    chrome.tabs.create({url: "/options.html"});
  });
  $('#aboutLink').click(function() {
    chrome.tabs.create({url: "/about.html"});
  });
});
