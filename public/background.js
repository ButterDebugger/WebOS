const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

let hue = 0;

setInterval(() => {
    let color = `hsl(${hue}, 75%, 50%)`;
    hue = (hue + 0.03) % 360;
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}, 33.3333);
