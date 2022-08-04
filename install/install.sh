sudo apt install python3 python3-pip mosquitto mosquitto-clients
pip3 install -U Flask

#Update mosquitto conf to allow access to from other devices
sudo sh -c "echo listener 1883 >> /etc/mosquitto/mosquitto.conf"
sudo sh -c "echo allow_anonymous true >> /etc/mosquitto/mosquitto.conf"

cd ~ && git clone https://github.com/gsion1/blockyInterface.git

#Add to cron 
(crontab -l ; echo "@reboot export FLASK_APP=app && cd ~/blockyInterface/server && python3 -m flask run --host 192.168.8.1")| crontab - #not as sudo !!!
#sudo (crontab -l ; echo "@reboot mosquitto -v -c /etc/mosquitto/mosquitto.conf")| crontab - #this one is sudo

sudo ./automount.sh #mount usb automatically

#redirect thingva to 198.168.8.1 and reload 
sudo sh -c "echo 192.168.8.1 thingva >> /etc/hosts"  
sudo service network-manager restart
 
#redirect port 80 to 5000
sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 5000
sudo iptables-save

echo "please add @reboot mosquitto -v -c /etc/mosquitto/mosquitto.conf to SUDO crontab (sudo crontab -e)"