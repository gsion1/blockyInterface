
%Connect to mqtt brocker. A brocker should be installed on your machine and
% listen: 1883 should be added to mosquitto config file
%if using octave, please install octave-mqtt, which depends on paho-mqtt (C library) https://projects.eclipse.org/projects/iot.paho/downloads
pkg load mqtt

%Please update with your settings
brokerAddress = "192.168.198.131";
port = 1883;
clientID = "Matlab";

%better to keeps hands far from those lines
%mqClient = mqttclient(brokerAddress, Port = port, ClientID = clientID);  %matlab
mqClient = mqttclient(brokerAddress, "Port", port, "ClientID", clientID);  %octave

if mqClient.Connected == 1
  disp("Connected to mqtt brocker");
else
  disp("Error. Cannot connect to mqtt brocker. Possible causes :");
  disp("- Mqtt broker is not installed (you can install mosquitto)");
  disp("- brockerAddress does not correspond to the IP on which the brocker is running");
  disp("- Mosquitto disallow external connections (if the brocker is running on another machine). Please add listen: 1883 to the mosquitto config file and reload mosquitto WITH the new configuration (NO configuration if not EXPLICITELY provided)");
endif

%subscribe to topic
topicToSub = "isConnected";  %When booting, actuators and button will publish their names on this topic
subscribe(mqClient, topicToSub); %you should use peek(mqClient) to get the new messages


% Make it move ! Now, it's your turn

% Move an actuator
cmd = moveCmd(200);  %create command "reach position 200", here we use default speed and accel
write(mqClient, "devices/Lineaire-1", cmd) %send the command to "Lineaire-1" actuator

%    $1,0,100,100,10,23*45
cmd = moveCmd(100, 100, 10);  %create command "reach position 80", here we use default speed and accel
write(mqClient, "devices/Lineaire-8", cmd) %send the command to "Lineaire-8" actuator

%simulate a click on a button called "buttonName"
write(mqClient, "button", "buttonName")


%add your own commands



%close mqtt connection
clear mqClient
