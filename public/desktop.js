const desktopContent = document.getElementById("desktop-content");

export function addDesktopIcon(src, x = 9, y = 9) {
    let item = document.createElement("img");
    item.src = src;
    item.classList.add("desktop-item", "no-drag", "crisp");
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    desktopContent.appendChild(item);
    return item;
}

function resetDrag() {
    if (dragHandler != null) {
        window.removeEventListener("mousemove", dragHandler);

        for (let item of document.querySelectorAll(".desktop-item.moving")) {
            item.classList.remove("moving");
        }
    }
}

let dragHandler = null;

window.addEventListener("mousedown", ({ target }) => {
    if (!target.classList.contains("desktop-item")) return;

    let bounds = target.getBoundingClientRect();
    let offset = {
        x: window.keys["MouseX"] - bounds.x,
        y: window.keys["MouseY"] - bounds.y
    }

    resetDrag();

    dragHandler = function() {
        if (!target.classList.contains("moving")) target.classList.add("moving");

        target.style.left = `${Math.max(0, Math.min(window.innerWidth - bounds.width, window.keys["MouseX"] - offset.x))}px`;
        target.style.top = `${Math.max(0, Math.min(window.innerHeight - bounds.height, window.keys["MouseY"] - offset.y))}px`;
    };

    window.addEventListener("mousemove", dragHandler);
});

window.addEventListener("mouseup", resetDrag);