// ==UserScript==
// @name         Python Runner for AI
// @namespace    http://tampermonkey.net/
// @version      2024-03-30
// @description  Python Runner for AI
// @author       WuJunkai2004
// @match        *://yiyan.baidu.com
// @match        *://tongyi.aliyun.com/qianwen/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        unsafeWindow
// ==/UserScript==
function get_site_info(){
    let url = window.location.href;
    let support = [
        {
            'site': 'baidu',
            'id': '#DIALOGUE_CONTAINER_ID',
            "cmd": "for_baidu();"
        },{
            'site': 'aliyun',
            'id': '#chat-content',
            "cmd": "for_aliyun();"
        }
    ]
    for(let site of support){
        if(url.includes(site['site'])){
            return site;
        }
    }
}


async function inject_runner(){
    let random_str = Math.random().toString(36).slice(-8);
    let script = document.createElement('script');
    script.src = 'http://localhost:8787/runner.js?' + random_str;
    document.body.appendChild(script);
}

async function inject_stdlib(){
    let script = document.createElement('script');
    script.src = 'http://localhost:8787/brython_stdlib.js';
    script.onload = inject_runner;
    document.body.appendChild(script);
}

async function inject_brython(){
    let script = document.createElement('script');
    script.src = 'http://localhost:8787/brython.min.js';
    script.onload = inject_stdlib;
    document.body.appendChild(script);
}

async function sleep(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function get_dialogue_container(){
    let first_time = true;
    let container = null;
    let id = get_site_info()['id'];
    do{
        container = document.querySelector(id);
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
    console.log('Python Runner for AI is running...');
    await inject_brython();
})();