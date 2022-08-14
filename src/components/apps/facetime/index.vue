<template>
  <div class="facetime">
    <window
      v-model:show="appInfo.desktop"
      @change="changes"
      title="Facetime"
      width="1000"
      height="450"
      :appInfo="appInfo"
    >
      <div class="facetime-content" v-if="appInfo.desktop">
        <div class="facetime-content-left">
          <vm-active-user
            :activeUserList="activeUserList"
            @callUser="callUser"
            @chat="chats"
          >
          </vm-active-user>
        </div>
        <div class="facetime-content-right">
          <vm-get-user
            v-show="!callConfig.isStartWebRtc"
            @submit="webrtcStarter"
            @getUserInfo="getCurrentSystemUserInfo"
          >
          </vm-get-user>
          <div class="videos">
            <video
              class="remote-video"
              poster="../../../assets/images/facetime/video_default.png"
              ref="remote_video_dom"
            ></video>
            <video
              class="local-video"
              poster="../../../assets/images/facetime/video_default.png"
              ref="local_video_dom"
            ></video>
            <!-- 是否有人拨号 -->
            <div class="call_btn" v-if="callConfig.isOpenCall">
              <div class="call-info">
                <span v-if="showCallInfo.isShowDes">正在呼叫：</span>
                <span class="mr10">{{ callConfig.callName }}</span>
                <span>{{ callConfig.callMobile }}</span>
              </div>
              <div class="call_btns justify-space-around">
                <i
                  v-if="callConfig.type === 'call'"
                  class="iconfont macos-guaduan call_btn_common"
                  @click="endCall"
                ></i>
                <i
                  v-if="showCallInfo.isShowAnswer && callConfig.type === 'call'"
                  class="iconfont macos-shipindianhua call_btn_common"
                  @click="answerCall"
                ></i>
                <i
                  v-if="callConfig.isStartCall || callConfig.type === 'chats'"
                  class="iconfont macos-liaotian call_btn_common"
                  @click="handleChatroomStatus"
                >
                  <span
                    v-show="callConfig.unreadMesNumber > 0"
                    class="unreadMesNumber"
                    >{{ callConfig.unreadMesNumber }}</span
                  >
                </i>
              </div>
            </div>
          </div>
          <!-- 聊天室 -->
          <vm-chatroom
            v-show="callConfig.showChatroom"
            @newMessage="newMessage"
            :MessageList="chatroomConfig.messageList"
          ></vm-chatroom>
        </div>
      </div>
    </window>
  </div>
</template>

<script setup>
import { ref, watch, reactive, computed, getCurrentInstance } from "vue";
import { deepClone } from "@/utils/utils";
import SkyRTC from "./hooks/webrtc";
import vmChatroom from "./chatroom.vue";
import vmActiveUser from "./activeUser.vue";
import vmGetUser from "../../locks/index.vue";
const props = defineProps({
  appInfo: Object,
});
const { proxy } = getCurrentInstance();
let local_video_dom = ref(null);
let remote_video_dom = ref(null);
let rtc = SkyRTC();
let user = reactive({
  wsId: null,
  uName: null,
  uAvatar: null,
  isStartCamera: "0",
});
let activeUserList = ref([]);
let chatroomConfig = reactive({
  messageList: [],
});
let callConfig = reactive({
  // 是否初始化了webrtc
  isStartWebRtc: false,
  // 是否开启通话
  isOpenCall: false,
  // 是否开始通话
  isStartCall: false,
  // 是否呼叫方
  isCaller: false,
  callMobile: null,
  callName: null,
  type: null,
  // 是否显示聊天
  showChatroom: false,
  unreadMesNumber: 0,
});
/**********************************************************/
/*                   webrtc通信                           */
/**********************************************************/
// 成功创建WebSocket连接
rtc.on("connected", function () {
  //创建本地视频流
  rtc.createStream({ video: true, audio: true });
});

// 创建本地视频流成功
rtc.on("stream_created", function (stream) {
  let me_video = local_video_dom.value;
  rtc.attachStream(stream, me_video, true);
  //生成PeerConnection
  rtc.createPeerConnection();
});
// 接收scoket消息
rtc.on("socket_receive_message", function (serve_data) {
  const { sender, data } = serve_data;
  // console.log('消息',sender,data)
  // 派发当前活跃用户列表
  sender === "system" && getActiveUserList(data);
  // 接收文字消息
  sender === "exc" && data.exc_type === "communication" && newMessage(data);
});
// 新的通话邀请
rtc.on("call", (data) => {
  const { isOpenCall } = callConfig;
  // 正在通话中
  if (isOpenCall) return;
  const { switch_status, wsId, uName } = data;
  switch_status && startCall(wsId, uName, false, "call");
});
rtc.on("chats", (data) => {
  const { switch_status, wsId, uName } = data;
  switch_status && startCall(wsId, uName, false, "chats");
});
// 挂断电话
rtc.on("endCall", (data) => {
  chatroomConfig.messageList = [];
  endCall(false);
});
// 收到对方音频/视频流数据
rtc.on("remote_streams", function (stream) {
  let remote_video = remote_video_dom.value;
  callConfig.isStartCall = true;
  rtc.attachStream(stream, remote_video, false);
  remote_video.play();
});
// 创建本地视频流失败
rtc.on("stream_create_error", function () {
  console.log("创建视频流失败");
});

/**********************************************************/
/*                   业务逻辑                              */
/**********************************************************/

watch(
  () => props.appInfo.desktop,
  (status) => {
    if (status === false) {
      webrtcClose();
    } else {
      callConfig.isStartWebRtc = false;
    }
  }
);

let showCallInfo = computed(() => {
  const { isStartCall, isOpenCall, isCaller } = callConfig;
  return {
    isShowDes:
      isCaller === true && isOpenCall === true && isStartCall === false,
    isShowAnswer:
      isCaller === false && isOpenCall === true && isStartCall === false,
  };
});

//methds
function callUser(userInfo) {
  const { _is_me, uName, wsId } = userInfo;
  const { isStartCall } = callConfig;
  if (_is_me || isStartCall) return;
  startCall(wsId, uName, true, "call");
  rtc.call(wsId, "call");
}
function chats(userInfo) {
  callConfig.showChatroom = true;
  const { uName, wsId } = userInfo;
  startCall(wsId, uName, false, "chats");
  rtc.call(wsId, "chats");
}
function webrtcStarter() {
  callConfig.isStartWebRtc = true;
  const { wsId, uName, uAvatar } = user;
  rtc.connect(wsId, uName, uAvatar, proxy.$scoket.ws);
}
function webrtcClose() {
  rtc.closeVideoConnection();
  rtc.closePeerConnection();
  activeUserList.value = [];
}
function getCurrentSystemUserInfo(userInfo) {
  const { uName, uAvatar } = userInfo;
  user.wsId = sessionStorage.getItem("userId");
  user.uName = uName;
  user.uAvatar = uAvatar;
}
function endCall(isNotify = true) {
  const { callMobile } = callConfig;
  isNotify && rtc.sendMessage(callMobile, null, "endCall");
  chatroomConfig.messageList = [];
  initPageStatus();
  //关闭 && 重置 peer
  rtc.closePeerConnection(true);
}
function startCall(wsId, uName, isCaller = false, type) {
  callConfig.callMobile = wsId;
  callConfig.callName = uName;
  callConfig.isCaller = isCaller;
  callConfig.isOpenCall = true;
  callConfig.type = type;
}
function initPageStatus() {
  remote_video_dom.value.load();
  callConfig.isOpenCall = false;
  callConfig.isStartCall = false;
  callConfig.isCaller = false;
  callConfig.callMobile = null;
  callConfig.callName = null;
  callConfig.showChatroom = false;
  callConfig.unreadMesNumber = 0;
}
function answerCall() {
  const { callMobile } = callConfig;
  rtc.sendOffers(callMobile);
  rtc.sendIceData(callMobile, rtc.ICE);
}
function getActiveUserList(data) {
  data.forEach((item) => {
    item._is_me = false;
    if (item.wsId === user.wsId) {
      item._is_me = true;
    }
  });
  activeUserList.value = data;
}
function handleChatroomStatus() {
  const { showChatroom } = callConfig;
  callConfig.showChatroom = !showChatroom;
  callConfig.unreadMesNumber = 0;
}
function newMessage(data, islocal = false) {
  const { callMobile, showChatroom } = callConfig;
  const { uAvatar } = user;
  //本地消息推送
  if (islocal) {
    data.uAvatar = uAvatar;
    chatroomConfig.messageList.push(data);
    //远端推送
    let clone_data = deepClone(data);
    clone_data.type = "left";
    rtc.sendMessage(callMobile, clone_data, "communication");
  } else {
    const { call_uid, call_uname } = data;
    const { mes_content, type, uAvatar } = data.data;
    let newMes = {
      isHaveRead: showChatroom,
      wsId: call_uid,
      uname: call_uname,
      uAvatar,
      mes_content,
      type,
    };
    chatroomConfig.messageList.push(newMes);
    callConfig.unreadMesNumber += showChatroom === false ? 1 : 0;
  }
}
function changes({ type }) {
  if (type === "close" && callConfig.isStartCall) {
    endCall();
  }
  // 关闭win弹窗
  webrtcClose();
}
</script>

<style lang="less">
.facetime-content {
  width: 100%;
  height: 100%;
  display: flex;
  background: #fff;
  .facetime-content-left {
    width: 240px;
    padding: 20px;
    overflow: hidden;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .facetime-content-right {
    flex: 1;
    height: 100%;
    position: relative;
    border-left: 1px solid rgba(204, 204, 204, 0.4);
    display: flex;
    width: 100%;
    .call_btn {
      position: absolute;
      right: -50px;
      top: 20px;
      transform: translate(-50%);
      z-index: 999;
      box-shadow: 0 4px 12px #ebedf0;
      padding: 20px 10px;
      border-radius: 20px;
      background: #fff;
      .call-info {
        font-size: 12px;
        color: #898989;
        margin-bottom: 20px;
      }
      .call_btns {
        display: flex;
        .call_btn_common {
          width: 30px;
          height: 30px;
          border-radius: 100%;
          display: block;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
        }
        .macos-guaduan {
          background: red;
        }
        .macos-shipindianhua {
          background: #5bc24f;
        }
        .macos-liaotian {
          background: #5bc24f;
          position: relative;
          .unreadMesNumber {
            position: absolute;
            right: -3px;
            top: -4px;
            color: #fff;
            z-index: 2;
            width: 15px;
            height: 15px;
            display: block;
            line-height: 15px;
            background: red;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            border-radius: 100%;
          }
        }
      }
    }
    .videos {
      position: relative;
      width: 100%;
      .remote-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .local-video {
        width: 150px;
        height: 150px;
        bottom: 40px;
        right: 10px;
        z-index: 99;
        position: absolute;
        border-radius: 5px;
        border: 2px solid rgba(91, 194, 79, 0.5);
        object-fit: cover;
      }
    }
  }
  .closure {
    position: absolute;
    left: 50%;
    bottom: 60px;
    transform: translate(-50%);
    z-index: 2;
    background: crimson;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      color: #fff;
      font-size: 25px;
      cursor: pointer;
    }
  }
}
</style>
