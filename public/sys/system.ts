import { DesktopItem } from "./desktop.ts";
import Window from "./window.ts";
import { ContextMenu } from "./gui.ts";
import { TaskbarItem } from "./taskbar.ts";
import computerPNG from "./img/computer.png";

interface SystemInterface {
	zIndex: number;
}

const system = {} as SystemInterface;

const startBtn = new TaskbarItem("Start", computerPNG);
startBtn.bold = true;

const startItem = new DesktopItem(computerPNG, "Random Window");
const startItemMenu = new ContextMenu()
	.addOption("one", "one")
	.addOption(
		"two",
		"two",
		new ContextMenu()
			.addOption("uno", "uno")
			.addOption(
				"dos",
				"dos",
				new ContextMenu()
					.addOption("thres", "thres")
					.addOption("quadroo", "quadroo")
			)
	)
	.addDivider()
	.addOption("alert", "test-alert")
	.addOption(
		"four",
		"four",
		new ContextMenu().addOption("uno", "uno-2").addOption("dos", "dos-2")
	)
	.addOption("seventy seven", "seventy-seven");

const alertOption = startItemMenu.getOption("test-alert");
if (alertOption) {
	alertOption.addEventListener("click", () => {
		alert("hi");
	});
}

startItem.ele.addEventListener("dblclick", () => {
	const window = new Window("/apps/files/index.html");
	window.title = "My Computer";
});
startItem.ele.addEventListener("contextmenu", (e: MouseEvent) => {
	startItemMenu.spawn(e.clientX, e.clientY);
	e.preventDefault();
});

let highestZ = 100;

Object.defineProperty(system, "zIndex", {
	configurable: true,
	enumerable: true,
	get: () => highestZ++
});

export default system;
