import keys from "https://debutter.dev/x/js/keys.js@1.1.0";
import { domParser } from "https://debutter.dev/x/js/utils.js@1.2";
import { randomInt, remapRange } from "https://debutter.dev/x/js/math.js";
import { TaskbarItem } from "./taskbar.js";
import system from "./system.js";

export default class Window {
    constructor(frameSrc) {
        this.ele = createWindowComponent(this, frameSrc);
        this.ele.window = this;

        this.taskbarItem = new TaskbarItem();
        this.taskbarItem.ele.addEventListener("click", () => {
            if (this.isMinimized()) this.minimize();

            this.focusHandler();
        });

        this.ele.addEventListener("mousedown", () => this.focusHandler());
        this.focusHandler();
        window.addEventListener("click", ({ target }) => {
            if (!this.ele.contains(target) && !this.taskbarItem.ele.contains(target)) {
                this.unfocusHandler();
            }
        });

        this.width = this.minWidth = 400;
        this.height = this.minHeight = 300;

        this.x = randomInt(0, window.innerWidth - this.width);
        this.y = randomInt(0, window.innerHeight - this.height);
    }

    set icon(src) {
        this.ele.querySelector(".app-icon").src = src;
        this.taskbarItem.icon = src;
    }
    get icon() {
        return this.ele.querySelector(".app-icon").src;
    }

    set title(text) {
        this.ele.querySelector(".title").innerText = text;
        this.taskbarItem.title = text;
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
        this.ele.style.height = `${Math.max(this.minHeight, scalar)}px`;
    }
    get height() {
        return this.ele.getBoundingClientRect().height;
    }

    set width(scalar) {
        this.ele.style.width = `${Math.max(this.minWidth, scalar)}px`;
    }
    get width() {
        return this.ele.getBoundingClientRect().width;
    }

    focusHandler() {
        this.ele.style.zIndex = system.zIndex;
        this.ele.classList.remove("unfocused");
        this.taskbarItem.active = true;
        document.querySelectorAll(".window").forEach(win => {
            if (win !== this.ele) win.window.unfocusHandler();
        });
    }
    unfocusHandler() {
        this.ele.classList.add("unfocused");
        this.taskbarItem.active = false;
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
                <img class="app-icon crisp no-drag no-select" src="/sys/img/broken-image.png">
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

    // Create title bar
    let titleBar = ele.querySelector(".title-bar");

    // Minimize button
    let minimizeBtn = domParser(`
        <button data-ungrabbable class="minimize-window crisp"></button>
    `);
    minimizeBtn.addEventListener("click", () => win.minimize());
    titleBar.appendChild(minimizeBtn);

    // Maximize button
    let maximizeBtn = domParser(`
        <button data-ungrabbable class="maximize-window crisp"></button>
    `);
    maximizeBtn.addEventListener("click", () => win.maximize());
    titleBar.appendChild(maximizeBtn);

    // Close button
    let closeBtn = domParser(`
        <button data-ungrabbable class="close-window crisp"></button>
    `);
    closeBtn.addEventListener("click", () => win.close());
    titleBar.appendChild(closeBtn);

    // Add window resizers
    let resizers = {
        // vertical, invertVertical, horizontal, invertHorizontal
        "n":  [true,  true,  false, false],
        "e":  [false, false, true,  false],
        "s":  [true,  false, false, false],
        "w":  [false, false, true,  true],
        "ne": [true,  true,  true,  false],
        "se": [true,  false, true,  false],
        "sw": [true,  false, true,  true],
        "nw": [true,  true,  true,  true],
    }

    for (let dir of Object.keys(resizers)) {
        let resizer = document.createElement("div");
        resizer.classList.add(`resizer-${dir}`);

        let {
            0: vertical,
            1: invertVertical,
            2: horizontal,
            3: invertHorizontal
        } = resizers[dir];

        resizer.addEventListener("mousedown", () => {
            let offset = {
                x: keys["MouseX"],
                y: keys["MouseY"]
            }
            let startX = win.x;
            let startY = win.y;

            const dragHandler = function() {
                if (horizontal) {
                    // Calculate the x range of where the user can resize
                    let minLeft = invertHorizontal
                        ? 0
                        : win.x + win.minWidth;
                    let maxLeft = invertHorizontal
                        ? startX
                        : window.innerWidth;

                    // Calculate the mouse position difference
                    let diff = Math.max(minLeft, Math.min(maxLeft, keys["MouseX"])) - Math.max(minLeft, Math.min(maxLeft, offset.x));

                    // Update the width and or x position of the window
                    if (invertHorizontal) {
                        win.width -= diff;
                        win.x += diff;
                    } else {
                        win.width += diff;
                    }
                }
                if (vertical) {
                    // Calculate the y range of where the user can resize
                    let minTop = invertHorizontal
                        ? 0
                        : win.y + win.minHeight;
                    let maxTop = invertHorizontal
                        ? startY
                        : window.innerHeight;

                    // Calculate the mouse position difference
                    let diff = Math.max(minTop, Math.min(maxTop, keys["MouseY"])) - Math.max(minTop, Math.min(maxTop, offset.y));

                    // Update the height and or y position of the window
                    if (invertVertical) {
                        win.height -= diff;
                        win.y += diff;
                    } else {
                        win.height += diff;
                    }
                }

                offset.x = keys["MouseX"];
                offset.y = keys["MouseY"];
            }

            document.querySelectorAll("iframe").forEach(ele => ele.classList.add("fix-drag"));
            window.addEventListener("mousemove", dragHandler);

            window.addEventListener("mouseup", () => {
                window.removeEventListener("mousemove", dragHandler);
                document.querySelectorAll("iframe").forEach(ele => ele.classList.remove("fix-drag"));
            }, {
                once: true
            });
        });

        ele.appendChild(resizer);
    }

    // Add window drag event handlers
    titleBar.addEventListener("mousedown", ({ target }) => {
        if (target.hasAttribute("data-ungrabbable")) return;

        let relX;
        let relY;

        if (win.isMaximized()) {
            let beforeWidth = titleBar.getBoundingClientRect().width;
            win.maximize();
            relX = remapRange(keys["MouseX"], 0, beforeWidth, 0, win.width, true);
            relY = keys["MouseY"];
            win.maximize();
        }

        let offset = {
            x: relX ?? (keys["MouseX"] - win.x),
            y: relY ?? (keys["MouseY"] - win.y)
        }

        const dragHandler = function() {
            if (win.isMaximized()) {
                win.maximize();
            }

            if (!win.ele.classList.contains("moving")) win.ele.classList.add("moving");

            win.x = Math.max(0, Math.min(window.innerWidth - win.width, keys["MouseX"] - offset.x));
            win.y = Math.max(0, Math.min(window.innerHeight - win.height, keys["MouseY"] - offset.y));
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

    document.body.appendChild(ele);
    return ele;
}
