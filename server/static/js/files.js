function importSequence(){
    
}


/**
 * Ask the server for sequences stored on it
 */
function listFiles(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            files = xhr.responseText.split(",")
    
            links = ""
            for(f of files){
                //links += `<a href="/start?c=${f}" target="iframeSequences" onclick="setTimeout(\"clearIframe('iframeSequences')\",4000)">${f}</a><br>`
                links += `<a href="/start?c=${f}" target="iframeSequences">${f}</a><br>`
            }
            //links += '<iframe id="iframeSequences" src="" name="iframeSequences" width="100%" height="100px" frameborder="0"></iframe>'
            document.getElementById("fileList").innerHTML = links;
    
            //document.getElementById('placeholder').innerHTML = xhr.responseText;
        }
    }
    xhr.open('GET', 'listFile');
    xhr.send();
}

/**
 * Save the sequence on server as txt file, not blocks
 */
function saveSequenceOnServer(){
    var json = Blockly.serialization.workspaces.save(Blockly.getMainWorkspace());
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));

    var a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = 'sequence.json';
    a.innerHTML = 'download JSON';
    a.click()
}