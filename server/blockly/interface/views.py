from django.http import HttpResponse, Http404, FileResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.views.decorators.clickjacking import xframe_options_exempt
from django import template
from django.contrib.staticfiles import finders
import time
import shutil
from threading import Thread, Event
import json
#import paho.mqtt.client as mqtt
from blockly import mqtt
from django.http import JsonResponse
from django.conf import settings
from os import listdir
from os.path import isfile, join
import os

from blockly.mqtt import mqttClient as mqtt_client
from .modules import run_sequence as SeqManager

mqtt_client = mqtt.mqttClient()
seq = SeqManager.SeqManager()

def home(request):
    """if request.method =='POST':
        success = auth.authenticate_user(request)
        if success:
            return redirect('home')
    
    print("auth", success)"""
    seq.tests()
    template = loader.get_template("index.html")
    context = {}
    return HttpResponse(template.render(context, request))

def start_file(request, dir, fileName):
    if request.method == 'GET':
        res, err = seq.startSeq(dir, fileName)
        if res:
            return HttpResponse("ok")
        return HttpResponse("ko: " + err)

def simple_scheduler(request): #sorry
    if not seq.scheduler_on:
        seq.scheduler_on = True
        print("starting scheduler")
        while True:
            seq.loop()
            time.sleep(0.1)
    return HttpResponse("ok")

#Buttons from web interface
def stop(request):
    print("stop")
    seq.stop()
    return HttpResponse("ok")

def pause(request):
    seq.pause()
    
    return HttpResponse("ok")

def play(request):
    print("play")
    if seq.currentFile == "Start file first" or seq.currentFile == "":
        return HttpResponse("ko: Select file first")
    seq.play()
    return HttpResponse("ok")

def button(request, btn):
    seq.button(btn)
    print("button", btn)
    return HttpResponse("ok")

def get_state(request):
    res = {
        "currentFile": seq.currentFile,
        "inInfiniteLoop": seq.inInfiniteLoop,
        "currentState": seq.currentState,
        "lastCmds": seq.lastCmds,
        "currentCmd": seq.currentCmd,
        "waitingForTime": seq.waitingForTime,
        "waitingForBtn": seq.waitingForBtn,
        "msg": seq.msg,
    }
    return HttpResponse(json.dumps(res))

def fileList(request):
    path=settings.SEQ_PATH
    #list file in examples folder
    ex_files = dirToFileList(path+"/examples/")
    #list file in your_seq folder
    custom_files = dirToFileList(path+"/custom/")
    
    res = {
            "examples":ex_files,
            "custom":custom_files
            }
    return HttpResponse(json.dumps(res))

def dirToFileList(path):
    files = []
    path
    for f in listdir(path):
        if f.find(".txt") != -1:
            files.append(f)
    return files

def connectedDevices(request):
    #print(mqtt_client.connectedDevices)
    return HttpResponse(json.dumps(mqtt_client.connectedDevices))



def save_seq(request):
    if(request.method == 'POST'):
        try:
            #write content as a file
            fileName = "".join(filter(str.isalnum, request.POST.get("filename")))
            if fileName == "":
                return HttpResponse("ko: File name cannot be empty")
            
            if fileName.find('.txt') == -1:
                fileName = fileName + ".txt"
            
            code = request.POST.get("code")

            path = settings.SEQ_PATH + "/custom/" + fileName
            with open(path, "w") as f:
                f.write(code)
            
            try:
                delete_seq(request, fileName.replace(".txt" ,".json"))
            except Exception as e:
                print("Error while deleting old json file. may be normal", e)

            if(request.POST.get("json") != ""):
                path = path.replace(".txt" ,".json")
                with open(path, "w") as f:
                    f.write(request.POST.get("json"))

            return HttpResponse("File saved successfully. Redirecting ... <a href='/interface/' id='redirect'></a><script>setTimeout(function() { document.getElementById('redirect').click(); }, 5000);</script>")

        except Exception as e:
            print(e)
            return HttpResponse(f"ko: There is an issue. {e}")
    return HttpResponse("ko: method not allowed")

def load_seq(request,dir,fileName):
    try:
        path = dir + "/" + fileName
        path = path.replace("%20"," ") #get request spaces

        sensitiveChar = ["..","~"] #these char can be harmful if executed with rm command
        for c in sensitiveChar:
            path = path.replace(c, "")

        path = settings.SEQ_PATH + "/" + path
        print(path, dir)
        seq_as_json = ""

        try:
            seq_as_json = open(path.replace(".txt" ,".json"), "r").read()
        except:
            pass

        res = {
            "filename": fileName,
            "content": open(path, "r").read(),
            "json": seq_as_json
        }
        return HttpResponse(json.dumps(res))
    except Exception as e:
        print(e)
        return HttpResponse("ko: There is an issue. " + str(e))

def delete_seq(request, fileName):
    try:
        fileName = str(fileName)
        fileName = fileName.replace("%20"," ") #get request spaces
        sensitiveChar = ["..","/","~"] #these char can be harmful if executed with rm command
        for c in sensitiveChar:
            fileName = fileName.replace(c, "")
        path = settings.SEQ_PATH + "/custom/" + fileName
        os.remove(path)
        print("removed", path)
        return HttpResponse("ok")
    except:
        return HttpResponse("ko: There is an issue. Maybe the file is already deleted")

def find_folder(directory):
    """Recherche le dossier thingva dans directory."""
    for child_item in os.listdir(directory):
        child_path = os.path.join(directory, child_item)
        print("cholditem", child_item)
        if child_item.lower() == "thingva":
            return child_path
        
        try:
            found_path = find_folder(child_path)
            if found_path is not None:
                return found_path
        except Exception as e:
            print(e)
                
    return None

def raspi_find_usb_folder(path): #classic function does not work for raspi with symlink
    path += "media/"
    for child_item in os.listdir(path):
        child_path = os.path.join(path, child_item) #usb key name
        print("childitem", child_item)
        for child_item2 in os.listdir(child_path): #browse usb key's root folder
            if child_item2.lower() == "thingva":
                return child_path
    
    return None
        
    
def usb(request):
    #try:
    #get all files in ../Thingva/USB
    path = settings.USB_PATH + "/"
    path = find_folder(path)
    if path == None:
        path = raspi_find_usb_folder(path)
        if path == None:
            return HttpResponse("ko: There is an issue. Did you connect the usb key ? Sequences should be stored in a foler named Thingva. ")
    files = dirToFileList(path)
    #copy files to storage/sequences/custom
    for f in files:
        if f.find(".txt") != -1 or f.find(".json") != -1 or f.find(".xml") != -1:
            shutil.copyfile(path + f, settings.SEQ_PATH + "/custom/" + f)

    #except Exception as e:     
        #print (e)
        #return HttpResponse("ko: There is an error on our side. Did you connect the usb key ? Sequences should be stored in a foler named Thingva. ")
    return HttpResponse("Imported: " + str(files))

def update(request):
    pass



#############  MQTT  #############
def mqttCmd(request, cmd):
    try:
        cmd = cmd.replace("%20"," ") #get request spaces
        cmd = cmd.split("=")
        if(len(cmd) < 2):
            return HttpResponse("ko: Invalid command")
        target = cmd[0].strip()
        arg = cmd[1].strip()
        rc, mid = mqtt_client.client.publish(target, arg)
        return HttpResponse("ok")
    except:
        return HttpResponse("ko: There is an issue.")
    
