
function writeCmd_3v(elt){
    line = `$1,${elt.getFieldValue('id')},${elt.getFieldValue('pos')}`
    line += "*"+ calcChecksum(line).toString()
    line = `${elt.getFieldValue('mqtt')}=${line}`
    
    return line
}

function writeCmd_actuator(elt, loopValue){
    line = `$1,${/*elt.getFieldValue('id')*/0},${elt.getFieldValue('pos')},${elt.getFieldValue('speed')},80,23`
    if(loopValue != undefined) {   //if called by a loop block
        line = line.replaceAll("i",loopValue.toString())
    }
    line += "*"+ calcChecksum(line).toString()
    line = `${elt.getFieldValue('mqtt')}=${line}`
    return line
}

function writeCmd_home(elt){
    if(elt.getFieldValue('dir') == "1")
        line = `${elt.getFieldValue('mqtt')}=$3,0,1*50`
    else
        line = `${elt.getFieldValue('mqtt')}=$3,0,-1*31`
    return line
}

function writeCmd_wait(elt){
    if(elt.type == 'waitS')
        line = `Pause=${elt.getFieldValue('delay')}`
    else if(elt.type == 'waitM')
        line = `Pause=${elt.getFieldValue('delay')*60}`
    else if(elt.type == 'waitH')
        line = `Pause=${elt.getFieldValue('delay')*3600}`
    else if(elt.type == 'waitButton')
        line = `WaitForButton=${elt.getFieldValue('button')}`
    return line
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