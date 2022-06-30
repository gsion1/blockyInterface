Install l'addon spiffs sur arduino
Ajouter les lib ESPAsyncWebServer et (ESPTcp???machin)
Mofifier le schéma de partition pour laisser + de place aux fichiers (outils, Partition scheme : No OTA 2MB APP/2MB SPIFFS)
Uploader en cliquant sur outils puis ESP32 Sketch data Upload

Peut avoir un peu de mal à se connecter au réseau wifi, dans ce cas, réuploader de la même manière

Se connecter à la page servie en connaissant l'ip de l'esp sur le réseau (ex : ouvrir http://192.168.43.29/ )