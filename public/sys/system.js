import { timeInterval } from "./calendar.js";
import "./background.js";
import { DesktopItem } from "./desktop.js";
import * as fs from "./fs.js";
import Window from "./window.js";

let system = {};

let startItem = new DesktopItem("/sys/img/start-btn.png", "Random Window");
startItem.ele.addEventListener("dblclick", () => {
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
system.fs = fs;

console.log(system);

export default system;
