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
	.addOption("one")
	.addOption(
		"two",
		new ContextMenu()
			.addOption("uno")
			.addOption(
				"dos",
				new ContextMenu().addOption("thres").addOption("quadroo")
			)
	)
	.addDivider()
	.addOption("alert", () => alert("hi"))
	.addOption("four", new ContextMenu().addOption("uno").addOption("dos"))
	.addOption("seventy seven");

startItem.on("open", () => {
	const window = new Window("/apps/files/index.html");
	window.title = "My Computer";
});
startItem.on("contextmenu", ({ x, y }) => {
	startItemMenu.spawn(x, y);
});

let highestZ = 100;

Object.defineProperty(system, "zIndex", {
	configurable: true,
	enumerable: true,
	get: () => highestZ++
});

export default system;
