const desktopContent = document.getElementById("desktop-content");

export function addDesktopIcon(src, x = 9, y = 9) {
    let item = document.createElement("img");
    item.src = src;
    item.classList.add("desktop-item", "moveable", "no-drag", "crisp");
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;

    // Add drag handler
    item.addEventListener("mousedown", () => {
        let bounds = item.getBoundingClientRect();
        let offset = {
            x: window.keys["MouseX"] - bounds.x,
            y: window.keys["MouseY"] - bounds.y
        }

        const dragHandler = function() {
            if (!item.classList.contains("moving")) item.classList.add("moving");

            item.style.left = `${Math.max(0, Math.min(window.innerWidth - bounds.width, window.keys["MouseX"] - offset.x))}px`;
            item.style.top = `${Math.max(0, Math.min(window.innerHeight - bounds.height, window.keys["MouseY"] - offset.y))}px`;
        }

        document.querySelectorAll("iframe").forEach(ele => ele.classList.add("fix-drag"));
        window.addEventListener("mousemove", dragHandler);
        
        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", dragHandler);
            item.classList.remove("moving");
            document.querySelectorAll("iframe").forEach(ele => ele.classList.remove("fix-drag"));
        }, {
            once: true
        });
    });

    desktopContent.appendChild(item);
    return item;
}
