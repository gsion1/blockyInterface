#sudo apt update 
#sudo apt -y upgrade
#sudo apt install git dnsmasq hostapd python3 python3-pip mosquitto mosquitto-clients python3-matplotlib python3-paho-mqtt python3-flask udiskie

#cd install
#Update mosquitto conf to allow access to from other devices
#sudo cp mosquitto.conf /etc/mosquitto/mosquitto.conf



#cd ~ && git clone https://github.com/gsion1/blockyInterface.git
#cd blockyInterface && mkdir server/your_seq


#Add to cron 
#(crontab -l ; echo "@reboot export FLASK_APP=app && cd ~/blockyInterface/server && python3 -m flask run --host 192.168.8.1")| crontab - >
#(crontab -l ; echo "@reboot udiskie")| crontab - >

 
#redirect port 80 to 5000
#sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 5000
#sudo iptables-save

#echo "please do add to cron (crontab -e)  @reboot export FLASK_APP=app && cd ~/blockyInterface/server && python3 -m flask run --host 192.168.8.1"
#echo "please do add to SUDO cron (crontab -e) @reboot mosquitto -v -c /etc/mosquitto/mosquitto.conf"

