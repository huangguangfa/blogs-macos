<template>
    <div class="music">
        <window v-model:show="appInfo.desktop" :title=" palyConfig.curPlay.name ? `正在播放-${palyConfig.curPlay.name}` : 'my Music'" width="1000" height="600" :appInfo="appInfo">
            <div class="music-content">
                <div class="song-list">
                    <div class="song-left">
                        <div class="music-btn">
                            <span :class="{ 'active':index === 0 }" v-for="(item, index) in musicType" :key="item.name">{{ item.name }} </span>
                        </div>
                        
                        <div class="play-list music-list">
                            <div class="music-list">
                                <div class="list-item list-header">
                                    <span class="list-name">歌曲</span>
                                    <span class="list-artist">歌曲</span>
                                    <span class="list-time">歌曲</span>
                                </div>
                                <div class="music-list-content">
                                    <div class="song-items" 
                                        :class="{ 'paly': item.name === palyConfig.curPlay.name }" 
                                        v-for="(item, index) in palyConfig.musicLists" :key="item.url" 
                                        @click="addPlay(index)">
                                        <span class="song-items-num">{{ index + 1 }}</span>
                                        <span class="song-items-name">{{ item.name }}</span>
                                        <span class="song-items-artist">{{ item.singer }}</span>
                                        <span class="song-items-time"> {{ item.time }} </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="music-bar-btns">
                            <audio id="audios" ref="audioDom" :src="palyConfig.curPlay.url" controls></audio>
                            <div class="right-round"></div>
                        </div>
                    </div>
                </div>
                
                <!-- 虚化背景 -->
                <div class="mmPlayer-bg" :style="`background-image: url(${palyConfig.playBg})`"></div>
            </div>
        </window>
    </div>
</template>

<script setup>
    import { nextTick, reactive, ref, watch, onMounted } from "vue";
    import musicList from "../../../../file/music/index.json"
    const props = defineProps({
        appInfo:Object
    })
     const musicType = reactive([
        { name:"正在播放" },
        { name:"我的歌单" }
    ])
    const palyConfig = reactive({
        musicLists:musicList,
        curPlay:{},
        curIndex:0,
        playBg:"https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/ui/music-default-bg.jpeg"
    })
    const audioDom = ref(null);
    onMounted( () =>{
        // 音乐结束了
        audioDom.value.onended = function(){
            if( palyConfig.curIndex === palyConfig.musicLists.length - 1 ){
                addPlay(0)
            }else{
                addPlay(palyConfig.curIndex + 1)
            }
        }
    })

    // methods
    function addPlay(index){
        const item = musicList[index];
        palyConfig.curPlay = item;
        palyConfig.playBg = item.cover;
        palyConfig.curIndex = index;
        nextTick( () =>{
            audioDom.value.play()
        })
    }
    watch( () => props.appInfo.desktop, (status) =>{
        if( status === false && props.appInfo.isMinimize === false ){
            audioDom.value.pause()
        }
    })
</script>

<style lang="less" scoped>
    .music-content{
        width: 100%;height:100%; padding: 0px 25px 25px 25px; box-sizing: border-box;
        .song-list{
            height: 100%;
            .song-left{
                height: 100%;
                .music-btn{
                    margin-top: 20px;
                    span{
                        display: inline-block;
                        height: 30px;
                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                        margin-right: 8px;
                        padding: 0 10px;
                        border: 1px solid hsla(0,0%,100%,.6);
                        color: hsla(0,0%,100%,.6);
                        border-radius: 2px;
                        font-size: 12px;
                        line-height: 30px;
                        overflow: hidden;
                        cursor: not-allowed;
                    }
                    .active{
                        border-color: #fff;
                        color: #fff;
                        cursor: pointer;
                    }
                }
                .play-list{
                    height: 75%;overflow-y:auto ;
                    .music-list{
                        height: 100%; 
                        .list-item{
                            display: flex;width: 100%;color: #fff;overflow: hidden;font-size: 12px;
                            height: 50px; border-bottom: 1px solid hsla(0,0%,100%,.1);line-height: 50px;
                            .list-name{
                                position: relative;padding-left: 40px;-webkit-box-flex: 1; flex: 1;user-select: none;box-sizing: border-box;
                            }
                            .list-artist{
                                width: 150px;
                            }
                            .list-time{
                                display: block;width: 60px;position: relative;
                            }
                        }
                        .music-list-content{
                            .song-items{
                                height: 50px;border-bottom: 1px solid hsla(0,0%,100%,.1);line-height: 50px;overflow: hidden;display: flex;width: 100%;
                                color: #ffffff99;font-size:12px;
                                .song-items-num{display: block;width: 30px;margin-right: 10px;text-align: center;}
                                .song-items-name{
                                    position: relative;flex: 1;box-sizing: border-box;
                                }
                                .song-items-artist{width: 150px;}
                                .song-items-time{display: block;width: 60px;}
                            }
                            .paly{
                                background: rgba(255,255,255,0.1);
                            }
                        }
                    }
                }

                .music-bar-btns{
                    color: #fff;height:15%;display:flex; align-items: center; justify-content: center;opacity: .7;
                    i{
                        font-size: 30px;margin: 0 20px;cursor: pointer;
                    }
                }
            }
        }

        .mmPlayer-bg{
            z-index: -2;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: 50%;
            -webkit-filter: blur(12px);
            filter: blur(12px);
            opacity: .7;
            -webkit-transition: all .8s;
            transition: all .8s;
            -webkit-transform: scale(1.1);
            transform: scale(1.1);
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
        }
    }
</style>

<style>
audio::-webkit-media-controls {
    overflow: hidden !important
}
audio::-webkit-media-controls-enclosure {
    width: calc(100% + 32px);
    margin-left: auto;
}
.right-round{
    height: 54px;width: 30px;background: #eff1f2;border-top-right-radius: 30px;border-bottom-right-radius: 30px;
}
</style>
