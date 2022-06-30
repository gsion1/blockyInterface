# python 3.6

import random
import time

from paho.mqtt import client as mqtt_client


broker = 'localhost'
port = 1883
topic = "/savonnerie/"
# generate client ID with pub prefix randomly
client_id = f'python-mqtt-{random.randint(0, 1000)}'
#username = 'emqx'
#password = 'public'
mqtt_is_connected = 0

def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
    
        if rc == 0:
            print("Connected to MQTT Broker!")
            mqtt_is_connected = 1
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    #client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def publish(client, topic, arg):
    result = client.publish(topic, arg)
    status = result[0]
    if status == 0:
        arg = arg.replace("\n","")
        print(f"Sent `{arg}` to topic `{topic}`")
    else:
        print(f"Failed to send message to topic {topic}")

def readFileAndSendCmd(client):

    with open("testSequence.txt", "r+") as file1:
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
                if target == 'P':
                    print("paused for ", arg.replace("\n",""), "s")
                    time.sleep(float(arg))
                else:
                    result = publish(client, topic+target, arg)
                    """status = result[0]
                    if status == 0:
                        arg = arg.replace("\n","")
                        print(f"Sent `{arg}` to topic `{topic+target}`")
                    else:
                        print(f"Failed to send message to topic {topic+target}")"""
            else:
                print("Empty line")
    print("EveryThing is sent")

def run():
    client = connect_mqtt()
    time.sleep(5)
    git
    client.loop_start()
    readFileAndSendCmd(client)
    #publish(client)


if __name__ == '__main__':
    run()
