// ==UserScript==
// @name         Python Runner for AI
// @namespace    http://tampermonkey.net/
// @version      2024-03-26
// @description  Python Runner for AI
// @author       WuJunkai2004
// @match        https://yiyan.baidu.com
// @match        http://yiyan.baidu.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        unsafeWindow
// ==/UserScript==
async function inject_runner(){
    var random_str = Math.random().toString(36).slice(-8);
    var script = document.createElement('script');
    script.src = 'http://localhost:8787/runner.js?' + random_str;
    document.body.appendChild(script);
}

async function inject_stdlib(){
    var script = document.createElement('script');
    script.src = 'http://localhost:8787/brython_stdlib.js';
    script.onload = inject_runner;
    document.body.appendChild(script);
}

async function inject_brython(){
    var script = document.createElement('script');
    script.src = 'http://localhost:8787/brython.min.js';
    script.onload = inject_stdlib;
    document.body.appendChild(script);
}

async function sleep(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function get_dialogue_container(){
    var first_time = true;
    var container = null;
    do{
        container = document.querySelector('#DIALOGUE_CONTAINER_ID');
        if(first_time != true){
            await sleep(1000);
        } else {
            first_time = false;
        }
    }while(!container);
    return container;
}

(async function() {
    'use strict';
    await get_dialogue_container();
    await inject_brython();
})();