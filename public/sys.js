import { timeInterval } from "./calendar.js";
import "./background.js";
import { addDesktopIcon } from "./desktop.js";

let system = {};

let startIcon = addDesktopIcon("./assets/start-btn.png");
startIcon.addEventListener("dblclick", () => {
    alert("whoa");
});

system.timeInterval = timeInterval;
system.addDesktopIcon = addDesktopIcon;

console.log(system);

export default system;
