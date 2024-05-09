import keys from "https://debutter.dev/x/js/keys.js@1.1.0";

const desktopContent = document.getElementById("desktop-content");

export class DesktopItem {
    constructor(src, title, x = 9, y = 9) {
        this.ele = document.createElement("div");
        this.ele.classList.add("desktop-item", "moveable");
        this.ele.style.left = `${x}px`;
        this.ele.style.top = `${y}px`;

        let icon = document.createElement("img");
        icon.classList.add("crisp", "no-drag", "icon");
        icon.src = src;

        let name = document.createElement("span");
        name.classList.add("title");
        name.innerText = title;

        this.ele.appendChild(icon);
        this.ele.appendChild(name);

        // Add drag handler
        this.ele.addEventListener("mousedown", () => {
            let bounds = this.ele.getBoundingClientRect();
            let offset = {
                x: keys["MouseX"] - bounds.x,
                y: keys["MouseY"] - bounds.y
            }

            const dragHandler = (function() {
                if (!this.ele.classList.contains("moving")) this.ele.classList.add("moving");

                this.ele.style.left = `${Math.max(0, Math.min(window.innerWidth - bounds.width, keys["MouseX"] - offset.x))}px`;
                this.ele.style.top = `${Math.max(0, Math.min(window.innerHeight - bounds.height, keys["MouseY"] - offset.y))}px`;
            }).bind(this);

            document.querySelectorAll("iframe").forEach(ele => ele.classList.add("fix-drag"));
            window.addEventListener("mousemove", dragHandler);

            window.addEventListener("mouseup", () => {
                console.log("what")
                window.removeEventListener("mousemove", dragHandler);
                this.ele.classList.remove("moving");
                document.querySelectorAll("iframe").forEach(ele => ele.classList.remove("fix-drag"));
            }, {
                once: true
            });
        });

        desktopContent.appendChild(this.ele);
    }

    set icon(src) {
        this.ele.querySelector(".icon").src = src;
    }
    get icon() {
        return this.ele.querySelector(".icon").src;
    }

    set title(text) {
        this.ele.querySelector(".title").innerText = text;
    }
    get title() {
        return this.ele.querySelector(".title").innerText;
    }
}
