<template>
    <div class="facetime">
        <window v-model:show="show" title="Facetime" width="1000" height="450">
            <div class="facetime-content" v-if="show">
                <div class="facetime-content-left">
                    <vm-active-user :activeUserList="activeUserList" @callUser="callUser"></vm-active-user>
                </div>
                <div class="facetime-content-right">
                    <vm-get-user 
                        v-show="!callConfig.isStartWebRtc" 
                        @webrtcStarter="webrtcStarter"
                        @getUserInfo="getCurrentSystemUserInfo">
                    </vm-get-user>
                    <div class="videos">
                        <video class="remote-video" poster="https://www.huangguangfa.cn/static/media/user.f7e06438.png" ref="remote_video_dom"></video>
                        <video class="local-video" ref="local_video_dom"></video>
                        <!-- 是否有人拨号 -->
                        <div class="call_btn" v-if="callConfig.isOpenCall">
                            <div class="call-info">
                                <span v-if="showCallInfo.isShowDes">正在呼叫：</span>
                                <span class="mr10">{{ callConfig.callName }}</span>
                                <span>{{ callConfig.callMobile }}</span>
                            </div>
                            <div class="call_btns justify-space-around">
                                <i class="iconfont macos-guaduan call_btn_common" @click="endCall"></i>
                                <i v-if="showCallInfo.isShowAnswer" class="iconfont macos-shipindianhua call_btn_common" @click="answerCall"></i>
                                <i v-if="callConfig.isStartCall" class="iconfont macos-liaotian call_btn_common" @click="handleChatroomStatus">
                                    <span v-show="callConfig.unreadMesNumber > 0" class="unreadMesNumber">{{ callConfig.unreadMesNumber }}</span>
                                </i>
                            </div>
                        </div>
                    </div>
                    <!-- 聊天室 -->
                    <vm-chatroom v-show="callConfig.showChatroom" @newMessage="newMessage" :MessageList="chatroomConfig.messageList"></vm-chatroom>
                </div>
            </div>
        </window>
    </div>
</template>

<script>
    import { ref, watch, reactive, computed  } from "vue";
    import { deepClone } from "@/utils/utils.js"
    import SkyRTC from "./hooks/webrtc.js"
    import chatroom from "./chatroom.vue"
    import activeUser from "./activeUser.vue"
    import getUser from "./getUserInfo.vue"
    export default{
        components:{
            vmChatroom:chatroom,
            vmActiveUser:activeUser,
            vmGetUser:getUser
        },
        props:{
            show:Boolean
        },
        setup(props, { emit }){
            let local_video_dom = ref(null)
            let remote_video_dom = ref(null)
            let rtc = SkyRTC();
            let user = reactive({ uid: null,  uname:null });
            let activeUserList = ref([]);
            let chatroomConfig = reactive({
                messageList:[]
            })
            let callConfig = reactive({
                //是否初始化了webrtc
                isStartWebRtc:false,
                //是否开启通话
                isOpenCall:false,
                //是否开始通话
                isStartCall:false,
                // 是否呼叫方
                isCaller:false,
                callMobile:null,
                callName:null,
                //是否显示聊天
                showChatroom:false,
                unreadMesNumber:0
            })
           
            /**********************************************************/
            /*                   webrtc通信                           */
            /**********************************************************/
            //成功创建WebSocket连接
            rtc.on("connected", function (socket) {
                //创建本地视频流
                rtc.createStream({ "video": true, "audio": true });
            });
            //创建本地视频流成功
            rtc.on("stream_created", function (stream) {
                let me_video = local_video_dom.value;
                rtc.attachStream(stream, me_video, true)
                //生成PeerConnection
                rtc.createPeerConnection()
            });
            //接收scoket消息
            rtc.on("socket_receive_message", function (serve_data) {
                const { sender, data } = serve_data;
                //派发当前活跃用户列表
                sender === 'system' && getActiveUserList(data);
                sender === 'exc' && data.exc_type === "communication" && newMessage(data);
                console.log('消息',sender,data)
            });
            //新的通话邀请
            rtc.on('call', data =>{
                const { isOpenCall } = callConfig;
                //正在通话中
                if( isOpenCall ) return;
                const { switch_status, uid, uname } = data;
                switch_status && startCall(uid,uname);
                console.log('通话邀请',data)
            })
            //收到对方音频/视频流数据
            rtc.on("remote_streams", function (stream) {
                let remote_video = remote_video_dom.value;
                if (!remote_video.srcObject || remote_video.srcObject.id !== stream.id) {
                    callConfig.isStartCall = true;
                    rtc.attachStream(stream, remote_video, false)
                }
            });

            //创建本地视频流失败
            rtc.on("stream_create_error", function () {
                console.log("创建视频流失败");
            });



            /**********************************************************/
            /*                   业务逻辑                              */
            /**********************************************************/

            watch( () => props.show ,status => {
                emit('update:show',status)
                status === false && webrtcClose()
            });

            let showCallInfo = computed( () =>{
                const { isStartCall, isOpenCall, isCaller } = callConfig;
                return {
                    isShowDes:isCaller === true && isOpenCall === true && isStartCall === false,
                    isShowAnswer:isCaller === false && isOpenCall === true && isStartCall === false,
                }
            })
            
            //methds
            function callUser(userInfo){
                const { uid, _is_me, uname } = userInfo;
                const { isStartCall } = callConfig;
                if( _is_me || isStartCall ) return;
                startCall(uid, uname, true);
                rtc.call(uid)
                
            }
            function webrtcStarter(){
                callConfig.isStartWebRtc = true;
                const { uid, uname } = user;
                rtc.connect(uid, uname);
            }
            function webrtcClose(){
                // rtc.closePeerConnection();
                rtc.closeVideoConnection()
            }
            function getCurrentSystemUserInfo(userInfo){
                const { uid, uname } = userInfo;
                user.uid = uid;
                user.uname = uname;
            }
            function endCall(){
                webrtcClose()
            }
            function startCall(uid,uname,isCaller = false){
                callConfig.callMobile = uid;
                callConfig.callName = uname;
                callConfig.isCaller = isCaller;
                callConfig.isOpenCall = true;
            }
            function answerCall(){
                const { callMobile } = callConfig;
                rtc.sendOffers(callMobile);
                rtc.sendIceData(callMobile,rtc.ICE);
            }
            function getActiveUserList(data){
                data.forEach( item => {
                    item._is_me = false
                    if( item.uid === user.uid ){  item._is_me = true }
                })
                activeUserList.value = data;
            }
            function handleChatroomStatus(){
                const { showChatroom } = callConfig;
                callConfig.showChatroom = !showChatroom;
                callConfig.unreadMesNumber = 0;
            }
            function newMessage(data, islocal = false){
                const { callMobile, showChatroom, unreadMesNumber } = callConfig;
                //本地消息推送
                if( islocal ){
                    chatroomConfig.messageList.push(data);
                    //远端推送
                    let clone_data = deepClone(data);
                    clone_data.type = 'left';
                    rtc.sendMessage(callMobile,clone_data, 'communication')
                }else{
                    const { call_uid, call_uname } = data;
                    const { mes_content, type } = data.data
                    let newMes = {
                        isHaveRead:showChatroom,
                        uid:call_uid,
                        uname:call_uname,
                        mes_content,
                        type
                    }
                    chatroomConfig.messageList.push(newMes);
                    callConfig.unreadMesNumber += showChatroom === false ? 1 : 0
                }
            }

            return {
                local_video_dom,
                remote_video_dom,
                activeUserList,
                user,
                callConfig,
                showCallInfo,
                chatroomConfig,

                callUser,
                getCurrentSystemUserInfo,
                answerCall,
                webrtcStarter,
                handleChatroomStatus,
                newMessage,
                endCall
            }
        }
    }
</script>

<style lang="less">
.facetime-content{ width: 100%;height: 100%;display: flex;background:#fff;
    .facetime-content-left{ width: 240px;padding:20px;overflow: hidden; box-sizing: border-box; overflow-y: auto;}
    .facetime-content-right{flex: 1;height: 100%;position: relative;border-left: 1px solid rgba(204,204,204,0.4);display: flex;width: 100%;
        .call_btn{position: absolute;right:-50px;top:20px;  transform: translate(-50%);z-index: 999;box-shadow: 0 4px 12px #ebedf0;padding:20px 10px; border-radius: 20px;background:#fff;
            .call-info{font-size: 12px;color: #898989;margin-bottom: 20px;}
            .call_btns{display:flex; 
                .call_btn_common{width: 30px;height: 30px;border-radius: 100%;display: block;display: flex;align-items: center;justify-content: center;color: #fff;cursor: pointer;}
                .macos-guaduan{background: red;}
                .macos-shipindianhua{background: #5bc24f;}
                .macos-liaotian{background: #5bc24f; position: relative;
                    .unreadMesNumber{position: absolute; right: -3px; top: -4px; color: #fff;
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
        .videos{
            position: relative;width: 100%;
            .remote-video{width: 100%;height: 100%;object-fit: cover;}
            .local-video{ width: 150px;height: 150px;bottom: 40px;right: 10px;z-index: 99;position: absolute;border-radius: 5px;border: 2px solid rgba(91,194,79,0.5); object-fit: cover; }
        }
    }
    .closure{position: absolute; left: 50%;bottom: 60px; transform: translate(-50%); z-index: 2; background: crimson;width: 40px;height:40px; border-radius:100%; display: flex; justify-content: center; align-items: center;
        .iconfont{ color:#fff; font-size: 25px;  cursor: pointer;  }
    }
}

</style>
