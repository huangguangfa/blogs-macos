<template>
    <div class="facetime">
        <window v-model:show="show" title="Facetime" width="1000" height="600">
            <div class="facetime-content" v-if="show">
                <div class="facetime-content-left">
                    <div class="active-user" v-show="activeUserList.length">
                        <div class="user" v-for="item in activeUserList" :key="item" :class="{ 'is-me': item._is_me  } ">
                            <div class="flex align-items-center" >
                                <svg t="1628523262763" class="icon user-avatar "  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8780" width="64" height="64"><path d="M1008.829848 511.99578c0-274.387743-222.425226-496.829848-496.829848-496.829848-274.387743 0-496.829848 222.442106-496.829848 496.829848 0 181.948983 97.865412 340.967618 243.768933 427.523988 48.114066-59.80289 121.80851-98.152358 204.533309-98.152358h46.898766c91.383811 0 171.787725 46.721535 218.821525 117.546521 165.533993-80.606463 279.637164-250.410886 279.637163-446.918151z" fill="#80ACEA" p-id="8781"></path><path d="M510.37116 841.36741h-46.898766c-82.733238 0-156.419243 38.349468-204.533309 98.152358a494.36549 494.36549 0 0 0 253.060915 69.305861 494.728392 494.728392 0 0 0 217.192685-49.911698C682.158885 888.088945 601.754972 841.36741 510.37116 841.36741z" fill="#96529A" p-id="8782"></path><path d="M557.261487 731.804736h-135.615669v125.648521l-0.016879 0.270066c8.397386 29.555422 31.690637 50.004533 65.432091 50.004533 33.783653 0 62.123775-24.103451 70.478963-52.241022l-0.278506-123.682098z" fill="#FFC6A2" p-id="8783"></path><path d="M557.261487 731.804736h-135.615669v125.648521l-0.016879 0.067516c8.397386 29.572301 31.690637 50.207083 65.432091 50.207083 33.783653 0 62.123775-24.103451 70.478963-52.241022l-0.278506-123.682098z" fill="#FFC6A2" p-id="8784"></path><path d="M296.005736 547.036931a44.341572 44.341572 0 0 1-88.691584 0v-22.179225a44.341572 44.341572 0 0 1 88.691584 0v22.179225z" fill="#FFC6A2" p-id="8785"></path><path d="M296.005736 547.036931a44.341572 44.341572 0 0 1-88.691584 0v-22.179225a44.341572 44.341572 0 0 1 88.691584 0v22.179225z" fill="#FFC6A2" p-id="8786"></path><path d="M769.01908 547.036931a44.341572 44.341572 0 0 1-88.683145 0v-22.179225a44.341572 44.341572 0 0 1 88.683145 0v22.179225z" fill="#FFC6A2" p-id="8787"></path><path d="M769.01908 547.036931a44.341572 44.341572 0 0 1-88.683145 0v-22.179225a44.341572 44.341572 0 0 1 88.683145 0v22.179225z" fill="#FFC6A2" p-id="8788"></path><path d="M739.455218 549.805115c0 137.261388-111.27591 248.520419-248.528858 248.520419h-5.511048c-137.252948 0-248.528859-111.267471-248.528859-248.520419V440.791013c0-137.252948 111.27591-248.511979 248.528859-248.511979h5.511048c137.252948 0 248.528859 111.267471 248.528858 248.511979v109.014102z" fill="#FFC6A2" p-id="8789"></path><path d="M699.69634 356.918431l-29.631378 5.139707s42.56082 241.777192 8.422704 284.042626c-58.798579 72.75765-308.036363 66.141017-374.16894 0-38.425424-38.425424-5.215663-285.325443-5.215663-285.325443l-61.912785 68.006165c-0.177231 3.983483-0.303825 7.983846-0.303825 12.009527v109.005662c0 137.261388 111.27591 248.520419 248.528859 248.520419h5.511048c137.252948 0 248.528859-111.267471 248.528858-248.520419V440.791013c0-4.017242-39.573208-79.889099-39.758878-83.872582" fill="#442A1C" p-id="8790"></path><path d="M731.564208 371.088492c-27.656516-107.089877-124.905838-186.202534-240.637848-186.202534h-5.511048c-115.723571 0-212.981332 79.112657-240.637848 186.202534H731.564208z" fill="#442A1C" p-id="8791"></path><path d="M256.40721 456.134176c21.023003-35.969505 35.657241-73.3653 43.894274-111.908879v-76.589221a247.6849 247.6849 0 0 0-63.415031 165.787181v48.84831a150.081116 150.081116 0 0 0 19.520757-26.137391M720.862816 456.134176c-21.023003-35.969505-35.657241-73.3653-43.902714-111.908879v-76.589221a247.651142 247.651142 0 0 1 63.42347 165.787181v48.84831a149.650697 149.650697 0 0 1-19.520756-26.137391" fill="#442A1C" p-id="8792"></path><path d="M763.457394 139.734186s-165.356762 45.151772-285.139772 45.151772c-119.79145 0-68.765727 163.103393 135.100854 181.180982 176.378858 17.689367 151.81123-218.332028 150.038918-226.332754M599.028986 681.226311c0 20.719178-21.942917 35.800714-48.215341 35.800714h-125.294058c-26.272424 0-48.215341-15.081536-48.215342-35.800714v-22.753117c0-20.727617 21.942917-37.522389 48.215342-37.522389h125.294058c26.272424 0 48.215341 16.794771 48.215341 37.522389v22.753117z" fill="#442A1C" p-id="8793"></path><path d="M429.756258 671.613625a55.388987 55.388987 0 1 0 110.786414 0h-110.786414z" fill="#FCFCFC" p-id="8794"></path><path d="M639.792175 498.146423c-0.945233-24.795497-21.301509-44.620079-46.324874-44.620078s-45.379641 19.833022-46.324875 44.620078h0.312265c-0.109715 0.523254-0.312265 1.00431-0.312265 1.561323a7.578746 7.578746 0 0 0 15.140613 0c0-0.548573-0.19411-1.038069-0.312264-1.561323h0.379781a31.20958 31.20958 0 0 1 31.125184-29.504784c16.676617 0 30.163072 13.072915 31.116745 29.504784h0.438858c-0.151913 0.582331-0.362902 1.156223-0.362902 1.789192a7.578746 7.578746 0 0 0 15.140613 0c0-0.632969-0.21099-1.20686-0.362902-1.789192h0.346023zM426.726447 498.146423c-0.945233-24.795497-21.301509-44.620079-46.324874-44.620078s-45.379641 19.833022-46.324875 44.620078h0.312265c-0.109715 0.523254-0.312265 1.00431-0.312265 1.561323a7.578746 7.578746 0 0 0 15.140613 0c0-0.548573-0.19411-1.038069-0.312265-1.561323h0.379782a31.20958 31.20958 0 0 1 31.125184-29.504784c16.676617 0 30.163072 13.072915 31.116745 29.504784h0.438858c-0.151913 0.582331-0.362902 1.156223-0.362902 1.789192a7.578746 7.578746 0 0 0 15.140613 0c0-0.632969-0.21099-1.20686-0.362902-1.789192h0.346023z" fill="#4C362A" p-id="8795"></path><path d="M468.991882 572.170011a33.44607 25.074003 90 1 0 50.148006 0 33.44607 25.074003 90 1 0-50.148006 0Z" fill="#FF9A67" p-id="8796"></path><path d="M334.068258 586.897085m-39.033074 0a39.033074 39.033074 0 1 0 78.066149 0 39.033074 39.033074 0 1 0-78.066149 0Z" fill="#FDB18F" p-id="8797"></path></svg>
                                <div class="user_info" >
                                    <p class="user-phone">{{ item.uid }}</p>
                                    <p class="user-name">{{ item.uname }} </p>
                                </div>
                            </div>
                            <i class="iconfont macos-shipindianhua" @click="callUser(item)"></i>
                        </div>
                    </div>
                    <div class="no-data" v-show="!activeUserList.length">
                        <vm-empty text="暂无用户"></vm-empty>
                    </div>
                </div>
                <div class="facetime-content-right">
                    <div class="facetime-content-right-userInfo">
                        <div class="userInfo">
<!--                            <img class="userInfo_img" src="../../../assets/images/facetime/login.png" alt="">-->
                        </div>
                    </div>
                    <video class="remote-video" ref="remote_video_dom"></video>
                    <video class="local-video" ref="local_video_dom"></video>
                </div>
            </div>
        </window>
    </div>
</template>

<script>
    import { ref, watch, reactive, onMounted, onBeforeUnmount  } from "vue";
    import SkyRTC from "./hooks/webrtc.js"
    import { getRandomMoble, getRandomName } from "@/utils/utils.js"
    export default{
        props:{
            show:Boolean
        },
        setup(props, { emit }){
            let local_video_dom = ref(null)
            let remote_video_dom = ref(null)
            let rtc = SkyRTC();
            let user = { uid:getRandomMoble(),  uname:getRandomName() };
            let activeUserList = ref([]);
            let sockets = null;
            /**********************************************************/
            /*                   webrtc通信                           */
            /**********************************************************/
            //成功创建WebSocket连接
            rtc.on("connected", function (socket) {
                //创建本地视频流
                rtc.createStream({ "video": true, "audio": true });
                sockets = socket;
            });
            //接收scoket消息
            rtc.on("socket_receive_message", function (serve_data,socket) {
                const { sender, data } = serve_data;
                //目前系统只会派发当前活跃用户列表
                if( sender === 'system' ){
                    data.forEach( item => {
                        item._is_me = false
                        if( item.uid === user.uid ){  item._is_me = true }
                    })
                    activeUserList.value = data;
                }
                console.log('消息',serve_data)
            });

            //创建本地视频流成功
            rtc.on("stream_created", function (stream) {
                let me_video = local_video_dom.value;
                rtc.attachStream(stream, me_video, true)
                //生成PeerConnection
                rtc.createPeerConnection()
            });

            rtc.on("remote_streams", function (stream) {
                let remote_video = remote_video_dom.value;
                if (!remote_video.srcObject || remote_video.srcObject.id !== stream.id) {
				    console.log('收到对方音频/视频流数据...',stream);
                    rtc.attachStream(stream, remote_video, false)
                }
            });

            //创建本地视频流失败
            rtc.on("stream_create_error", function () {
                console.log("创建视频流失败");
            });

            /**********************************************************/
            /*                   业务逻辑                               */
            /**********************************************************/
            watch( () => props.show ,status => {
                emit('update:show',status)
                if( status ){
                    webrtcStarter()
                }else{
                    webrtcClose()
                }
            });
            function webrtcStarter(){
                const { uid, uname } = user;
                rtc.connect(uid, uname);
            }
            function webrtcClose(){
                rtc.closePeerConnection();
            }
            //methds
            function callUser(userInfo){
                const { uid, _is_me } = userInfo;
                console.log(_is_me)
                if( _is_me ) return ;
                rtc.sendOffers(uid);
                rtc.sendIceData(uid,rtc.ICE)
            }
            return {
                local_video_dom,
                remote_video_dom,
                activeUserList,

                //methods
                callUser
            }
        }
    }
</script>

<style lang="less">
.facetime-content{ width: 100%;height: 100%;display: flex;
    .facetime-content-left{ width: 240px;padding:20px;overflow: hidden; box-sizing: border-box; overflow-y: auto;
        .active-user{width: 100%;
            .user{display: flex;align-items: center; justify-content: space-between; position: relative;padding-bottom:10px;margin-top:10px;
                &::after{ content:"";position: absolute;bottom: 0;left: 45px; width: 100%;height: 1px;background: rgba(204,204,204,0.4); }
                .user-avatar{width:40px;height: 40px;margin-right: 10px;}
                .user_info{font-size: 14px;
                    .user-phone{font-weight: bold;}
                    .user-name{ font-size: 12px;margin-top: 4px; }
                }
                .macos-shipindianhua{font-size:30px;color:#5bc24f;}
            }
            .is-me{ filter: grayscale(100%);}
        }
    }

    .facetime-content-right{flex: 1;height: 100%;position: relative;border-left: 1px solid rgba(204,204,204,0.4);position: relative;
        .facetime-content-right-userInfo{position: absolute;left: 0;top: 0;width: 100%;height: 100%;z-index: 100;background: #fff;
            .userInfo{ width: 100%;height: 100%;background: red; position: absolute; left: 50%;top: 50%;transform: translate(-50%, -50%);background-color: #fff;padding: 10px;box-sizing: border-box;
                background-image: url("../../../assets/images/facetime/login.png") ;background-repeat: no-repeat;
                .userInfo_img{
                    height: 100%;width: auto;
                }
            }
        }
        .remote-video{width: 100%;height: 100%;object-fit: cover;}
        .local-video{ width: 150px;height: 150px;bottom: 40px;right: 10px;z-index: 99;position: absolute;border-radius: 5px;border: 2px solid rgba(91,194,79,0.5); object-fit: cover; }
    }
    .closure{position: absolute; left: 50%;bottom: 60px; transform: translate(-50%); z-index: 2; background: crimson;width: 40px;height:40px; border-radius:100%; display: flex; justify-content: center; align-items: center;
        .iconfont{ color:#fff; font-size: 25px;  cursor: pointer;  }
    }
    
}
</style>
