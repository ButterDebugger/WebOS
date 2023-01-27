const calendarContainer = document.getElementById("menubar-calendar");
const timeEle = calendarContainer.querySelector(".time");
const dateEle = calendarContainer.querySelector(".date");

function updateDates() {
    timeEle.innerText = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" });
    dateEle.innerText = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

updateDates();
webos.timeInterval = setInterval(updateDates, 100);
