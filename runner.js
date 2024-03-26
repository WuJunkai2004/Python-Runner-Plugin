new MutationObserver((mutationsList, mutationObserver) => {
    // insert element
    function insert_after(new_node, target_node){
        let parent = target_node.parentNode;
        if(parent.lastChild == target_node){
            parent.appendChild(new_node);
        } else {
            parent.insertBefore(new_node, target_node.nextSibling);
        }
    };
    // debounce
    let last_time = localStorage.getItem('last_time') || null;
    last_time = last_time ? parseInt(last_time) : null;
    if(last_time){
        clearTimeout(last_time);
    }
    // run the code
    last_time = setTimeout(() => {
        let code_block = document.querySelectorAll('.language-python');
        for(let code of code_block){
            let is_done = code.getAttribute('is-done') || null;
            if(is_done){
                continue;
            }
            code.setAttribute('is-done', true);
            // add the display block
            let id = Math.random().toString(36).slice(-8);
            let result = code.parentNode.cloneNode(true);
            result.setAttribute('id', id);
            result.querySelectorAll('.code-copy').forEach(element => element.remove());
            result.querySelector('.code-lang').innerText = 'output';
            result.querySelector('tbody').innerHTML = '';
            result.querySelector('tbody').setAttribute('id', id + '_output');
            result.setAttribute('hidden', true);
            insert_after(result, code.parentNode);
            // get the code script
            let tr_list = code.getElementsByTagName('tr');
            let code_text = `def print(*args,sep=' ', end='\\n', file='', flush='', init=False):\n` +
                            '    from browser import document\n' +
                            '    text = sep.join(list(map(str, args)))\n' +
                            '    if init:\n' +
                            `        document['${id}_output'].innerHTML = ''\n` +
                            '        return\n' +
                            `    document['${id}'].hidden = False\n` +
                            `    document['${id}_output'].innerHTML += text + end\n` +
                            'print(init=True)\n'
            for(let tr of tr_list){
                code_text += tr.innerText.slice(1) + '\n';
            }
            // show the run cpy_button
            let cpy_button = code.getElementsByClassName('code-copy')[0];
            let run_button = cpy_button.cloneNode(true);
            run_button.addEventListener('click', () => {
                console.log(code_text);
                try{
                    __BRYTHON__.runPythonSource(code_text, id);
                } catch(e) {
                    document.getElementById(id + '_output').innerHTML += '\nError: 因错误而退出\n';
                    document.getElementById(id).hidden = false;
                    console.log(e);
                }
            });
            run_button.getElementsByClassName('code-copy-text')[0].innerText = '运行代码';
            insert_after(run_button, cpy_button);
        }
    }, 2000);
    localStorage.setItem('last_time', last_time);
}).observe(document.querySelector('#DIALOGUE_CONTAINER_ID'), {
    childList: true,
    subtree: true,
    characterData: true
});