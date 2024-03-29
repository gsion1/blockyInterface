
//fetch connected devices from the server
function updateDevices(){
    const request = new XMLHttpRequest();
    request.open('POST', `/devices2`);
    request.onload = () => {
        const response = request.responseText;
        arrangeDevices(response);
    }; 
    request.send();
};

function arrangeDevices(data){
    var dev = JSON.parse(data);
    console.log(dev, data)
    stringDev = ""
    for (const key in dev){
          console.log(`${key} -----> ${dev[key]}`)
          if(dev[key]['type'].search("actuator") != -1){
            stringDev += `<span class="devices actuator" title="This is an actuator">${key}`

            if(dev[key]['pos'] != "X")  //position if not defined yet
                stringDev += `<span style="color:gray"> Pos: ${dev[key]['pos']}</span>`

            stringDev +=`</span>`

          }
            
          else 
            stringDev += `<span class="devices button" title="This is a button">${key}</span>`
      }
    lastDev = document.getElementById('devicesDiv')
    if(lastDev != stringDev){
        document.getElementById('devicesDiv').innerHTML = stringDev 
    }
    
}



//make more user friendly the last command sent by the server to the devices
function humanReadableLastCmd(cmd){
    //to be completed
    if(cmd.search("=$") != -1){ //movement command, should not be displayed for a long time
        lastPause = -1;
        let data = cmd.split("=")
        let params = data[1].split(",")
        return `${data[0]} is reaching position ${params[2]} with speed ${params[3]}`
    }
    if(cmd.search("Pause") != -1){ //pause command
        let data = cmd.split("=")
        let t = data[1] // time in sec
        
        let s = t%60;
        let h = t / 3600;
        let m = (t - h*3600)/60;

        if(lastPause != t) //refresh only if the command has changed
            countdown = t; // in sec

        lastPause = t;
        document.getElementById("popupAction").style.display = "block"

        return `Paused for ${h<0? h.toString()+"hours ":""} ${m<0? m.toString()+"minutes  and":""} ${s} sec`
    }
    if(cmd.search("WaitForButton") != -1){ //wait for button command
        let data = cmd.split("=")

        //show a big button in the center of the display

        if(enableFocus && lastPause != data[1])
            toggleFocus(1,['fuzzy','focusButtonDiv'])
        document.getElementById("focusBut").href=`/button?b=${data[1]}`;
        document.getElementById("focusBut").innerHTML=`${data[1]}`;
        lastPause = data[1];

        return `Please press button ${data[1]}`
    }
    return cmd
}

function decreaseCountdown(){
    console.log("countdown", countdown)
    if(countdown > 1) 
        countdown -= 1;
    else 
        document.getElementById("popupAction").style.display = "none"

    let s = countdown%60;
    let h = countdown / 3600;
    let m = (countdown - h*3600)/60;
    document.getElementById("countdown").innerHTML = `${h<0? h.toString()+"h ":""} ${m<0? m.toString()+"m":""} ${s}s`;
}

//fetch the last commands from the server
function updateLastCmd(){
    const request = new XMLHttpRequest();
    request.open('POST', `/lastCmd`);
    request.onload = () => {
        const response = request.responseText;
        lastCommand = humanReadableLastCmd(response);
        document.getElementById('lastCmd').innerHTML = lastCommand;
        console.log(response)
    }; 
    request.send();
};


