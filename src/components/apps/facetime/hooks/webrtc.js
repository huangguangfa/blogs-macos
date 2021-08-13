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
            { "url": "stun:stun.l.google.com:19302" },
            { "url": "stun:global.stun.twilio.com:3478" },
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
        this.events[eventName] = this.events[eventName] ?? [];
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
        this.ICE = null;
        //是否是呼叫方
        this.isCalls = false;
        this.user = {
            uid:null,
            uname:null
        };
        this.receiveUser = {
            uid:null,
            uname:null
        }
    }

    //继承自事件处理器，提供绑定事件和触发事件的功能
    skyrtc.prototype = new EventEmitter();

    /*************************服务器连接部分***************************/

    skyrtc.prototype.connect = function (uid,uname) {
        let socket, that = this; 
        socket = this.socket = initScoket(uid,uname);
        this.user.uid = uid;
        this.user.uname = uname;
        socket.onopen(function () {
            that.emit("socket_opened", socket);
            that.emit('connected', socket);
        });

        socket.onmessage( function (message) {
            typeof message === 'string' ? message = JSON.parse(message) : message
            const { sender } = message;
            let scoketData = message.data;
            if( sender === "exc" ){
                const { data, call_uid, call_uname, exc_type  } = scoketData;
                that.receiveUser.uid = call_uid;
                that.receiveUser.uname = call_uname;
                //添加远端offer
                exc_type === "sdp" && that.receiveOffer(data)
                //添加IEC
                exc_type === "ice" && that.receiveIce(data);
            }
            that.emit("socket_receive_message", message, socket );
        });

        socket.onerror(function (error) {
            that.emit("socket_error", error, socket);
        });

        socket.onclose(function (data) {
            that.localMediaStream.close();
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
            // 调用用户媒体设备, 访问摄像头
            getUserMediaFun(options, createStreamSuccess, createStreamError);
        } else {
            that.emit("stream_create_error", new Error('WebRTC is not yet supported in this browser.'));
        }
    };


    // 将流绑定到video标签上用于输出
    skyrtc.prototype.attachStream = function (stream, dom, isSound = false) {
        if (navigator.mediaDevices.getUserMedia) {
            dom.srcObject = stream;
        } else {
            dom.src = webkitURL.createObjectURL(stream);
        }
        isSound && (dom.volume = 0.0);
        dom.play();
    };


    /***********************信令交换部分*******************************/
    /******* SDP 信息交换 ******/
    //向用户发送Offer类型信令
    skyrtc.prototype.sendOffers = function ( uid ) {
        this.isCalls = true;
        this.sendMessage(uid,this.localPeer.localDescription, 'sdp')
    };
    //接收到answer类型信令后将对方的sdp描述写入PeerConnection中返回answer类型信令
    skyrtc.prototype.receiveOffer = function (sdp) {
        this.localPeer.setRemoteDescription(new nativeRTCSessionDescription(sdp))
        //呼叫方不需要在去获取sdp
        this.isCalls === false && this.sendAnswer();
    };
    //发送answer类型信令
    skyrtc.prototype.sendAnswer = function () {
        let that = this;
        this.localPeer.createAnswer().then( answerOffer =>{
            //设置下本地
            that.localPeer.setLocalDescription(answerOffer)
            const { uid } = that.receiveUser;
            that.sendMessage(uid, answerOffer, 'sdp')
        });
    };
    /****** ICE 信息交换 *****/
    //向用户发送ICE信息后将对方的ice描述写入PeerConnection中返回answer类型信令
    skyrtc.prototype.sendIceData = function (uid,ice){
        console.log(ice)
        this.sendMessage(uid,ice, 'ice')
    }
    //接收answer类型信令
    skyrtc.prototype.receiveIce = function (ice){
        const { uid } = this.receiveUser;
        console.log('收到ice',ice)
        let candidate = new nativeRTCIceCandidate(ice);
        this.localPeer.addIceCandidate(candidate);
        //判断是否是接收方
        this.isCalls === false && this.sendIceData(uid,this.ICE)
    }
   

    /***********************点对点连接部分*****************************/
    //创建单个PeerConnection
    skyrtc.prototype.createPeerConnection = function () {
        let that = this;
        this.localPeer = new PeerConnection(iceServer);
        //本地数据流添加到PeerConnection
        gThat && this.localPeer.addStream(gThat.localMediaStream);
        //ICE信息
        this.localPeer.onicecandidate = function (evt) {
            let candidate = evt.candidate
            if( candidate ){
                that.ICE = candidate;
                // console.log("ICE信息",that.ICE);
            }
        };
        //rtc连接状态变化
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
			if (e && e.streams.length) {
                that.emit('remote_streams', e.streams[0]); 
			}
		};
        return this.localPeer;
    };

    //关闭PeerConnection连接
    skyrtc.prototype.closePeerConnection = function () {
        let peer = this.localPeer;
        if (!peer) return;
        peer.close();
    };

    /***********************数据通道连接部分*****************************/
    //发送消息方法
    skyrtc.prototype.sendMessage = function (callId, message, exc_type) {
        const { uid, uname } = this.user;
        let data = {
            uid:callId,
            data:{
                call_uid:uid,
                call_uname:uname,
                exc_type,
                data:message
            }
        }
        this.socket.send(data);
    };

    return new skyrtc();
};


export default SkyRTC;