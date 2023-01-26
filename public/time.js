(() => {
    const timeEle = document.getElementById("time");
    const clock = timeEle.querySelector("[name='clock']");
    const post = timeEle.querySelector("[name='post']");

    let paused = false;
    let updateTime = () => {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;

        clock.innerText = hours + ':' + minutes;
        post.innerText = ampm;
    }

    setInterval(() => {
        if (paused) return;
        updateTime();
    }, 100);

    window.webos.time = {
        elements: {
            time: timeEle,
            clock: clock,
            post: post
        },
        updateTime: updateTime,
        paused: paused
    }
})();