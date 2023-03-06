const calendarContainer = document.getElementById("taskbar-notif");
const timeEle = calendarContainer.querySelector(".time");
const dateEle = calendarContainer.querySelector(".date");

function updateDates() {
    timeEle.innerText = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" });
    dateEle.innerText = new Date().toLocaleDateString();
}

updateDates();

export const timeInterval = setInterval(updateDates, 100);
