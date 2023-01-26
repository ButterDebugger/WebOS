const webos = document.webos = {};

// TODO: make custom events for like clocktick

(async () => {
    webos.screen = document.getElementById("screen");

    // Create main screen elements
    var main = document.createElement("main");
    webos.screen.appendChild(main);
    webos.main = main;

    var desktop = document.createElement("div");
    webos.main.appendChild(desktop);
    webos.desktop = desktop;

    var navbar = document.createElement("nav");
    navbar.classList.add("navbar");
    webos.main.appendChild(navbar);
    webos.navbar = {};
    webos.navbar.ele = navbar;

    var background = document.createElement("canvas");
    webos.main.appendChild(background);
    webos.background = background;

    // Create the navbar content
    var start = document.createElement("button");
    start.classList.add("nav-start");

    var starticon = document.createElement("img");
    starticon.classList.add("crisp", "no-drag");
    starticon.src = "/start_button.png";
    start.appendChild(starticon);

    webos.navbar.ele.appendChild(start);
    webos.navbar.start = start;
    
    var tabs = document.createElement("ol");
    tabs.classList.add("nav-tabs");
    webos.navbar.ele.appendChild(tabs);
    webos.navbar.tabs = tabs;

    var time = document.createElement("div");
    time.classList.add("nav-time");

    var timetext = document.createElement("span");
    timetext.classList.add("nav-time-content");

    function updateTime() {
        timetext.innerHTML = new Date().toLocaleTimeString();
    }
    updateTime();
    setInterval(updateTime, 100);

    time.appendChild(timetext);

    webos.navbar.ele.appendChild(time);
    webos.navbar.time = time;

    console.log(webos);
})();