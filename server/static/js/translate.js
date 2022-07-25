/**
 * 
 * @param {*} blockList 
 * @returns {number} 0 on error, 1 on success
 */

function translateBlocksToTxt(blockList){
    output = ""

    for(k of Object.keys(blockList)){
        elt = Blockly.getMainWorkspace().getBlockById(k)
        
        let line = writeLine(elt)
        if(line != 0){
            output += "<code>"+line+"</code>";
        } else {
            return 0;
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
        //console.log("==>", elt.getChildren())  
        //console.log("==>", elt.getDescendants())
        let children = getChildren(elt)//childBlocks_  // not working
        if(children == 0)
            return 0

        console.log("children",children)
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
                    showError("Your for loop is invalid or there is more than 2k iterations")
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
                    showError("Your for loop is invalid or there is more than 2k iterations")
                    return 0
                }
            } 
        }
        

    }
    else if(elt.type == 'atTheSameTime'){
        /*line = `ATTHESAMETIME l=`
        let children = elt.childBlocks_
        if(children.length == 0){
            showError("\"At the same Time\" block cannot be empty");
            err = 1;
        }
        if( !err ){
            for(child of children){
                if((child.type == "actionneur" || child.type == "3Voies") && !err) //not pause in this block, we can't pause while doing anothe thing
                {   
                    //console.log("hey", child.type)
                    line += writeLine(child)
                }
                else {
                    showError("You can only place blocks from move tab in a \"At the same Time\" block")
                    err = 1;
                }
            }
        }*/
        showError("ERROR - Not yet implemented")
        return 0
        
    } else if(elt.type == 'loopForever'){
        let children = elt.childBlocks_
        //console.log("children",children)
        line = `LOOPFOREVER`
        for(child of children){
            console.log("child",child)
            line += writeLine(child)
        }
        //be careful, everything after this block won't execute

    }  else if(elt.type == 'sync'){
        let children = elt.childBlocks_
        console.log("elt.childBlocks_",elt.childBlocks_)
        console.log("elt.",elt)
        line = `SYNC`
        for(child of children){
            if(child.type == "actionneur"){
                line += writeLine(child)
            } else {
                showError("You can only place \"actuator\" blocks in a \"synchronize\" one")
                return 0
            }
            
        }
    /******************  WAIT CMDS *********************/
    } else if(["waitS","waitM", "waitH", "waitButton"].includes(elt.type)){
        line = writeCmd_wait(elt)

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
    
    showError("ERROR - There is one empty block")
    return 0
    
        
}


function testPurposes(){
    res = ""
    for(i=5; i<250; i+=6){
        str = `$1,0,${i.toString()},300,100,23`
        chk = calcChecksum(str).toString()
        res += `WaitForButton=Savon\nLineaire-1=${str}*${chk}\n`
        
    }console.log(res)
}


