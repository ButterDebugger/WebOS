import { domParser } from "https://debutter.dev/x/js/utils.js@1.2";

const taskbar = document.getElementById("taskbar");
const taskbarSpacer = taskbar.querySelector(".flex-spacer");

export function addTaskbarItem(title, iconSrc) {
    let item = domParser(`
        <button class="taskbar-item gray-container">
            <img class="taskbar-icon crisp no-drag">
            <span class="taskbar-title"></span>
        </button>
    `);

    item.querySelector(".taskbar-icon").src = iconSrc ?? "/sys/img/broken-image.png";
    item.querySelector(".taskbar-title").innerText = title ?? "Untitled item";

    taskbar.insertBefore(item, taskbarSpacer);
    return item;
}