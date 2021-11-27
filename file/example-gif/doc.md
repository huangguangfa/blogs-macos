---
theme: cyanosis
highlight: nord
---

### 示例

![doc.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2fa22e202dd4b39852f1f4a1d3480af~tplv-k3u1fbpfcp-watermark.image?)

### 为什么要写这个
> 在一个夜深人静的凌晨、依然在改着bug，突然我的Windows电脑卡住、改bug加上电脑卡屏让我非常生气、我反手就拿起手机点开AppleStore、看了一眼两年前选购的MacBoock,好家伙还没降价！对于从小就家境贫寒的我来讲买了它无疑是给自己的生活雪上加霜、就这样我脑子突然出现一个想法、能不能拿自己的所学技能去仿制一个桌面demo云出来、在这个桌面上我可以开发代码、可以使用终端、可以听歌、可以写笔记、写博客...最重要的是我不需要去管环境！哇完美！就这样因为钱的原因我向现实低下了头、然后开始了自己的demo云桌面！

### 使用到的技术栈
- vue3 + vite + 全家桶
- webrtc + coturn
- xterm.js + node-pty
- vscode-server
- nestJs + mysql
- socket
- docker
- nginx

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d03ea772786f443795bcd827305f1097~tplv-k3u1fbpfcp-watermark.image?)
### 都有什么功能？
- 纯前端实现-视频通话[webtrc](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia)
  ![3d39f07b48b695f74e8ac2522928054.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6881d17b6d1d45609d6ddd570864753a~tplv-k3u1fbpfcp-watermark.image?)
> webrtc是谷歌开源的一项即时通讯技术、前端只要调用浏览器内置的api就能实现语音视频通话、我试过最多四个人同时在线交流、多了就卡！
> 主要的步骤是：拉起本地视频流、把流填充到video上、然后创建PeerConnection、并收集保存自己的iceCandidate、在进入协商环节把本地的sdp描述信息添加到peer中、然后发送sdp描述信息给answer端
> 告诉answer端本地的设备进行通信所需的协议和路由、然后在发送ICE信息进行ICE连接匹配连通性、然后answer端收到sdp也会交换自己的本地描述信息、并把接收到sdp信息通过setRemoteDescription设置
> 到本地(我们称之为信令交换)；这样我们就建立了webrtc连接、然后通过ontrack监听远端视频流填充对方视频框！ 主要用到了webrtc技术和socket技术、在外网的话还需要起一个内网穿透服务coturn；

- vscode-server [vscode-server官网地址](https://github.com/cdr/code-server)  
> 一个运行在网页端的vscode、和桌面的vscode基本一样、我是使用官方的codercom/code-server镜像、大概1.1G对服务器配置也有要求
```js
 // 拉下镜像
 docker pull codercom/code-server 
 // 创建目录
 mkdir -p ~/.config 
 // 创建容器
 docker run -it --name code-server -p 6689:8080 \
  -v "/xxx/.config:/home/coder/.config" \
  -v "/xxx:/home/coder/project" \
  -e PASSWORD="123456" \
  codercom/code-server:latest
 // 访问ip加8080端口访问
```
> [官方镜像地址](https://registry.hub.docker.com/r/codercom/code-server)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d7ad952a2ab4ada9cb8e40da2bb4c09~tplv-k3u1fbpfcp-watermark.image?)

### Terminal [官网地址](https://github.com/xtermjs/xterm.js/tree/3.12.0)
> 他是一个可以在浏览器通过socket技术实现一个网页小终端的js库！实现的原理是客户端使用xterm.js实例化
一个终端、把终端的内容通过socket发到到服务端（node服务）然后拿到输入的内容后通过node-pty进行执行输入的指令然后再把指令结果通过socket返回给客户端、这样就形成了一个网页版终端、刚开始跟着官网的demo搞的时候因为我的node是使用使用event那种形式去监听socket导致和官方提供的xterm-addon-attach插件无法无缝连接、后面索性直接clone了插件下来魔改、在也不用每次登陆服务器在使用服务器了！可以随时随地连接服务器、然后就是安全性了、因为这样你就把你的服务器裸露在外面也是非常的危险、所以需要谨慎！！！

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41af501e3c3744d0a7b5c052c2fb0d55~tplv-k3u1fbpfcp-watermark.image?)

[官网demo](https://github.com/xtermjs/xterm.js/tree/3.12.0/demo)

### 其他
> 里面还有一些自己玩小玩意都是用逻辑堆出来的也没什么好介绍的、比如说歌曲、简易版浏览器等等、目前算是把整个架子搭建起来了、后期会继续完善他、打造一份属于自己的工具箱、尽可能用所学技术让自己开心、实现自己所想做的事、当然里面也包括很多前辈提供的轮子、也非常感谢前辈们！

### 写在最后

> it是非常有趣、我很热爱它、帮我带来收入的同时也让我体验技术所带来的乐趣、虽然有时候bug很让我们苦恼折腾、但是只要我们静下心来、出去走走或者洗把脸、说不定又有更好的解决方案！ [我的macOS博客地址](https://www.huangguangfa.cn)