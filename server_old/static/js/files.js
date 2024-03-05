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
                    links_examples += `<div class="filePlusTrashDiv"><a href="/start?c=${f}" class="sequenceToPlay" target="iframeSequences" onclick='enableFocus=1;'>${f.replace("examples/","")}</a>
                    <button class="viewBut" onclick="editSeq('examples','${f.replace("examples/","")}')"></button>
                    </div><br>`
                if(f.search("your_seq/") != -1)
                    links_yourSeq += `<div class="filePlusTrashDiv"><a href="/start?c=${f}" class="sequenceToPlay" target="iframeSequences" onclick='enableFocus=1;'>${f.replace("your_seq/","")}</a>
                    <button class="trashCan" onclick="askToDeleteSeq('${f.replace("your_seq/","")}')"></button>
                    <button class="editBut" onclick="editSeq('your_seq','${f.replace("your_seq/","")}')"></button>
                    </div><br>`
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

function editSeq(dir,fname){
    var xhr = new XMLHttpRequest(dir,fname);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            data = xhr.responseText.split("@") 
            fileContent = data[1].replace('</br>','\n')   
            filename = data[0]

            document.getElementById("textEditor").innerHTML = fileContent
            document.getElementById("textEditorFilename").value = filename
            toggleFocus(1,["fuzzy","textEditorDiv"])
        }
    }
    xhr.open('GET', `readFile?f=${fname}&d=${dir}`);
    xhr.send();
}

function saveEditedSeq(){
    let filename = document.getElementById('textEditorFilename').value;
    if (filename == ""){
        document.getElementById("textEditorFilename").backgrounColor = "red";
    }
    let seq = document.getElementById('textEditor').value.replace(/\n\r?/g, '</br>');;
    console.log("-->",seq)
    if(seq.search("#") != -1){
        document.getElementById('textEditorError').innerHTML = 'Unsupported "#" character';
        setTimeout(function(){
            document.getElementById('textEditorError').innerHTML = '';
        },5000);
        return 0
    }   
    saveSequenceOnServerAsTxt(filename, seq,1); //force overwrite
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

