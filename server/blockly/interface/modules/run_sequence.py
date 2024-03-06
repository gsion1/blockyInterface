from django.conf import settings
from blockly.mqtt import mqttClient as mqtt_client
from blockly import mqtt
from time import time
import json

mqtt_client = mqtt.mqttClient()
class SeqManager():
    currentState = "stopped"
    currentFile = "Select file first"
    inInfiniteLoop = False
    lastBtn = None
    lastCmds = []
    currentCmd = ""
    waitingForTime = 0
    waitingForBtn = ""
    currentFile = ""
    currentFileContent = ""
    pauseBeginTime = 0
    pauseDuration = 0
    scheduler_on = False
    msg = ""

    def __init__(self):
        pass

    def stop(self):
        self.currentState = "stopped"
        self.currentFile = "Start file first"

    def pause(self):
        self.currentState = "paused"

    def play(self):
        self.currentState = "playing"

    def button(self, btn):
        self.lastBtn = btn

    def startSeq(self, dir, fileName):
        path=settings.SEQ_PATH
        try:
            if(dir == "custom" or dir == "examples"):
                path = settings.SEQ_PATH + "/" + dir + "/" + fileName
            f = open(path, "r")

            self.currentFileContent = list(filter(None, f.read().split('\n')))
            print(self.currentFileContent)
            self.currentFile = fileName
            self.inInfiniteLoop = False #reset inifinite loop from previous sequence
            self.lastBtn = ""
            self.waitingForTime = 0
            self.msg = "Click run to start"
            return True, ""
        except:
            return False, "File not found"

    def loop(self):
        self.scheduler_on = True
        #file ended
        if len(self.currentFileContent) == 0:
            self.currentState = "stopped"
            self.currentFile = "Select file first"
            self.msg = "End of sequence"
            self.currentCmd = ""
            self.waitingForBtn = ""
            self.waitingForTime = 0
            print ("File ended ###############")
            return False, "File ended"
        
        #button we were waiting for was clicked
        if self.lastBtn == self.waitingForBtn:
            self.waitingForBtn = ""
            self.lastBtn = ""

        pause_ended = False
        #refresh remaining pause time before processing next line 
        if time() - self.pauseBeginTime > self.pauseDuration:
            pause_ended = True
            self.waitingFor = 0
        else:
            self.waitingForTime = self.pauseDuration - (time() - self.pauseBeginTime)
        
        if(self.currentState == "playing" and self.waitingFor == 0 and self.waitingForBtn == ""):
            #print("in the loop")
            currentLine = self.currentFileContent[0]
            self.currentCmd = currentLine.split(";")[0].strip() #ignore comments

            if self.currentCmd.find('LOOPFOREVER') != -1:
                self.inInfiniteLoop = True
                print("stat looping forever")

            if currentLine != "" and pause_ended and self.waitingForBtn == "": #execute line
                self.waitingFor = 0
                
                #look into cmd
                #ex cmds -> actuator1=89 ; go to pos 89
                # Pause=7 ; pause for 7s
                #WaitForButton=IamAButton ; wait for button 
                cmd = self.currentCmd.split("=")
                target = cmd[0].strip()
                arg = cmd[1].strip()

                #add the line executed at the bottom of the list to do it again and again
                if self.inInfiniteLoop and self.currentCmd.find('LOOPFOREVER') == -1:
                    self.currentFileContent.append(currentLine) 
                    print(self.currentFileContent)

                if target == 'Pause':
                    self.pauseDuration = float(arg.replace("\n",""))
                    self.waitingForTime = self.pauseDuration
                    self.lastCommand = self.currentCmd
                    self.msg = "Pause for " + str(self.waitingForTime) + "s"
                    self.pauseBeginTime = time()
                    print(self.lastCommand)
                
                elif target == "WaitForButton":
                    #reset button state first
                    btn = str(arg).replace("\n","")
                    self.waitingForBtn = btn
                    self.msg = "Waiting for button " + self.waitingForBtn
                    print("waiting for button " + self.waitingForBtn)
                    
                elif target == "LOOPFOREVER":
                    pass

                else: #is a movement cmd
                    print("movement " + target + " " + arg)
                    self.msg = "Movement " + target + " " + arg
                    rc, mid = mqtt_client.client.publish(target, arg) #keep compatibility with v1
                   
                    try: # send as json
                        arg = arg.split(",")
                        print(arg)  
                        if len(arg) > 3:
                            position = arg[2]
                            velocity = arg[3]
                            data = {
                                "type": "pos", #position
                                "pos": position,
                                "speed": velocity,
                            }
                            if len(arg) > 4:
                                data["acc"] = arg[4]
                            #keep compatibility with v1
                            rc, mid = mqtt_client.client.publish("/command/"+target, json.dumps(data))

                    except Exception as e:
                        print(e)

                self.lastCmds.append(self.currentCmd)
                #remove the sent line
                self.currentFileContent = self.currentFileContent[1:] 
                
                
            
        return True, ""

    def tests(self):
        isConnected = ["Linear-1=actuator", "NameOfTheButton=button", "5=actuator"]
        for item in isConnected:
            rc, mid = mqtt_client.client.publish("/isConnected/", item)
        feedback = {
            "source": 5,
            "absPos": 10,
            "relPos": 13,
            "speed": 15
        }
        rc, mid = mqtt_client.client.publish("/feedback/", json.dumps(feedback))
