window.webos = {};

const bootScreen = document.getElementById("boot-screen");

// TODO: show steps taken to boot

window.addEventListener("load", (event) => {
    bootScreen.classList.add("fade-out");

    setTimeout(() => {
        bootScreen.remove();
    }, 500);
});