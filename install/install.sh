sudo apt update 
sudo apt install udhcpd hostapd python3 python3-pip mosquitto mosquitto-clients python3-matplotlib python3-paho-mqtt
pip3 install -U Flask
pip3 install -r ../requirements.txt

#Update mosquitto conf to allow access to from other devices
#sudo sh -c "echo listener 1883 >> /etc/mosquitto/mosquitto.conf"
#sudo sh -c "echo allow_anonymous true >> /etc/mosquitto/mosquitto.conf"
#issues with pid files and permissions
sudo cp mosquitto.conf /etc/mosquitto/mosquitto.conf

#cd ~ && git clone https://github.com/gsion1/blockyInterface.git
#cd blockyInterface && mkdir server/your_seq

#cd install/

#config files
sudo cp hostapd.conf /etc/hostapd/hostapd.conf
sudo cp udhcpd.conf /etc/udhcpd.conf

#Add to cron 
(crontab -l ; echo "@reboot export FLASK_APP=app && cd ~/blockyInterface/server && python3 -m flask run --host 192.168.8.1")| crontab - >
#sudo (crontab -l ; echo "@reboot mosquitto -v -c /etc/mosquitto/mosquitto.conf")| crontab - #this one is sudo

sudo ./automount_usb.sh #mount usb automatically

#redirect thingva to 198.168.8.1 and reload 
sudo sh -c "echo 192.168.8.1 thingva >> /etc/hosts"  
sudo systemctl restart NetworkManager.service
 
#redirect port 80 to 5000
sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 5000
sudo iptables-save



#switch to root user
cr =  "@reboot mosquitto -v -c /etc/mosquitto/mosquitto.conf"  #this one is for root user
sudo (crontab -u root -l; echo "$cr") | crontab -u root
#echo "please add @reboot mosquitto -v -c /etc/mosquitto/mosquitto.conf to SUDO crontab (sudo crontab -e)"
