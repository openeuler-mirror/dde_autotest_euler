#!/bin/bash
# 添加仓库
if [ ! -f /etc/yum.repos.d/epel-OpenEuler.repo ]; then
    sudo curl -o /etc/yum.repos.d/epel-OpenEuler.repo -k https://down.whsir.com/downloads/epel-OpenEuler.repo
fi

sudo yum install xdotool -y

xdotool --version
