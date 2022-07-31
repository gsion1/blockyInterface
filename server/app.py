import shutil
from flask import Flask, redirect, url_for, render_template, request, flash, send_from_directory
import os
import random
import time
from mqtt import *
import threading
import werkzeug
import subprocess

app = Flask(__name__)
mqttModule = mqtt()

folders = ["examples/","your_seq/"] #used to store seqeunces

@app.route('/')
def pages(name=None):
    return render_template('index.html', name=name)

@app.route('/listFile')
def listFiles():
    string = ""
    for folder in folders:
        files = os.listdir(folder)
        
        for file in files:
            string += str(folder) + file.replace(".txt","")+","
    return string

@app.route('/start', methods=['GET'])
def startSequence():
    whichOne = request.args.get('c', '')
    buttons = mqttModule.scanButton(whichOne+".txt")
    mqttModule.setImportantButton('PLAY',True) #force state change 
    t1 = threading.Thread(target=mqttModule.readFileAndSendCmd, args=(whichOne+".txt",))
    #htmlbuttons = htmlForSequence(buttons)
    t1.start()
    return render_template("startSequence.html", buttons=buttons)
    #return "Sequence "+ whichOne + " started<br>" + htmlbuttons

@app.route('/button', methods=['GET'])
def buttonCliked():
    whichOne = request.args.get('b', '')
    if mqttModule.setButton(whichOne) :
        return "Button " + whichOne + " clicked"
    if mqttModule.seqenceState == "PAUSE":
        return "Can't set a button while paused, please press 'PLAY' button first"
    if mqttModule.seqenceState == "OVER":
        return "You reach the end of the sequence, please restart it to continue"
    return "Sequence has been stopped by you"

@app.route('/importantButton', methods=['GET'])
def importantButtonCliked():
    whichOne = request.args.get('b', '')
    cmds = ['STOP', 'PLAY', 'PAUSE']
    res = ["Stopping the sequence ...", "Let's continue our work", "Click play to continue"]
    if whichOne in cmds:
        if mqttModule.setImportantButton(whichOne):
            return res[cmds.index(whichOne)]
        return "Cannot PLAY after being stopped or if the sequence is over. Restart the sequence first"
    return "Sorry there is an error, could you retry?" #Should not be here

@app.route('/update')
def updateRepo(): #maybe not the safest thing, for test purposes
    try:
        subprocess.check_call(['git', 'pull'])
        return "Updating ... You will have to manually reboot then. Just give us ten minutes"
    except subprocess.CalledProcessError:
        return "There is an error. Is the device connected to internet ?"
    
@app.route('/saveSeq', methods=['GET','POST'])
def saveSeqFromClient():
    #imported from computer
    if request.method == 'POST':  
        f = request.files['file']
        print(f)
        if f != None:
            if f.endswith(".txt"):
                f.save("your_seq/"+werkzeug.utils.secure_filename(f.filename))
                return 'Everything is okay ! Redirecting <meta http-equiv="refresh" content="5; URL=/">'
            return "Sorry, .txt only"
        return "Please select a file"

    #generated from blockly
    if request.method == 'GET':
        file = request.args.get('file', '')
        filename = request.args.get('filename', '')
        sensitiveChar = ["..","/","~"] #these char can be harmful if executed with rm command
        for c in sensitiveChar:
            filename = filename.replace(c, "")

        filename = filename.replace("%20", " ") #transformed by get request
        file = file.replace("%20", " ") 

        if filename == "":
            filename = "NoName_"+str(random.randint())

        filename = "your_seq/"+filename+".txt"
        if os.path.exists(filename):
            print("This file already exists")
            return "This file already exists, please manually delete it first"

        text_file = open(filename, "w")
        file = file.replace("<code>","")
        file = file.replace("</code>","\n")
        text_file.write(file)
        text_file.close()
        return 'Everything is okay ! Redirecting <meta http-equiv="refresh" content="5; URL=/">'

    return "An error has occured"

@app.route('/delSeq', methods=['GET'])
def delSeq():
    try:
        whichOne = str(request.args.get('s', ''))
        whichOne = whichOne.replace("%20"," ") #get request spaces
        sensitiveChar = ["..","/","~"] #these char can be harmful if executed with rm command
        for c in sensitiveChar:
            whichOne = whichOne.replace(c, "")
        whichOne = "your_seq/"+whichOne+".txt"
        os.remove(whichOne)
        print(whichOne)
        return "File removed"
    except:
        return "There is an issue. Maybe the file is already deleted"
    
#import seq from usb key
@app.route('/importFromUsb', methods=['GET'])
def importSeqFromUsb():
    try:
        for root, dirs, files in os.walk("/media"):
            print(dirs)
            for d in dirs:
                if d.find("Thingva") != -1:
                    path = os.path.join(root, d)
                    print("Thingva found", path)
                    files=os.listdir(path)
 
                    for fname in files:
                        try:
                            filepath = os.path.join(path,fname)
                            newpath = os.path.join("your_seq/",fname)
                            if not os.path.isfile(newpath):
                                shutil.copy2(filepath,"your_seq/")
                            else :
                                return "Cannot copy "+fname+" because it already exists"
                        except Exception as ex:
                            return "Cannot copy "+fname+" for an unknown reason"
                    return 'Files copied'
                
        return "There is an issue. Did you connect the usb key ?"
 
    except Exception as e:
        print(e)
        return "An unknown error occured"

if __name__ == '__main__':
    time.sleep(1)
    app.run()
