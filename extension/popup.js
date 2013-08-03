document.addEventListener('DOMContentLoaded', function () {
  $('#viewerLink').click(function() {
    chrome.tabs.create({url: "/viewer.html"});
  });

  $('.pure-menu-heading').select();
});
