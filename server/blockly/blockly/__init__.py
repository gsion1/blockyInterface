from . import mqtt
from time import sleep

for attemp in range(10): #wait for mosquitto if used with docker
    try:
        mqtt_client = mqtt.mqttClient()
        break
    except Exception as e:
        print("Error while initializing MQTT client: " + str(e) + "\n" + "Retrying in 5 seconds...")
        sleep(5)

mqtt_client.client.loop_start()
