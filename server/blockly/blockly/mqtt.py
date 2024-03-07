import paho.mqtt.client as mqtt
from django.conf import settings
import json
class mqttClient:
    connectedDevices = {}
    
    def __init__(self):
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.username_pw_set(settings.MQTT_USER, settings.MQTT_PASS)
        self.client.connect(
            host=settings.MQTT_HOST,
            port=settings.MQTT_PORT,
            keepalive=settings.MQTT_KEEPALIVE
        )
        

    def on_connect(self,mqtt_client, userdata, flags, rc):
        if rc == 0:
            print('Connected successfully')
            #mqtt_client.subscribe('django/mqtt')
            mqtt_client.subscribe('isConnected')
            mqtt_client.subscribe('posFeedback')
            mqtt_client.subscribe('feedback')
            
        else:
            print('Bad connection. Code:', rc)


    def on_message(self,mqtt_client, userdata, msg):
        print("onmessage")
        print(f'Received message on topic: {msg.topic} with payload: {msg.payload}')

        #when they connect and periodically, device send their names on isConnected topic. save and display 
        #for example : Linear-1=actuator or NameOfTheButton=button
        if(msg.topic.find("isConnected") != -1):
            dev = msg.payload.decode("utf-8").split("=")
            if(len(dev) < 2):
                dev.append("default")
            dev[1] = dev[1].replace('\n',"")
            dev[0] = dev[0].replace(' ',"_")
            self.connectedDevices[dev[0]] = {"type":dev[1], "pos":"X"}
            print("New device: ", self.connectedDevices)

        #if a physical button is clicked 
        if(msg.topic.find("button") != -1):
            button = msg.payload.decode("utf-8").split("=") #button name, counter
            #setButton(button[0])


        if(msg.topic.find("feedback") != -1):  #actuatorName,Position
            dev = json.loads(msg.payload.decode("utf-8"))
            if dev["source"] == None :
                return
            if dev["absPos"] == None :
                dev["absPos"] = "---"

            if dev["relPos"] == None :
                dev["relPos"] = "---"

            if dev["speed"] == None :
                dev["speed"] = "---"

            self.connectedDevices[dev["source"]] = dev
            print (dev)


    