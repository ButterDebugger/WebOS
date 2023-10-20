import { domParser } from "https://debutter.dev/x/js/utils.js@1.2";

const taskbar = document.getElementById("taskbar");
const taskbarSpacer = taskbar.querySelector(".flex-spacer");

export function addTaskbarItem(title, iconSrc) {
    let item = domParser(`
        <button class="taskbar-item gray-button">
            <img class="taskbar-icon crisp no-drag" src="${iconSrc ?? "/assets/icons/broken-image.png"}">
            <span class="taskbar-title">${title ?? "Untitled item"}</span>
        </button>
    `, true);

    taskbar.insertBefore(item, taskbarSpacer);
    return item;
}