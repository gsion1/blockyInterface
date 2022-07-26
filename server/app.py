from shutil import which
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
    # handle the POST request
    if request.method == 'POST':
        f = request.files['file']
        print(f)
        if f != None:
            if f.endswith(".txt"):
                f.save("your_seqs/"+werkzeug.utils.secure_filename(f.filename))
                return 'Everything is okay ! Redirecting <meta http-equiv="refresh" content="5; URL=/">'
            return "Sorry, .txt only"
        return "Please select a file"
    return "An error has occured"

if __name__ == '__main__':
    time.sleep(1)
    app.run()
