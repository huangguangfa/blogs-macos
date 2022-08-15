const SkyRTC = function () {
  //创建本地流
  let gThat;
  let PeerConnection =
    window.PeerConnection ||
    window.webkitPeerConnection00 ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection;
  let getUserMedia =
    navigator.getUserMedia || //旧版API
    navigator.mediaDevices?.getUserMedia || //最新的标准API
    navigator.webkitGetUserMedia || //webkit核心浏览器
    navigator.mozGetUserMedia || //firfox浏览器
    navigator.msGetUserMedia;

  let nativeRTCIceCandidate =
    window.mozRTCIceCandidate || window.RTCIceCandidate;
  let nativeRTCSessionDescription =
    window.mozRTCSessionDescription || window.RTCSessionDescription;

  const iceServer = {
    iceServers: [
      { url: "stun:stun.l.google.com:19302" },
      {
        url: "stun:182.92.163.143:3478",
      },
      {
        url: "turn:182.92.163.143:3478",
        username: "metartc",
        credential: "metartc",
      },
    ],
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
      i,
      m;
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
    //本地WebSocket连接
    this.socket = null;
    //本地相连的peer connection
    this.localPeer = null;
    this.ICE = null;
    //是否是呼叫方
    this.isCalls = false;
    this.user = {
      wsId: null,
      uName: null,
      uAvatar: null,
      isStartCamera: false,
    };
    this.receiveUser = {
      wsId: null,
      uName: null,
      uAvatar: null,
      isStartCamera: false,
    };
  }

  //继承自事件处理器，提供绑定事件和触发事件的功能
  skyrtc.prototype = new EventEmitter();

  /*************************服务器连接部分***************************/
  skyrtc.prototype.connect = function (wsId, uName, uAvatar, socket) {
    this.user.wsId = wsId;
    this.user.uName = uName;
    this.user.uAvatar = uAvatar;
    this.user.isStartCamera = getUserMedia ? "1" : "0";
    socket = this.socket = socket;
    socket.send(
      JSON.stringify({
        event: "webrtc",
        data: {
          type: "user",
          wsId: sessionStorage.getItem("userId"),
          data: this.user,
        },
      })
    );
    this.emit("connected", this.user);

    socket.addEventListener("message", this.receiveSocketMessage);
    socket.webrtc = this;
  };

  skyrtc.prototype.receiveSocketMessage = function (mes) {
    const { event, data } = JSON.parse(mes.data);
    if (event === "webrtc") {
      let message = null;
      typeof data === "string"
        ? (message = JSON.parse(data))
        : (message = data);
      const { sender } = message;
      let scoketData = message.data;
      if (sender === "exc") {
        const { data, call_uid, call_uname, exc_type } = scoketData;
        // console.log('exc_type', exc_type, data)
        this.webrtc.receiveUser.wsId = call_uid;
        this.webrtc.receiveUser.uname = call_uname;
        // 添加远端offer
        exc_type === "sdp" && this.webrtc.receiveOffer(data);
        // 添加IEC
        exc_type === "ice" && this.webrtc.receiveIce(data);
        // 呼叫监听
        exc_type === "call" && this.webrtc.emit("call", data);
        // 聊天
        exc_type === "chats" && this.webrtc.emit("chats", data);
        // 挂断
        exc_type === "endCall" && this.webrtc.emit("endCall", data);
      }
      this.webrtc.emit("socket_receive_message", message);
    }
  };

  /*************************流处理部分*******************************/
  //访问用户媒体设备的兼容方法
  function getUserMediaFun(constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        //最新的标准API
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(success)
          .catch(error);
      } catch (e) {
        console.log(e);
      }
    } else if (navigator.webkitGetUserMedia) {
      //webkit核心浏览器
      navigator.webkitGetUserMedia(constraints, success, error);
    } else if (navigator.mozGetUserMedia) {
      //firfox浏览器
      navigator.mozGetUserMedia(constraints, success, error);
    } else if (navigator.getUserMedia) {
      //旧版API
      navigator.getUserMedia(constraints, success, error);
    } else {
      that.emit(
        "stream_create_error",
        new Error("WebRTC is not yet supported in this browser.")
      );
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
  //创建本地视频流
  skyrtc.prototype.createStream = function (options) {
    let that = this;
    gThat = this;
    options.video = !!options.video;
    options.audio = !!options.audio;
    if (getUserMedia) {
      // 调用用户媒体设备, 访问摄像头
      getUserMediaFun(options, createStreamSuccess, createStreamError);
    } else {
      that.emit(
        "stream_create_error",
        new Error("WebRTC is not yet supported in this browser.")
      );
    }
  };

  //将流绑定到video标签上用于输出
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
  /******* SDP信息交换 ******/
  //向用户发送Offer类型信令
  skyrtc.prototype.sendOffers = function (wsId) {
    this.isCalls = true;
    this.sendMessage(wsId, this.localPeer.localDescription, "sdp");
  };
  //接收到answer类型信令后将对方的sdp描述写入PeerConnection中返回answer类型信令
  skyrtc.prototype.receiveOffer = function (sdp) {
    this.localPeer.setRemoteDescription(new nativeRTCSessionDescription(sdp));
    //呼叫方不需要在去获取sdp
    this.isCalls === false && this.sendAnswer();
  };
  //发送answer类型信令
  skyrtc.prototype.sendAnswer = function () {
    let that = this;
    this.localPeer.createAnswer().then((answerOffer) => {
      //设置下本地
      that.localPeer.setLocalDescription(answerOffer);
      const { wsId } = that.receiveUser;
      that.sendMessage(wsId, answerOffer, "sdp");
    });
  };
  /****** ICE 信息交换 *****/
  //向用户发送ICE信息后将对方的ice描述写入PeerConnection中返回answer类型信令
  skyrtc.prototype.sendIceData = function (wsId, ice) {
    this.sendMessage(wsId, ice, "ice");
  };
  //接收answer类型信令
  skyrtc.prototype.receiveIce = function (ice) {
    const { wsId } = this.receiveUser;
    let candidate = new nativeRTCIceCandidate(ice);
    this.localPeer.addIceCandidate(candidate);
    //判断是否是接收方
    this.isCalls === false && this.sendIceData(wsId, this.ICE);
  };

  /***********************点对点连接部分*****************************/
  //呼叫
  skyrtc.prototype.call = function (call_uid, type) {
    const { wsId, uName } = this.user;
    call_uid &&
      this.sendMessage(call_uid, { switch_status: true, wsId, uName }, type);
  };

  //创建单个PeerConnection
  skyrtc.prototype.createPeerConnection = function () {
    let that = this;
    this.localPeer = new PeerConnection(iceServer);
    //本地数据流添加到PeerConnection
    gThat?.localMediaStream
      .getTracks()
      .forEach((track) =>
        this.localPeer.addTrack(track, gThat.localMediaStream)
      );
    //ICE信息
    this.localPeer.onicecandidate = function (evt) {
      let candidate = evt.candidate;
      if (candidate) {
        that.ICE = candidate;
      }
    };
    //rtc连接状态变化
    this.localPeer.oniceconnectionstatechange = (evt) => {
      // console.log('ICE连接状态: ' + evt.target.iceConnectionState);
    };

    this.localPeer.onnegotiationneeded = function (e) {
      that.localPeer.createOffer().then((offer) => {
        //设置连接的本地描述发送到信令服务器以便传送到远程方
        that.localPeer.setLocalDescription(offer, () => {});
      });
    };

    //接收远端视频流
    this.localPeer.ontrack = function (e) {
      if (e && e.streams.length) {
        that.emit("remote_streams", e.streams[0]);
      }
    };
    return this.localPeer;
  };

  //关闭PeerConnection连接
  skyrtc.prototype.closePeerConnection = function (restart = false) {
    if (!this.localPeer) return;
    this.localPeer.close();
    this.initStatus();
    restart && this.createPeerConnection();
  };
  skyrtc.prototype.initStatus = function () {
    this.localPeer = null;
    this.isCalls = false;
    this.receiveUser = {
      wsId: null,
      uname: null,
      uAvatar: null,
    };
  };
  //关闭视频流
  skyrtc.prototype.closeVideoConnection = function () {
    gThat &&
      gThat.localMediaStream?.getTracks().forEach((track) => {
        track.stop();
      });
    gThat = null;
  };

  /***********************数据通道连接部分*****************************/
  //发送消息方法
  skyrtc.prototype.sendMessage = function (callId, message, exc_type) {
    const { wsId, uName } = this.user;
    this.socket.send(
      JSON.stringify({
        event: "webrtc",
        data: {
          wsId: callId,
          type: "call",
          data: {
            call_uid: wsId,
            call_uname: uName,
            exc_type,
            data: message,
          },
        },
      })
    );
  };

  return new skyrtc();
};

export default SkyRTC;
