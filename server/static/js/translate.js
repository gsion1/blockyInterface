let continueToLoop = true
/**
 * 
 * @param {*} blockList 
 * @returns {number} 0 on error, 1 on success
 */

function translateBlocksToTxt(blockList){
    output = ""
    continueToLoop = true
    for(k of Object.keys(blockList)){
        elt = Blockly.getMainWorkspace().getBlockById(k)
        if(continueToLoop){
            let line = writeLine(elt)
        
            if (line != 0){
                output += line;
            }     
            else {
                return 0;
            }   
        }
    }
    console.log(output)
    document.getElementById('codeOutput').innerHTML = output

    return 1
}

/**
 * Convert a blockly element to txt line
 * @param {*} elt 
 * @returns {string} String to be interpreted by the server
 */
function writeLine(elt, loopValue=undefined){
    line = ""
    /****************** DO MOVES ON ACTUATORS ********************/
    if(elt.type == '3Voies')
        line = writeCmd_3v(elt)
    else if(elt.type == 'actuator')
        line = writeCmd_actuator(elt,loopValue)
    
    /******************  LOOPs and CONDITIONS ******************/
    else if(elt.type == "for"){
        let children = getChildren(elt)//childBlocks_  // not working
        if(children == 0){
            showError(T['Please place blocks inside Count with block'])
            return 0
        }
        startVal = parseFloat(elt.getFieldValue('startValue'))
        stopVal = parseFloat(elt.getFieldValue('stopValue'))
        inc = parseFloat(elt.getFieldValue('increment'))
        counter = 0;

        if(inc >= 0) {
            for(i = startVal; i < stopVal; i+= inc){
                for(child of children){
                    console.log("child",child)
                    line += writeLine(child, i)
                }
                counter ++;
                if(counter > 2000){ //timeout, maybe an error
                    showError(T["Your for loop is invalid or there is more than 2k iterations"])
                    return 0
                }
            }
        } else {
            for(i = startVal; i > stopVal; i-= Math.abs(inc)){
                for(child of children){
                    console.log("child",child)
                    line += writeLine(child, i)

                }
                counter ++;
                if(counter > 2000){ //timeout, maybe an error
                    showError(T["Your for loop is invalid or there is more than 2k iterations"])
                    return 0
                }
            } 
        }
    }
    else if(elt.type == 'for_simple'){
        let children = getChildren(elt)
        if(children == 0){
            showError(T['Please place blocks inside Repeat block'])
            return 0
        }
        stopVal = parseFloat(elt.getFieldValue('stopValue'))

        for(let i=0; i< stopVal; i++){
            for(child of children){
                console.log("child",child)
                line += writeLine(child, i)
            }
        }
    }
    else if(elt.type == 'atTheSameTime'){
        showError(T["ERROR - Not yet implemented"])
        return 0
        
    } else if(elt.type == 'loopForever'){
        let children = getChildren(elt)
        //console.log("children",children)
        line = `LOOPFOREVER=true`
        for(child of children){
            console.log("child",child)
            line += writeLine(child)
        }
        //be careful, everything after this block won't execute
        continueToLoop = false
    }  else if(elt.type == 'sync'){
        showError(T["ERROR - Not yet implemented"])
        return 0
    /******************  WAIT CMDS *********************/
    } else if(["waitS","waitM", "waitH", "waitButton"].includes(elt.type)){
        let cmd = writeCmd_wait(elt)
        if(cmd == 0)
            return 0

        line = cmd
        
    /******************** HOMING ****************/
    } else if(elt.type == 'home') {
        //line = `HOMEALL` //not safe to be implemented yet. Not all actuators should be homed in the same direction
    }
    else if(elt.type == 'homeOne') {
        line = writeCmd_home(elt)
    }

    //return code
    return  "<code>"+line+"</code>"
}

/**
 * Get children inside a block
 * @param {*} elt 
 * @returns {list} List of children
 */
function getChildren(elt){
    let descendants = elt.getDescendants(1)
    let children = []
    if(descendants.length > 0){
        for(d of descendants){
            sParent = d.getSurroundParent()
            if(sParent != null) {
                console.log( elt.id)
                console.log(sParent)
                if(sParent.id == elt.id){
                    console.log("parent")
                    children.push(d)
                }
            }
        }
        return children
    }
    showError(T["There is at least one empty block"])
    return 0
}


function testPurposes(){
    res = ""
    for(i=5; i<250; i+=6){
        str = `$1,0,${i.toString()},300,100,23`
        chk = calcChecksum(str).toString()
        res += `WaitForButton=Savon\nLineaire-1=${str}*${chk}\n`
        
    }
    console.log(res)
}
