(() => {
    const clickables = document.querySelectorAll(".clickable");

    window.addEventListener("click", ({ target }) => {
        for (var ele of clickables) { // Loop through all clickable elements
            if (utils.isChildOf(target, ele) || target === ele) { // Check if element clickable
                if (ele.classList.contains("active-click")) {
                    // Execute click event
                    if (typeof ele.receiveClick == "function") {
                        ele.receiveClick();
                    }

                    ele.classList.remove("active-click");
                    return;
                } else {
                    ele.classList.add("active-click");

                    clickables.forEach(clickable => {
                        if (clickable === ele) return;
                        if (!clickable.classList.contains("active-click")) return;

                        clickable.classList.remove("active-click");
                    });
                }
                return;
            }
        }

        // Remove active click effect from all clickables
        clickables.forEach(ele => {
            if (!ele.classList.contains("active-click")) return;

            ele.classList.remove("active-click");
        });
    });
})();