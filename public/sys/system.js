import { DesktopItem } from "./desktop.js";
import Window from "./window.js";
import { ContextMenu } from "./gui.js";
import { TaskbarItem } from "./taskbar.js";

let system = {};

let startBtn = new TaskbarItem("Start", "/sys/img/computer.png");
startBtn.bold = true;

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
    let window = new Window("/apps/files/index.html");
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

export default system;
