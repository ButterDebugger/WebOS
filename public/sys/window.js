import { domParser } from "https://debutter.dev/x/js/utils.js@1.2";
import { randomInt } from "https://debutter.dev/x/js/math.js";
import { addTaskbarItem } from "./taskbar.js";
import system from "./system.js";

export default class Window {
    constructor(frameSrc) {
        this.ele = createWindowComponent(this, frameSrc);
        this.ele.window = this;

        this.taskbarItem = addTaskbarItem();
        this.taskbarItem.addEventListener("click", () => {
            if (this.isMinimized()) this.minimize();

            this.focusHandler();
        });
        this.taskbarItem.window = this;

        this.ele.addEventListener("mousedown", () => this.focusHandler());
        this.focusHandler();
        window.addEventListener("click", ({ target }) => {
            if (!this.ele.contains(target) && !this.taskbarItem.contains(target)) {
                this.unfocusHandler();
            }
        });

        this.x = randomInt(0, window.innerWidth - this.width);
        this.y = randomInt(0, window.innerHeight - this.height);
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

    set x(scalar) {
        this.ele.style.left = `${scalar}px`;
    }
    get x() {
        return this.ele.getBoundingClientRect().x;
    }

    set y(scalar) {
        this.ele.style.top = `${scalar}px`;
    }
    get y() {
        return this.ele.getBoundingClientRect().y;
    }

    set height(scalar) {

    }
    get height() {
        return this.ele.getBoundingClientRect().height;
    }

    set width(scalar) {

    }
    get width() {
        return this.ele.getBoundingClientRect().width;
    }

    focusHandler() {
        this.ele.style.zIndex = system.zIndex;
        this.ele.classList.remove("unfocused");
        this.taskbarItem.classList.add("active");
        document.querySelectorAll(".window").forEach(win => {
            if (win !== this.ele) win.window.unfocusHandler();
        });
    }
    unfocusHandler() {
        this.ele.classList.add("unfocused");
        this.taskbarItem.classList.remove("active");
    }

    isMinimized() {
        return this.ele.classList.contains("minimized");
    }
    minimize() {
        this.ele.classList.remove("maximized");
        this.ele.classList.toggle("minimized");
    }

    isMaximized() {
        return this.ele.classList.contains("maximized");
    }
    maximize() {
        this.ele.classList.remove("minimized");
        this.ele.classList.toggle("maximized");
    }

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
            <iframe class="frame gray-inset" src="${frameSrc}"></iframe>
        </div>
    `);

    // Add iframe focus event handlers
    let blurFocus = false;
    ele.addEventListener("mouseover", () => blurFocus = true);
    ele.addEventListener("mouseout", () => blurFocus = false);
    window.addEventListener("blur", () => {
        if (blurFocus) win.focusHandler();
        setTimeout(() => window.focus(), 0);
    });

    // Add window drag event handlers
    let titleBar = ele.querySelector(".title-bar");

    titleBar.addEventListener("mousedown", ({ target }) => {
        if (target.hasAttribute("data-ungrabbable")) return;

        // if (win.isMaximized()) {
        //     win.maximize();
        // }

        let offset = {
            x: window.keys["MouseX"] - win.x,
            y: window.keys["MouseY"] - win.y
        }

        const dragHandler = function() {
            if (!win.ele.classList.contains("moving")) win.ele.classList.add("moving");

            win.x = Math.max(0, Math.min(window.innerWidth - win.width, window.keys["MouseX"] - offset.x));
            win.y = Math.max(0, Math.min(window.innerHeight - win.height, window.keys["MouseY"] - offset.y));
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
        <button data-ungrabbable class="gray-button">-</button>
    `);
    minimizeBtn.addEventListener("click", () => win.minimize());
    titleBar.appendChild(minimizeBtn);

    // Maximize button
    let maximizeBtn = domParser(`
        <button data-ungrabbable class="gray-button">#</button>
    `);
    maximizeBtn.addEventListener("click", () => win.maximize());
    titleBar.appendChild(maximizeBtn);

    // Close button
    let closeBtn = domParser(`
        <button data-ungrabbable class="gray-button">x</button>
    `);
    closeBtn.addEventListener("click", () => win.close());
    titleBar.appendChild(closeBtn);

    document.body.appendChild(ele);
    return ele;
}
