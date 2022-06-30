/*function listFiles(){
    //const files = require('/listFile'); 
    //console.log(files);
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            files = xhr.responseText.split(",")
    
            for(f of files){
                links = `<a href="/start?c=${f}"></a><br>`
            }
            document.getElementById("fileList").innerHTML =links;
    
            //document.getElementById('placeholder').innerHTML = xhr.responseText;
        }
    }
    xhr.open('GET', 'listFile');
    xhr.send();
}*/