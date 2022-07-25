
/**
 * Toggle the visibility of an element
 * @param {string} idOfTheElement 
 * @return {number} The new state : 0 for display :none, 1 for display : block
 */
function toggleVisibility(idOfTheElement){
    if(document.getElementById(idOfTheElement).style.display != "block"){
        document.getElementById(idOfTheElement).style.display = "block"
        return 1
    }else {
        document.getElementById(idOfTheElement).style.display = "none"
        return 0
    }
}

function toggleEditor(){
    let state = toggleVisibility('blocklyPopup');
    let txt = ['✎ Open editor', '✖ Close editor']
        document.getElementById('openCloseBlockly').value = txt[state]
}