(() => {
    const FileSystem = () => {

    }
    const AudioPlayer = () => {

    }
    const scopeEval = (script, scope) => Function(`"use strict";return(()=>{${script}})`).bind(scope)();
    const asyncEval = (script, scope) => Function(`"use strict";return(async()=>{${script}})`).bind(scope)();

    window.webos = {}
})();