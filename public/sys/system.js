import { DesktopItem } from "./desktop.js";
import Window from "./window.js";
import { ContextMenu } from "./gui.js";
import { TaskbarItem } from "./taskbar.js";
import computerPNG from "./img/computer.png";

const system = {};

const startBtn = new TaskbarItem("Start", computerPNG);
startBtn.bold = true;

const startItem = new DesktopItem(computerPNG, "Random Window");
const startItemMenu = new ContextMenu()
	.addOption("one")
	.addOption(
		"two",
		null,
		new ContextMenu()
			.addOption("uno")
			.addOption(
				"dos",
				null,
				new ContextMenu().addOption("thres").addOption("quadroo"),
			),
	)
	.addDivider()
	.addOption("alert", "test-alert")
	.addOption("four", null, new ContextMenu().addOption("uno").addOption("dos"))
	.addOption("seventy seven");
startItemMenu.getOption("test-alert").addEventListener("click", () => {
	alert("hi");
});

startItem.ele.addEventListener("dblclick", () => {
	const window = new Window("/apps/files/index.html");
	window.title = "My Computer";
});
startItem.ele.addEventListener("contextmenu", (e) => {
	startItemMenu.spawn(e.clientX, e.clientY);
	e.preventDefault();
});

let highestZ = 100;

Object.defineProperty(system, "zIndex", {
	configurable: true,
	enumerable: true,
	get: () => highestZ++,
});

export default system;
