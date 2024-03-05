#from server.sendFileMqtt import connect_mqtt
from paho.mqtt import client as mqtt_client
import time
import random

class mqtt:
    buttons={}
    broker = 'localhost'
    port = 1883
    topic = "/savonnerie/"
    # generate client ID with pub prefix randomly
    client_id = f'python-mqtt-{random.randint(0, 1000)}'
    #username = 'username'
    #password = 'public'
    mqtt_is_connected = 0
    seqenceState = 'STOP'
    lastCommand = "No command sent"
    connectedDevices = {}

    def __init__(self):
        self.client = self.connect_mqtt()
        self.client.on_message=self.on_message
        self.client.subscribe("isConnected")
        self.client.subscribe("button")
        self.client.subscribe("posFeedback")
        self.client.loop_start()
        #self.buttons = {"1":0,"2":0,"3":0,"4":0}

    def connect_mqtt(self):
        def on_connect(client, userdata, flags, rc):
        
            if rc == 0:
                print("Connected to MQTT Broker!")
                mqtt_is_connected = 1
            else:
                print("Failed to connect, return code %d\n", rc)

        client = mqtt_client.Client(self.client_id)
        #client.username_pw_set(username, password)
        client.on_connect = on_connect
        client.connect(self.broker, self.port)
        return client

    def on_message(self, client, userdata, message):
        print("received message =",str(message.payload.decode("utf-8")))

        #when they connects and periodically, device send their names on isConnected topic. save and display 
        #for example : Linear-1=actuator or NameOfTheButton=button
        if(message.topic == "isConnected"):
            dev = message.payload.decode("utf-8").split("=")
            if(len(dev) < 2):
                dev.append("default")
            dev[1] = dev[1].replace('\n',"")
            self.connectedDevices[dev[0]] = {"type":dev[1], "pos":"X"}
            print("New device: ", self.connectedDevices)

        #if a physical button is clicked 
        if(message.topic == "button"):
            button = message.payload.decode("utf-8").split("=") #button name, counter
            self.setButton(button[0])

        #actuators often send their position. Not in real time
        if(message.topic == "posFeedback"):  #actuatorName,Position
            dev = message.payload.decode("utf-8").split("=")
            if(len(dev) < 2):
                dev.append("X")
            self.connectedDevices[dev[0]]['pos']=dev[1]

        

    #buttons defined by the user
    #won't update the button if paused
    def setButton(self,name):
        if self.seqenceState == "PLAY":
            self.buttons[str(name)] = 1
            return 1
        return 0

    #PLAY / PAUSE / STOP
    def setImportantButton(self,state, force=False):
        if not (self.seqenceState in ['STOP','OVER'] and state == 'PLAY') or force == True:
            self.seqenceState = str(state) #'STOP' 'PLAY' or 'PAUSE'
            print("seq state", self.seqenceState)
            return 1
        return 0

    def scanButton(self, filename):
        but = {}
        with open(filename, "r+") as file1:
            
            # Reading from a file
            lines = file1.read().split("\n")
            for line in lines:
                try:
                    line = line.split(";")[0] #ignore comments
                    if(line != ""):
                        if(line.find("\n") == -1):
                            line += "\n"
                        line = line.split("=")
                        target = line[0]
                        arg = line[1]
                        if target == "WaitForButton":
                            but[str(arg).replace("\n","")] = 0
                except:
                    print("Did not understand " + line[0] + ". Pass")
        self.buttons = but
        return but

    def publish(self, client, topic, arg, qos=0):
        result = client.publish(topic, arg, qos=qos)
        status = result[0]
        if status == 0:
            arg = arg.replace("\n","")
            print(f"Sent `{arg}` to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")

    def readFileAndSendCmd(self, filename):
        print(filename)
        loopforever = False
        while self.seqenceState == 'PLAY' or self.seqenceState == 'PAUSE':
            with open(filename, "r+") as file1:
                # Reading from a file
                lines = file1.read().split("\n")
                for line in lines:
                    self.lastCommand = line
                    if loopforever:
                        lines.append(line) #add the line executed at the bottom of the list to do it again and again
                    
                    line = line.split(";")[0] #ignore comments
                    if(line != ""):
                        if(line.find("\n") == -1):
                            line += "\n"
                        line = line.split("=")
                        target = line[0].strip()

                        arg = line[1].strip()
                        while self.seqenceState != 'PLAY':
                            print("waiting for play button. Current state = ",self.seqenceState)
                            time.sleep(0.1)
                            if(self.seqenceState == "STOP"):
                                return #exit thread
                        if target == 'Pause':
                            print("paused for ", arg.replace("\n",""), "s")
                            time.sleep(float(arg))
                        elif target == "WaitForButton":
                            #reset button state first
                            arg=str(arg).replace("\n","")
                            self.buttons[arg]=0
                            print("wait for button" + arg)
                            print(self.buttons)
                            while not self.buttons[arg] or self.seqenceState != "PLAY":
                                time.sleep(0.1)
                                
                            print("button " + arg + " clicked")
                            self.buttons[arg]=0
                        elif target == "LOOPFOREVER":
                            print("Will loop forever")
                            loopforever = True
                        else:
                            self.publish(self.client, self.topic+target, arg, 1)
                            
                    else:
                        print("Empty line")
            print("EveryThing is sent")
            self.seqenceState = 'OVER'  #force exit
        print('Sequence has stoped, intentionnally or because it\'s over')
