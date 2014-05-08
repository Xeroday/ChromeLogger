document.addEventListener('keypress', function (e) {
    e = e || window.event;
    var charCode = typeof e.which == "number" ? e.which : e.keyCode;
    if (charCode) {
        log(String.fromCharCode(charCode));
    }
});

document.addEventListener('keydown', function (e) {
    e = e || window.event;
    var charCode = typeof e.which == "number" ? e.which : e.keyCode;
    if (charCode == 8) {
        log("[BACKSPACE]");
    } else if (charCode == 9) {
        log("[TAB]");
    } else if (charCode == 13) {
        log("[ENTER]");
    } else if (charCode == 16) {
        log("[SHIFT]");
    } else if (charCode == 17) {
        log("[CTRL]");
    } else if (charCode == 18) {
        log("[ALT]");
    } else if (charCode == 91) {
        log("[L WINDOW]"); // command for mac
    } else if (charCode == 92) {
        log("[R WINDOW]"); // command for mac
    } else if (charCode == 93) {
        log("[SELECT/CMD]"); // command for mac
    }
});

function log(key) {
    console.log("log", key);
}