import { timeInterval } from "../calendar.js";
import "../background.js";
import { addDesktopIcon } from "../desktop.js";
import * as fs from "./fs.js";
import Window from "./window.js";

let system = {};

let startIcon = addDesktopIcon("/sys/img/start-btn.png");
startIcon.addEventListener("dblclick", () => {
    let window = new Window("https://info.cern.ch/");
    window.title = "My Computer";
});

let highestZ = 100;

Object.defineProperty(system, "zIndex", {
    configurable: true,
    enumerable: true,
    get: function() {
        return highestZ++;
    }
});

system.timeInterval = timeInterval;
system.addDesktopIcon = addDesktopIcon;
system.fs = fs;

console.log(system);

export default system;
