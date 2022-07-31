# blockyInterface

## Setup
create a directory `your_seq` in server

## Set computer as hotspot
With hostapd and udhcpd 
do this for address 192.168.8.1
/etc/hostapd/hostapd.conf

```
ssid=MYSSID
interface=wlan0
hw_mode=g
channel=5
driver=nl80211

logger_syslog=0
logger_syslog_level=0
wmm_enabled=1
wpa=2
preamble=1

wpa_passphrase=MYPASSWORD
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
auth_algs=1
macaddr_acl=0

# controlling enabled
ctrl_interface=/var/run/hostapd
ctrl_interface_group=0
```

/etc/udhcpd.conf
```
# Sample udhcpd configuration file (/etc/udhcpd.conf)

# The start and end of the IP lease block

start           192.168.8.20    #default: 192.168.0.20
end             192.168.8.254   #default: 192.168.0.254

# The interface that udhcpd will use

interface       wlan0           #default: eth0

#Examles
opt     dns     8.8.4.4 192.168.8.1
option  subnet  255.255.255.0
opt     router  192.168.8.1    # not true but will work
option  domain  local
option  lease   864000          # 10 days of seconds

```

## Sever
Run server 
```
cd server 
python3 -m flask run --host 192.168.8.1
```

Access :
http://192.168.8.1:5000

## Mosquitto
Be carreful, mosquitto can be localhost only by default
```
#edit conf file
sudo nano /etc/mosquitto/mosquitto.conf
#by default, mosquitto command does not use a conf file, so we should specify it
sudo mosquitto -v -c /etc/mosquitto/mosquitto.conf
```

## Cron job
Add those lines at the end of cron file (`sudo crontab -e`)
```
@reboot mosquitto -v -c /etc/mosquitto/mosquitto.conf
@reboot cd blockyInterface/server &&  python3 -m flask run --host 192.168.8.1
```

# USB drive management
By default, drives won't be mounted automatically and without root or sudo
To auto mount, install pmount and create udev rule etc
Follow https://raspberrypi.stackexchange.com/questions/66169/auto-mount-usb-stick-on-plug-in-without-uuid
First step from pauliucxz and then second and third steps from yy502
Or you can do 
```
sudo chmod +x install/automount.sh
sudo ./install/automount.sh
```


# Troubleshooting 
Stop the mobile data on the computer or mobile phone that loads the web page or it will prefer to load from the internet and it won't work
