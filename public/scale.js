(() => {
    const scaleScreen = () => {
        const wrapper = document.getElementById("wrapper");
        let scale;

        if (window.innerWidth >= window.innerHeight) {
            scale = Math.min(window.innerWidth / wrapper.clientWidth, window.innerHeight / wrapper.clientHeight);
            wrapper.style.rotate = "0deg";
        } else {
            scale = Math.min(window.innerWidth / wrapper.clientHeight, window.innerHeight / wrapper.clientWidth);
            wrapper.style.rotate = "90deg";
        }

        wrapper.style.scale = scale;
    }

    window.addEventListener("resize", scaleScreen);
    window.addEventListener("load", scaleScreen);
    window.addEventListener("orientationchange", scaleScreen);
})();