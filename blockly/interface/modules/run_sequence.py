from django.conf import settings
from blockly.mqtt import mqttClient as mqtt_client
from blockly import mqtt
from time import time

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

            self.currentFileContent = f.read().split('\n')
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
            #print ("File ended ###############")
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
            print("in the loop")
            currentLine = self.currentFileContent[0]
            self.currentCmd = currentLine.split(";")[0].strip() #ignore comments

            if self.currentCmd.find('LOOPFOREVER') != -1:
                self.inInfiniteLoop = True
                print("loop forever")

            if currentLine != "" and pause_ended and self.waitingForBtn == "": #execute line
                self.waitingFor = 0
                
                #look into cmd
                #ex cmds -> actuator1=89 ; go to pos 89
                # Pause=7 ; pause for 7s
                #WaitForButton=IamAButton ; wait for button 
                self.currentCmd = self.currentCmd.split("=")
                target = self.currentCmd[0].strip()
                arg = self.currentCmd[1].strip()

                if target == 'Pause':
                    self.pauseDuration = float(arg.replace("\n",""))
                    self.waitingForTime = self.pauseDuration
                    self.lastCommand = "Pause for " + str(self.waitingForTime) + "s"
                    self.pauseBeginTime = time()
                    print(self.lastCommand)
                
                elif target == "WaitForButton":
                    #reset button state first
                    btn=str(arg).replace("\n","")
                    self.waitingForBtn=btn
                    self.msg = "Waiting for button " + self.waitingForBtn
                    print("waiting for button " + self.waitingForBtn)
                    
                else: #is a movement cmd
                    print("movement " + target + " " + arg)
                    rc, mid = mqtt_client.client.publish(target, arg)

                self.lastCmds.append(self.currentCmd)
                #remove the sended line
                self.currentFileContent = self.currentFileContent[1:] 

                #add the line executed at the bottom of the list to do it again and again
                if self.inInfiniteLoop:
                    self.currentFileContent.append(currentLine) 
            
        return True, ""

