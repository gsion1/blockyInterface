
/**
 * Toggle the visibility of an element
 * @param {string} idOfTheElement 
 * @return {number} The new state : 0 for display :none, 1 for display : block
 */
function toggleVisibility(idOfTheElement){
    if(document.getElementById(idOfTheElement).style.maxWidth != "100%"){
        document.getElementById(idOfTheElement).style.maxWidth = "100%"
        document.getElementById(idOfTheElement).style.overflow = "scroll"
        return 1
    }else {
        document.getElementById(idOfTheElement).style.maxWidth = "0%"
        document.getElementById(idOfTheElement).style.overflow = "hidden"
        return 0
    }
}

function toggleEditor(){
    let state = toggleVisibility('blocklyPopup');
    let txt = ['✎ Open editor', '✖ Close editor']
        document.getElementById('openCloseBlockly').value = txt[state]
}

/**************** TABS ****************/
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    if(evt != undefined)
      evt.currentTarget.className += " active";
  }

  function openTabStartUp(){
    var url = window.location.href;
    var tab = 0
    try{
        let searchParams = new URLSearchParams(url);
        var tab = parseInt(searchParams.get("tab"));
        if(isNaN(tab)){ tab = 0}
    }
    finally {
        document.getElementsByClassName('tablinks')[tab].click() //open tab
    }
}

/**
 * toggle visibility of elements
 * @param {*} state display 1 hide 0
 * @param {array} elts array of ids to toggle
 */
function toggleFocus(state,elts){
    for(e of elts){
        if(state == 0)
            document.getElementById(e).style.display = "none";
        if(state == 1)
            document.getElementById(e).style.display = "block";
        
    }
}