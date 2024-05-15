import * as fs from "./fs.js";
import keys from "https://debutter.dev/x/js/keys.js@1.1.0";
import { initElementScaler } from "https://debutter.dev/x/js/utils.js@1.2";
import eventemitter3 from "https://cdn.jsdelivr.net/npm/eventemitter3@5.0.1/+esm";
import moment from "https://cdn.jsdelivr.net/npm/moment@2.29.4/+esm";

const desktopContent = document.getElementById("desktop-content");
const canvas = document.getElementById("background");
const calendarContainer = document.getElementById("notifs-container");
const timeEle = calendarContainer.querySelector(".time");

// Background
const ctx = canvas.getContext("2d");

let hue = 0;

setInterval(() => {
    let color = `hsl(${hue}, 75%, 50%)`;
    hue = (hue + 0.03) % 360;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}, 33.3333);

initElementScaler();

// Calendar
function updateDates() {
    timeEle.innerText = moment().format("h:mm A");
}

updateDates();

export const timeInterval = setInterval(updateDates, 100);

// Desktop
export class DesktopItem extends eventemitter3 {
    constructor(src, title, x = 9, y = 9) {
		super();

        this.ele = document.createElement("div");
        this.ele.classList.add("desktop-item", "moveable");
        this.ele.style.left = `${x}px`;
        this.ele.style.top = `${y}px`;

        let icon = document.createElement("img");
        icon.classList.add("crisp", "no-drag", "icon");
        icon.src = src;

        let name = document.createElement("span");
        name.classList.add("title", "white-text");
        name.innerText = title;

        this.ele.appendChild(icon);
        this.ele.appendChild(name);

        // Add drag handler
        this.ele.addEventListener("mousedown", ({ button }) => {
            if (button !== 0) return;

            let bounds = this.ele.getBoundingClientRect();
            let offset = {
                x: keys["MouseX"] - this.x,
                y: keys["MouseY"] - this.y
            }

            const dragHandler = (function() {
                if (!this.ele.classList.contains("moving")) this.ele.classList.add("moving");

                this.x = Math.max(0, Math.min(window.innerWidth - bounds.width, keys["MouseX"] - offset.x));
                this.y = Math.max(0, Math.min(window.innerHeight - bounds.height, keys["MouseY"] - offset.y));
            }).bind(this);

            const dragEndHandler = (function({ button }) {
                if (button !== 0) return;

                window.removeEventListener("mousemove", dragHandler);
                window.removeEventListener("mouseup", dragEndHandler);
                this.ele.classList.remove("moving");
                document.querySelectorAll("iframe").forEach(ele => ele.classList.remove("fix-drag"));
            }).bind(this);

            document.querySelectorAll("iframe").forEach(ele => ele.classList.add("fix-drag"));
            window.addEventListener("mousemove", dragHandler);
            window.addEventListener("mouseup", dragEndHandler);
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

    set x(scalar) {
        this.ele.style.left = `${scalar}px`;

        this.emit("move");
    }
    get x() {
        return this.ele.getBoundingClientRect().x;
    }

    set y(scalar) {
        this.ele.style.top = `${scalar}px`;

        this.emit("move");
    }
    get y() {
        return this.ele.getBoundingClientRect().y;
    }
}

// Load desktop content from memory
fs.file("/home/desktop/broken file").set("nonsense");

for await (let filePath of fs.ls("/home/desktop/")) {
    let itemMeta = fs.file("/home/desktop/" + filePath).meta;

    let item = new DesktopItem("/sys/img/broken-image.png", filePath.split("/").pop());
    item.x = await itemMeta.get("x") ?? 0;
    item.y = await itemMeta.get("y") ?? 0;

    item.on("move", async () => {
        await itemMeta.set("x", item.x);
        await itemMeta.set("y", item.y);
    });
}