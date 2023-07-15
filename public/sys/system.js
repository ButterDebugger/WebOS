import { timeInterval } from "../calendar.js";
import "../background.js";
import { addDesktopIcon } from "../desktop.js";
import * as fs from "./fs.js";

let system = {};

let startIcon = addDesktopIcon("./assets/start-btn.png");
startIcon.addEventListener("dblclick", () => {
    alert("whoa");
});

system.timeInterval = timeInterval;
system.addDesktopIcon = addDesktopIcon;
system.fs = fs;

console.log(system);

export default system;
