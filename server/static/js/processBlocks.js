/**
 * Convert blocks to txt sequence
 * @returns {number} 1 on success
 */
 function generateSequenceFromBlocks(){
    //get the blocks from blockly
    //var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
    var json = Blockly.serialization.workspaces.save(Blockly.getMainWorkspace())
    var blocks = Blockly.getMainWorkspace().getTopBlocks();

    //disallow two starting blocks or we won't be able to know which one to choose
    //we can't "parallize", there is no sense 
    if(blocks.length > 1){
        showError("There can be only one starting block")
        console.log("too much starting blocks")
        return 0
    }

    //save
    //var state = Blockly.serialization.blocks.save(blocks[0], {addCoordinates: false, doFullSerialization: true});

    blockList = {}  //reset var
    parseNext(json.blocks.blocks[0]) //parse all blocks after the starting one
    console.log(blockList)

    //parseChild(json.blocks.blocks)
    
    console.log(blockList)
    translateBlocksToTxt(blockList)
    return 1
}

/**
 * Parse next blockly block until there is no more
 * @param {blockly block} data 
 */
function parseNext(block){
    console.log("next",block.next)
    blockList[block.id] = ""
    if(block.next != undefined){
        parseNext(block.next.block)
    }
}
/**
 * Parse all the childs of the given block, usually the first block
 * @param {*} blocks 
 */
/*
function parseChild(blocks){
            
    for(b of blocks) {
        if(b.type == 'controls_repeat' || b.type=="sync"){
            temp = {}
            parseNext(b.inputs.DO.block)
            blockList[b.id] = {...temp}
            //list = parseAllChildren()
            //console.log("alle",list)
        }
    }

}*/

/**
 * Save blockly as JSON file on the client
 */
function saveBlocks(){
    var json = Blockly.serialization.workspaces.save(Blockly.getMainWorkspace());
    var data = JSON.stringify(json)//"text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));

    var a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = 'sequence.json';
    a.innerHTML = 'download JSON';
    a.click()
}

/**
 * Load a block sequences from a file stored on client
 * @example <input type="file" onchange="loadBlocks(this)" value="Load">
 */
function loadBlocks(e){

    // getting a hold of the file reference
    //var file = e.target.files[0]; 
    var file = e.files[0]; 

    // setting up the reader
    var reader = new FileReader();
    reader.readAsDataURL(file); // this is reading as data url

    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
        var content = readerEvent.target.result; // this is the content!
        console.log(content)
        console.log(JSON.parse(content))
        //document.querySelector('#content').style.backgroundImage = 'url('+ content +')';
        Blockly.serialization.workspaces.load(content);
    }
}

/**
 * Display the error in code div
 * @param {String} text 
 */
 function showError(text){
    //document.getElementById("err_div").
    document.getElementById("codeOutput").innerHTML = "<code>ERROR</code><code>"+text+"<code>";
}