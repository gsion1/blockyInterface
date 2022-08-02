sudo ./automount.sh #mount usb automatically

#redirect thingva to 198.168.8.1 and reload 
sudo echo "192.168.8.1 thingva" >> /etc/hosts #may not work due to permissions
sudo service network-manager restart
 
#redirect port 80 to 5000
sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 5000
sudo iptables-save