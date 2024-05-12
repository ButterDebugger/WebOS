import { DesktopItem } from "./desktop.js";
import * as fs from "./fs.js";
import Window from "./window.js";
import { ContextMenu } from "./gui.js";
import { addTaskbarItem } from "./taskbar.js";

let system = {};

addTaskbarItem("Start", "/sys/img/computer.png");

let startItem = new DesktopItem("/sys/img/computer.png", "Random Window");
let startItemMenu = new ContextMenu()
    .addOption("one")
    .addOption("two", null, new ContextMenu()
        .addOption("uno")
        .addOption("dos", null, new ContextMenu()
            .addOption("thres")
            .addOption("quadroo")
        )
    )
    .addDivider()
    .addOption("alert", "test-alert")
    .addOption("four", null, new ContextMenu()
        .addOption("uno")
        .addOption("dos")
    )
    .addOption("seventy seven");
startItemMenu.getOption("test-alert").addEventListener("click", () => {
    alert("hi");
});

startItem.ele.addEventListener("dblclick", () => {
    let window = new Window("https://info.cern.ch/");
    window.title = "My Computer";
});
startItem.ele.addEventListener("contextmenu", (e) => {
    startItemMenu.spawn(e.clientX, e.clientY);
    e.preventDefault();
})

let highestZ = 100;

Object.defineProperty(system, "zIndex", {
    configurable: true,
    enumerable: true,
    get: function() {
        return highestZ++;
    }
});

system.fs = fs;

console.log(system);

export default system;
