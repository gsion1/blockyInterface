from . import mqtt
mqtt_client = mqtt.mqttClient()

mqtt_client.client.loop_start()
