void function() {
    const bootScreen = document.getElementById("boot-screen");

    let checks = 0;

    addBootText(navigator.userAgent);
    addBootText(new Date().toString());
    addBootText();
    addBootText("href: " + document.location.href);
    addBootText("origin: " + document.location.origin);
    addBootText("protocol: " + document.location.protocol);
    addBootText("host: " + document.location.host);
    addBootText("hostname: " + document.location.hostname);
    addBootText("port: " + document.location.port);
    addBootText("pathname: " + document.location.pathname);
    addBootText("search: " + document.location.search);
    addBootText("hash: " + document.location.hash);
    addBootText();
    addBootText("Boot ... ready");

    window.addEventListener("DOMContentLoaded", () => {
        addBootText("Document ... loaded");
        passCheck();
    }, { once: true });

    window.addEventListener("load", async () => {
        addBootText("Resources ... loaded");
        passCheck();

        await import("../sys/system.js");
        addBootText("System ... loaded");
        passCheck();
    }, { once: true });

    function addBootText(msg = null) {
        if (typeof msg == "string" && msg.length > 0) {
            let line = document.createElement("span");
            line.innerText = msg;
            bootScreen.appendChild(line);
        } else {
            let line = document.createElement("br");
            bootScreen.appendChild(line);
        }
    }

    function passCheck() {
        checks++;

        if (checks < 3) return;

        setTimeout(() => {
            bootScreen.classList.add("fade-out");

            setTimeout(() => {
                bootScreen.remove();
            }, 500);
        }, 250);
    }
}();