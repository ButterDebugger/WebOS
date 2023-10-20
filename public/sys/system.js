import { timeInterval } from "../calendar.js";
import "../background.js";
import { addDesktopIcon } from "../desktop.js";
import * as fs from "./fs.js";
import Window from "./window.js";

let system = {};

let startIcon = addDesktopIcon("./assets/start-btn.png");
startIcon.addEventListener("dblclick", () => {
    let window = new Window();
    window.title = "My Computer";
});

system.timeInterval = timeInterval;
system.addDesktopIcon = addDesktopIcon;
system.fs = fs;

console.log(system);

export default system;
