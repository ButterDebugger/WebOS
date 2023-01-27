import "/time.js";
import { screenScaler } from "/scale.js";
import "/lib/clickable/script.js";

screenScaler(document.getElementById("wrapper"));

const FileSystem = () => {

}
const AudioPlayer = () => {

}
const scopeEval = (script, scope) => Function(`"use strict";return(()=>{${script}})`).bind(scope)();
const asyncEval = (script, scope) => Function(`"use strict";return(async()=>{${script}})`).bind(scope)();
