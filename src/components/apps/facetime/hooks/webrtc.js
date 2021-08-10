import { initScoket } from "./initWrtcScoket"
const SkyRTC = function () {
    //创建本地流
    let gThat;
    let PeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection ||
        window.mozRTCPeerConnection);
    let getUserMedia = (navigator.getUserMedia ||//旧版API
        navigator.mediaDevices.getUserMedia ||//最新的标准API
        navigator.webkitGetUserMedia ||  //webkit核心浏览器
        navigator.mozGetUserMedia ||     //firfox浏览器
        navigator.msGetUserMedia
    );

    let nativeRTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
    let nativeRTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);


    const iceServer = {
        "iceServers": [
            {
                "url": "stun:stun.l.google.com:19302"
            },
            {
                "url": "stun:global.stun.twilio.com:3478"
            },
            {
                "url": "turn:global.stun.twilio.com:3478",
                "username": "79fdd6b3c57147c5cc44944344c69d85624b63ec30624b8674ddc67b145e3f3c",
                "credential": "xjfTOLkVmDtvFDrDKvpacXU7YofAwPg6P6TXKiztVGw"
            }
        ]
    };

    /*  事件处理器  */
    function EventEmitter() {
        this.events = {};
    }
    //绑定事件函数
    EventEmitter.prototype.on = function (eventName, callback) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(callback);
    };
    //触发事件函数
    EventEmitter.prototype.emit = function (eventName, _) {
        let events = this.events[eventName],
            args = Array.prototype.slice.call(arguments, 1),
            i, m;

        if (!events) {
            return;
        }
        for (i = 0, m = events.length; i < m; i++) {
            events[i].apply(null, args);
        }
    };


    /**********************************************************/
    /*                   流及信道建立部分                       */
    /**********************************************************/


    /*******************基础部分*********************/
    function skyrtc() {
        //本地media stream
        this.localMediaStream = null;
        //所在房间
        this.room = "";
        //本地WebSocket连接
        this.socket = null;
        //本地相连的peer connection， 
        this.localPeer = null;
        //保存所有与本地连接的socket的id
        this.connections = [];
        //初始时需要构建链接的数目
        this.numStreams = 0;
        //初始时已经连接的数目
        this.initializedStreams = 0;
        //保存所有的data channel，键为socket id，值通过PeerConnection实例的createChannel创建
        this.dataChannels = {};
    }

    //继承自事件处理器，提供绑定事件和触发事件的功能
    skyrtc.prototype = new EventEmitter();

    /*************************服务器连接部分***************************/

    skyrtc.prototype.connect = function (uid) {
        let socket, that = this; 
        uid = uid || "";
        socket = this.socket = initScoket(uid);
        socket.onopen(function () {
            that.emit("socket_opened", socket);
            that.emit('connected', socket);
        });

        socket.onmessage( function (message) {
            
            // let json = JSON.parse(message.data);
            // if (json.eventName) {
            //     that.emit(json.eventName, json.data);
            // } else {
            //     that.emit("socket_receive_message", socket, json);
            // }
        });

        socket.onerror(function (error) {
            that.emit("socket_error", error, socket);
        });

        socket.onclose(function (data) {
            that.localMediaStream.close();
            let pcs = that.peerConnections;
            for (i = pcs.length; i--;) {
                that.closePeerConnection(pcs[i]);
            }
            that.peerConnections = [];
            that.dataChannels = {};
            that.connections = [];
            that.fileData = {};
            that.emit('socket_closed', socket);
        })
        
    };


    /*************************流处理部分*******************************/
    //访问用户媒体设备的兼容方法
    function getUserMediaFun(constraints, success, error) {
        if (navigator.mediaDevices.getUserMedia) {
            //最新的标准API
            navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
        } else if (navigator.webkitGetUserMedia) {
            //webkit核心浏览器
            navigator.webkitGetUserMedia(constraints, success, error)
        } else if (navigator.mozGetUserMedia) {
            //firfox浏览器
            navigator.mozGetUserMedia(constraints, success, error);
        } else if (navigator.getUserMedia) {
            //旧版API
            navigator.getUserMedia(constraints, success, error);
        } else {
            that.emit("stream_create_error", new Error('WebRTC is not yet supported in this browser.'));
        }
    }

    function createStreamSuccess(stream) {
        if (gThat) {
            gThat.localMediaStream = stream;
            gThat.initializedStreams++;
            gThat.emit("stream_created", stream);
        }
    }

    function createStreamError(error) {
        if (gThat) {
            gThat.emit("stream_create_error", error);
        }
    }

    skyrtc.prototype.createStream = function (options) {
        let that = this;
        gThat = this;
        options.video = !!options.video;
        options.audio = !!options.audio;
        
        if (getUserMedia) {
            this.numStreams++;
            // 调用用户媒体设备, 访问摄像头
            getUserMediaFun(options, createStreamSuccess, createStreamError);
        } else {
            that.emit("stream_create_error", new Error('WebRTC is not yet supported in this browser.'));
        }
    };


    // 将流绑定到video标签上用于输出
    skyrtc.prototype.attachStream = function (stream, dom, isSound) {
        if (navigator.mediaDevices.getUserMedia) {
            dom.srcObject = stream;
        } else {
            dom.src = webkitURL.createObjectURL(stream);
        }
        isSound && (dom.volume = 0.0);
        dom.play();
    };


    /***********************信令交换部分*******************************/


    //向所有PeerConnection发送Offer类型信令
    skyrtc.prototype.sendOffers = function () {
        let i, m,
            pc,
            that = this,
            pcCreateOfferCbGen = function (pc, socketId) {
                return function (session_desc) {
                    pc.setLocalDescription(session_desc);
                    that.socket.send(JSON.stringify({
                        "eventName": "__offer",
                        "data": {
                            "sdp": session_desc,
                            "socketId": socketId
                        }
                    }));
                };
            },
            pcCreateOfferErrorCb = function (error) {
                console.log(error);
            };
        for (i = 0, m = this.connections.length; i < m; i++) {
            pc = this.peerConnections[this.connections[i]];
            pc.createOffer(pcCreateOfferCbGen(pc, this.connections[i]), pcCreateOfferErrorCb);
        }
    };

    //接收到Offer类型信令后作为回应返回answer类型信令
    skyrtc.prototype.receiveOffer = function (socketId, sdp) {
        let pc = this.peerConnections[socketId];
        this.sendAnswer(socketId, sdp);
    };

    //发送answer类型信令
    skyrtc.prototype.sendAnswer = function (socketId, sdp) {
        let pc = this.peerConnections[socketId];
        let that = this;
        pc.setRemoteDescription(new nativeRTCSessionDescription(sdp));
        pc.createAnswer(function (session_desc) {
            pc.setLocalDescription(session_desc);
            that.socket.send(JSON.stringify({
                "eventName": "__answer",
                "data": {
                    "socketId": socketId,
                    "sdp": session_desc
                }
            }));
        }, function (error) {
            console.log(error);
        });
    };

    //接收到answer类型信令后将对方的session描述写入PeerConnection中
    skyrtc.prototype.receiveAnswer = function (socketId, sdp) {
        let pc = this.peerConnections[socketId];
        pc.setRemoteDescription(new nativeRTCSessionDescription(sdp));
    };


    /***********************点对点连接部分*****************************/
    //创建单个PeerConnection
    skyrtc.prototype.createPeerConnection = function () {
        let that = this;
        this.localPeer = new PeerConnection(iceServer);
        // console.log('localPeer',this.localPeer)

        //ICE信息
        this.localPeer.onicecandidate = function (evt) {
            console.log("ICE信息",evt);
            // that.emit("pc_get_ice_candidate", evt.candidate, this.peerConnections);
        };
        //检查状态
        // new        ICE代理正在收集候选人或等待提供远程候选人。
        // checking   ICE代理已经在至少一个组件上接收了远程候选者，并且正在检查候选但尚未找到连接。除了检查，它可能还在收集。
        // connected  ICE代理已找到所有组件的可用连接，但仍在检查其他候选对以查看是否存在更好的连接。它可能还在收集。
        // completed  ICE代理已完成收集和检查，并找到所有组件的连接。
        // failed     ICE代理已完成检查所有候选对，但未能找到至少一个组件的连接。可能已找到某些组件的连接。
        // disconnected ICE 连接断开
        // closed      ICE代理已关闭，不再响应STUN请求
        this.localPeer.oniceconnectionstatechange = (evt) => {
            console.log('ICE connection state change: ' + evt.target.iceConnectionState);
        };
        
        this.localPeer.onnegotiationneeded = function(e){
            that.localPeer.createOffer().then( offer =>{
                //设置连接的本地描述发送到信令服务器以便传送到远程方。
                that.localPeer.setLocalDescription(offer,() =>{
                    console.log('设置成功desc',offer)
                })
            });
        }

        

        //接收远端视频流
        this.localPeer.ontrack = function(e){
			if (e && e.streams) {
				message.log('收到对方音频/视频流数据...');
			}
		};

        return this.localPeer;
    };



    //关闭PeerConnection连接
    skyrtc.prototype.closePeerConnection = function (pc) {
        if (!pc) return;
        pc.close();
    };


    /***********************数据通道连接部分*****************************/


    //消息广播
    skyrtc.prototype.broadcast = function (message) {
        let socketId;
        for (socketId in this.dataChannels) {
            this.sendMessage(message, socketId);
        }
    };

    //发送消息方法
    skyrtc.prototype.sendMessage = function (message, socketId) {
        if (this.dataChannels[socketId].readyState.toLowerCase() === 'open') {
            this.dataChannels[socketId].send({
                type: "__msg",
                data: message
            });
        }
    };


    return new skyrtc();
};


export default SkyRTC;