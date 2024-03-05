/**
 * Convert blocks to txt sequence
 * @returns {number} 1 on success
 */
 function parseBlockly(){
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
    saveBlocks()

    blockList = {}  //reset var
    try {
        parseNext(json.blocks.blocks[0]) //parse all blocks after the starting one

    }
    catch {
        showError("Please place at least one block")
        return 0
    }
        

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

    var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var data = Blockly.Xml.domToPrettyText(xmlDom);
    document.getElementById("blockly-json").value = data;
}

/**
 * Load a block sequences from a file stored on client
 * @example <input type="file" onchange="loadBlocks(this)" value="Load">
 */
function loadBlocks(data){
    var xml = data
    if (typeof xml != "string" || xml.length < 5) {
        return false;
    }
    try {
        var dom = Blockly.Xml.textToDom(xml);
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, dom);
        return true;
    } catch (e) {
        console.log(e)
        return false;
    }
}

/**
 * Display the error in code div
 * @param {String} text 
 */
 function showError(text){
    //document.getElementById("err_div").
    document.getElementById("blockly-error").innerHTML = text;
}