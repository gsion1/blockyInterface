from shutil import which
from flask import Flask, redirect, url_for, render_template, request, flash, send_from_directory
import os
import random
import time
from mqtt import *



app = Flask(__name__)
mqttModule = mqtt()


@app.route('/')
@app.route('/js/<name>')
def pages(name=None):
    return render_template('index.html', name=name)

@app.route('/listFile')
def listFiles():
    files = os.listdir("templates/s/")
    str = ""
    for file in files:
        str += file.replace(".txt","")+","
    return str

@app.route('/start', methods=['GET'])
def startSequence():
    whichOne = request.args.get('c', '')
    mqttModule.readFileAndSendCmd(whichOne+".txt")
    return "Sequence "+ whichOne + " started"

@app.route('/button', methods=['GET'])
def buttonCliked():
    whichOne = request.args.get('b', '')
    return "Button " + whichOne + " clicked"

if __name__ == '__main__':
    
    time.sleep(5)
    
    app.run()