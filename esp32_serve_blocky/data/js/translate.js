function translateBlockyToFile(data){
    console.log("strat translating")
    code = ""
    looping = 0
    for(k of Object.keys(data)){
        elt = Blockly.getMainWorkspace().getBlockById(k)
        console.log(elt, elt.type)
        if(elt.type == 'controls_repeat'){
            code += looping+",L"+elt.getFieldValue('TIMES') + "</br>"
            looping =1;
            children = data[k]
            for(child of Object.keys(children)){
                c_elt = Blockly.getMainWorkspace().getBlockById(child)
                code +=  writeLine(c_elt, looping)
            }
            looping = 0
        }
        code +=  writeLine(elt, looping)
        
    }
    console.log(code)
    document.getElementById('code_div').innerHTML = code

    /*send it to esp*/
    
}

function extractFromWaitBlock(data){
    elt.getFieldValue('delay')
}

function writeLine(elt, looping){
    code = looping+","
    //code = "_,".repeat(looping)

    if(elt.type == '3Voies'){
        code += "V,"+elt.getFieldValue('id') + ",P,"+elt.getFieldValue('pos') + "</br>"
    } else if(elt.type == 'actionneur'){
        code += "A,"+elt.getFieldValue('id') + ",P,"+elt.getFieldValue('pos') + "</br>"
    } else if(elt.type == 'waitS'){
        code += "S,"+elt.getFieldValue('delay') + "</br>"
    } else if(elt.type == 'waitM'){
        code += "M,"+elt.getFieldValue('delay') + "</br>"
    } else if(elt.type == 'waitH'){
        code += "H,"+elt.getFieldValue('delay') + "</br>"
    }
    return code
}