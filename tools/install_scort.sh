#!/bin/bash
# 安装依赖包
sudo yum install libXcomposite libXfixes libXinerama libXcomposite-devel imlib2 imlib2-devel automake autoconf autoconf-archive libXext libXext-devel libXfixes-devel libXinerama-devel -y
if [ ! -f scrot-1.12.1.tar.gz ]; then
    wget https://github.com/resurrecting-open-source-projects/scrot/releases/download/1.12.1/scrot-1.12.1.tar.gz
fi
tar -xzvf scrot-1.12.1.tar.gz
cd scrot-1.12.1
sudo ./autogen.sh
./configure
make
sudo make install
scrot --version
