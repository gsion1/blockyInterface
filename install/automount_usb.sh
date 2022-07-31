sudo apt-get install pmount

sudo cat << EOF >> /etc/udev/rules.d/usbstick.rules
ACTION=="add", KERNEL=="sd[a-z][0-9]", TAG+="systemd", ENV{SYSTEMD_WANTS}="usbstick-handler@%k"
EOF
echo "Wrote to /etc/udev/rules.d/usbstick.rules"

sudo cat << EOF >> /lib/systemd/system/usbstick-handler@.service
[Unit]
Description=Mount USB sticks
BindsTo=dev-%i.device
After=dev-%i.device

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/local/bin/automount %I
ExecStop=/usr/bin/pumount /dev/%I
EOF
echo "Wrote to /lib/systemd/system/usbstick-handler@.service"

sudo cat << EOF >> /usr/local/bin/automount
#!/bin/bash

PART=$1
FS_LABEL=`lsblk -o name,label | grep ${PART} | awk '{print $2}'`

if [ -z ${FS_LABEL} ]
then
    /usr/bin/pmount --umask 000 --noatime -w --sync /dev/${PART} /media/${PART}
else
    /usr/bin/pmount --umask 000 --noatime -w --sync /dev/${PART} /media/${FS_LABEL}_${PART}
fi
EOF
echo "Wrote to /usr/local/bin/automount"

sudo chmod +x /usr/local/bin/automount

echo "Usb automount done"