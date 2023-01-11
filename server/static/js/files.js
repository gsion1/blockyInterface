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
    
            links_examples = ""
            links_yourSeq = ""
            for(f of files){
                if(f.search("examples/") != -1)
                    links_examples += `<a href="/start?c=${f}" class="sequenceToPlay" target="iframeSequences">${f.replace("examples/","")}</a><br>`
                if(f.search("your_seq/") != -1)
                    links_yourSeq += `<div class="filePlusTrashDiv"><a href="/start?c=${f}" class="sequenceToPlay" target="iframeSequences">${f.replace("your_seq/","")}</a><button class="trashCan" onclick="askToDeleteSeq('${f.replace("your_seq/","")}')"></button></div><br>`
            }
            links_yourSeq += "<iframe width='100%' frameBorder='0' height='50' name='iframedelSeq' src=''></iframe>"
            links_yourSeq += `<a href="/importFromUsb" class="sequenceToPlay" id='buttonImportFromUsb' onclick='setTimeout(() => {listFiles()},"500");' target="iframedelSeq">Import from USB drive</a>`
            document.getElementById("fileListExamples").innerHTML = links_examples;
            document.getElementById("fileListYourSeq").innerHTML = links_yourSeq;
        }
    }
    xhr.open('GET', 'listFile');
    xhr.send();
}

/**
 * Save the sequence on your device as txt file, not blocks
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

/**
 * Remove a user sequence from the list
 * @param {string} filename 
 */
//todo push response in iframe
function askToDeleteSeq(filename){
    console.log(filename) 
    if(confirm("Would you like to delete " +filename.toString())){
        const link = document.getElementById('delSeqA');
        link.href = `/delSeq?s=${filename.toString()}` // Your URL
        link.target = "iframedelSeq"
        link.click();
        console.log("removing seq from server", filename.toString())
        alert("File removed")
        setTimeout(listFiles(), 1000) // refresh list
    }
}

/**
 * Save sequanec on the derver directly as txt file
 * @returns 
 */
function saveSequenceOnServerAsTxt(){
    let filename = document.getElementById('saveSeq_seqName').value
    if (filename == ""){
        showError("Please specify a filename. Now generate the code again and save it")
        return 0
    }
    let seq = document.getElementById('codeOutput').innerHTML
    
    var a = document.createElement('a');
    a.href = `/saveSeq?filename=${filename.toString()}&file=${seq.toString()}`;
    a.click()

    return 1

}
