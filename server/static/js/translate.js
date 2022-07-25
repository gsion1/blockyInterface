/**
 * 
 * @param {*} blockList 
 * @returns {number} 0 on error, 1 on success
 */
function translateBlockyToFile(blockList){
    //console.log("start translating")
    output = ""

    document.getElementById("err_div").innerHTML = "";  //reset err and code div
    document.getElementById("code_div").innerHTML = "";

    for(k of Object.keys(blockList)){
        elt = Blockly.getMainWorkspace().getBlockById(k)
        //console.log(elt, elt.type)
        /*if(elt.type == 'controls_repeat'){
            code += "LOOP="+elt.getFieldValue('TIMES') + "</br>"
            children = data[k]
            for(child of Object.keys(children)){
                c_elt = Blockly.getMainWorkspace().getBlockById(child)
                code +=  writeLine(c_elt,1) //????
            }
        }*/
        let line = writeLine(elt,1)
        if(line != "err"){
            output += line;
        } else {
            return 0;
        }
        
    }
    console.log(output)
    document.getElementById('code_div').innerHTML = output    
}

function extractFromWaitBlock(data){
    elt.getFieldValue('delay')
}   

/**
 * Convert a blockly element to txt line
 * @param {*} elt 
 * @param {*} separator 
 * @returns {string} String to be interpreted by the server
 */
function writeLine(elt, separator){
    let err = 0;

    if(elt.type == '3Voies'){
        line = `$1,${elt.getFieldValue('id')},${elt.getFieldValue('pos')}`
        line += "*"+ calcChecksum(line).toString()
        line = `${elt.getFieldValue('mqtt')}=${line}`
    } else if(elt.type == 'actionneur'){
        line = `$1,${elt.getFieldValue('id')},${elt.getFieldValue('pos')},${elt.getFieldValue('speed')},80,23`
        line += "*"+ calcChecksum(line).toString()
        line = `${elt.getFieldValue('mqtt')}=${line}`
    } else if(elt.type == 'atTheSameTime'){
        line = `ATTHESAMETIME l=`
        let children = elt.childBlocks_
        if(children.length == 0){
            translationErr("\"At the same Time\" block cannot be empty");
            err = 1;
        }
        if( !err ){
            for(child of children){
                if((child.type == "actionneur" || child.type == "3Voies") && !err) //not pause in this block, we can't pause while doing anothe thing
                {   
                    //console.log("hey", child.type)
                    line += writeLine(child,0)
                }
                else {
                    translationErr("You can only place blocks from move tab in a \"At the same Time\" block")
                    err = 1;
                }
            }
        }
        
        //write only one line to be executed at the same time "l" is the line to be sent
    } else if(elt.type == 'loopForever'){
        let children = elt.childBlocks_
        //console.log("children",children)
        line = `LOOPFOREVER`
        for(child of children){
            console.log("child",child)
            line += writeLine(child,0)
        }
        //be careful, everything after this block won't execute

    }  else if(elt.type == 'sync'){
        let children = elt.childBlocks_
        console.log("elt.childBlocks_",elt.childBlocks_)
        console.log("elt.",elt)
        line = `SYNC`
        for(child of children){
            //console.log("chiiiiiiiillllld")
            if(child.type == "actionneur"  && !err){
                //console.log("child",child)
                line += writeLine(child,0)
            } else {
                translationErr("You can only place \"actuator\" blocks in a \"synchronize\" one")
                err=1
            }
            
        }
        
    } else if(elt.type == 'waitS'){
        line = `Pause=${elt.getFieldValue('delay')}`
        //code += "S,"+elt.getFieldValue('delay') + "</br>"
    } else if(elt.type == 'waitM'){
        line = `Pause=${elt.getFieldValue('delay')*60}`
        //code += "M,"+elt.getFieldValue('delay') + "</br>"
    } else if(elt.type == 'waitH'){
        line = `Pause=${elt.getFieldValue('delay')*3600}`
        //code += "H,"+elt.getFieldValue('delay') + "</br>"
        
    } else if(elt.type == 'waitButton'){
        line = `WaitForButton=${elt.getFieldValue('button')}`

    } else if(elt.type == 'home') {
        line = `HOMEALL`
    }
    else if(elt.type == 'homeOne') {
        line = `${elt.getFieldValue('mqtt')}=$3,1,h*106`
    }

    //return code
    return  line + (separator?"<br>":"")
}

/**
 * Compute the checksum for the actuators 
 * @param {string} str 
 * @returns {number} checksum
 */
function calcChecksum(str){
    let chksum = 0;
    for(let c of str){
        if(c != "$") //ignore $
            chksum = chksum ^ c.charCodeAt(0);
    }
    return chksum
}

function testPurposes(){
    res = ""
    for(i=5; i<250; i+=6){
        str = `$1,0,${i.toString()},300,100,23`
        chk = calcChecksum(str).toString()
        res += `WaitForButton=Savon\nLineaire-1=${str}*${chk}\n`
        
    }console.log(res)
}

/**
 * Display the error in code div
 * @param {String} text 
 */
function showError(text){
    //document.getElementById("err_div").
    document.getElementById("code_div").innerHTML = "<code>ERROR</code><code>"+text+"<code>";
}
