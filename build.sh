#!/bin/bash
set -e
shFilePath=$(cd `dirname $0`; pwd)

IP="120.25.233.183"
uploadPath="/usr/gfDocker/nginx/web"
#获取当前分支
branch=$(git symbolic-ref --short HEAD)
#开始
echo "\033[35m 当前分支是：${branch} \033[0m"

#打包
function build() {
    echo "\033[32m 正在打包... \033[0m" 
    yarn buildVite 
    echo "\033[32m $1打包成功..." 
}
#上传服务器
function upload() {
    echo "\033[32m 准备上传服务器,地址：$uploadPath \033[0m"
    rsync -a -e "ssh -p 22" $shFilePath/blogs-macos*  root@$IP:$uploadPath
    echo "\033[32m 部署成功！ \033[0m"
}

#部署
build
upload










