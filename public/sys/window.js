import { domParser } from "https://debutter.dev/x/js/utils.js@1.2";
import { addTaskbarItem } from "./taskbar.js";
import system from "./system.js";

export default class Window {
    constructor(frameSrc) {
        this.ele = createWindowComponent(this, frameSrc);

        this.taskbarItem = addTaskbarItem();
        this.taskbarItem.addEventListener("click", () => {
            this.ele.style.zIndex = system.zIndex;
        });
        this.ele.addEventListener("mousedown", () => {
            this.ele.style.zIndex = system.zIndex;
        });

        document.body.appendChild(this.ele);
    }

    set icon(src) {
        this.ele.querySelector(".app-icon").src = src;
        this.taskbarItem.querySelector(".taskbar-icon").src = src;
    }
    get icon() {
        return this.ele.querySelector(".app-icon").src;
    }

    set title(text) {
        this.ele.querySelector(".title").innerText = text;
        this.taskbarItem.querySelector(".taskbar-title").innerText = text;
    }
    get title() {
        return this.ele.querySelector(".title").innerText;
    }

    minimize() {}
    maximize() {}
    close() {
        this.ele.remove();
        this.taskbarItem.remove();
    }
}

function createWindowComponent(win, frameSrc) {
    let ele = domParser(`
        <div class="window gray-container moveable">
            <div class="title-bar">
                <img class="app-icon crisp no-drag no-select" src="/assets/icons/broken-image.png">
                <span class="title">Untitled Window</span>
                <div class="flex-spacer"></div>
            </div>
            <iframe class="frame" src="${frameSrc}"></iframe>
        </div>
    `);

    ele.style.zIndex = system.zIndex;

    let titleBar = ele.querySelector(".title-bar");

    titleBar.addEventListener("mousedown", () => {
        let bounds = win.ele.getBoundingClientRect();
        let offset = {
            x: window.keys["MouseX"] - bounds.x,
            y: window.keys["MouseY"] - bounds.y
        }

        const dragHandler = function() {
            if (!win.ele.classList.contains("moving")) win.ele.classList.add("moving");

            win.ele.style.left = `${Math.max(0, Math.min(window.innerWidth - bounds.width, window.keys["MouseX"] - offset.x))}px`;
            win.ele.style.top = `${Math.max(0, Math.min(window.innerHeight - bounds.height, window.keys["MouseY"] - offset.y))}px`;
        }

        document.querySelectorAll("iframe").forEach(ele => ele.classList.add("fix-drag"));
        window.addEventListener("mousemove", dragHandler);
        
        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", dragHandler);
            win.ele.classList.remove("moving");
            document.querySelectorAll("iframe").forEach(ele => ele.classList.remove("fix-drag"));
        }, {
            once: true
        });
    });

    // Minimize button
    let minimizeBtn = domParser(`
        <button class="gray-button">-</button>
    `);
    minimizeBtn.addEventListener("click", () => win.minimize());
    titleBar.appendChild(minimizeBtn);

    // Maximize button
    let maximizeBtn = domParser(`
        <button class="gray-button">#</button>
    `);
    maximizeBtn.addEventListener("click", () => win.maximize());
    titleBar.appendChild(maximizeBtn);

    // Close button
    let closeBtn = domParser(`
        <button class="gray-button">x</button>
    `);
    closeBtn.addEventListener("click", () => win.close());
    titleBar.appendChild(closeBtn);

    return ele;
}
