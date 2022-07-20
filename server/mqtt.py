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

    def __init__(self):
        self.client = self.connect_mqtt()
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

    def setButton(self,name):
        self.buttons[str(name)] = 1

    def scanButton(self, filename):
        but = {}
        print(filename)
        with open(filename, "r+") as file1:
            # Reading from a file
            lines = file1.read().split("\n")
            for line in lines:
                line = line.split(";")[0] #ignore comments
                if(line != ""):
                    if(line.find("\n") == -1):
                        line += "\n"
                    line = line.split("=")
                    target = line[0]
                    arg = line[1]
                    if target == "WaitForButton":
                        but[str(arg).replace("\n","")] = 0
        self.buttons = but
        return but


    def publish(self, client, topic, arg):
        result = client.publish(topic, arg)
        status = result[0]
        if status == 0:
            arg = arg.replace("\n","")
            print(f"Sent `{arg}` to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")

    def readFileAndSendCmd(self, filename):
        print(filename)
        with open(filename, "r+") as file1:
            # Reading from a file
            lines = file1.read().split("\n")
            for line in lines:
                line = line.split(";")[0] #ignore comments
                if(line != ""):
                    if(line.find("\n") == -1):
                        line += "\n"
                    line = line.split("=")
                    target = line[0]
                    arg = line[1]
                    if target == 'Pause':
                        print("paused for ", arg.replace("\n",""), "s")
                        time.sleep(float(arg))
                    elif target == "WaitForButton":
                        #reset button state first
                        arg=str(arg).replace("\n","")
                        self.buttons[arg]=0
                        print("wait for button" + arg)
                        print(self.buttons)
                        while not self.buttons[arg]:
                            time.sleep(0.1)
                            
                        print("button " + arg + " clicked")
                        self.buttons[arg]=0
                    else:
                        result = self.publish(self.client, self.topic+target, arg)
                        """status = result[0]
                        if status == 0:
                            arg = arg.replace("\n","")
                            print(f"Sent `{arg}` to topic `{topic+target}`")
                        else:
                            print(f"Failed to send message to topic {topic+target}")"""
                else:
                    print("Empty line")
        print("EveryThing is sent")
