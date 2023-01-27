export function screenScaler(ele) {
    const rescaleHandler = () => {
        let scale;
    
        if (window.innerWidth >= window.innerHeight) {
            scale = Math.min(window.innerWidth / ele.clientWidth, window.innerHeight / ele.clientHeight);
            ele.style.rotate = "0deg";
        } else {
            scale = Math.min(window.innerWidth / ele.clientHeight, window.innerHeight / ele.clientWidth);
            ele.style.rotate = "90deg";
        }
    
        ele.style.scale = scale;
    }

    window.addEventListener("resize", rescaleHandler);
    window.addEventListener("load", rescaleHandler);
    window.addEventListener("orientationchange", rescaleHandler);
}
