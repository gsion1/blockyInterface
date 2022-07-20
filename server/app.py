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
    t1 = threading.Thread(target=mqttModule.readFileAndSendCmd, args=(whichOne+".txt",))
    #htmlbuttons = htmlForSequence(buttons)
    t1.start()
    return render_template("startSequence.html", buttons=buttons)
    #return "Sequence "+ whichOne + " started<br>" + htmlbuttons

@app.route('/button', methods=['GET'])
def buttonCliked():
    whichOne = request.args.get('b', '')
    mqttModule.setButton(whichOne)
    return "Button " + whichOne + " clicked"

@app.route('/update')
def updateRepo(): #maybe not the safest thing, for test purposes
    try:
        subprocess.check_call(['git', 'pull'])
        return "Updating ... You will have to reboot then. Just give us ten minutes"
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
