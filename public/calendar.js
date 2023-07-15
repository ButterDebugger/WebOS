import moment from 'https://cdn.jsdelivr.net/npm/moment@2.29.4/+esm'

const calendarContainer = document.getElementById("taskbar-notif");
const timeEle = calendarContainer.querySelector(".time");
const dateEle = calendarContainer.querySelector(".date");

function updateDates() {
    timeEle.innerText = moment().format("h:mm A");
    dateEle.innerText = moment().format("M/D/YYYY");
}

updateDates();

export const timeInterval = setInterval(updateDates, 100);
