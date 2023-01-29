import { initElementScaler } from "https://butterycode.com/static/js/1.2/utils.js";
import "https://butterycode.com/static/js/keys.js";
import "/calendar.js";
import "/background.js";
import { addDesktopIcon } from "/desktop.js";

initElementScaler();

let startIcon = addDesktopIcon("/assets/start-btn.png");
startIcon.addEventListener("dblclick", () => {
    alert("whoa");
});

console.log(webos);