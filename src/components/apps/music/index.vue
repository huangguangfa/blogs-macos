<template>
    <div class="music">
        <window v-model:show="appInfo.desktop" title="my Music" width="1000" height="600" :appInfo="appInfo">
            <div class="music-content">
                <div class="song-list">
                    <div class="song-left">
                        <div class="music-btn">
                            <span>正在播放</span>
                            <span>正在播放</span>
                            <span>正在播放</span>
                            <span>正在播放</span>
                        </div>
                        
                        <div class="play-list music-list">
                            <div class="music-list">
                                <div class="list-item list-header">
                                    <span class="list-name">歌曲</span>
                                    <span class="list-artist">歌曲</span>
                                    <span class="list-time">歌曲</span>
                                </div>
                                <div class="music-list-content">
                                    <div class="song-items" v-for="item in 20" :key="item">
                                        <span class="song-items-num">1</span>
                                        <span class="song-items-name">浪漫主义</span>
                                        <span class="song-items-artist">姜云升</span>
                                        <span class="song-items-time"> 03:36 </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="music-bar-btns">
                            <i class="iconfont macos-shangyishou"></i>
                            <i class="iconfont macos-24gf-pauseCircle"></i>
                            <i class="iconfont macos-xiayishou"></i>
                        </div>
                    </div>
                </div>
                
                <!-- 虚化背景 -->
                <div class="mmPlayer-bg"></div>
            </div>
        </window>
    </div>
</template>

<script>
    export default{
        props:{
            appInfo:Object
        }       
    }
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
                        }
                    }
                }

                .music-bar-btns{
                    color: #fff;height:15%;display:flex; align-items: center;
                    i{
                        font-size: 30px;margin: 0 20px;cursor: pointer;
                    }
                }
            }
        }


        .mmPlayer-bg{
            z-index: -2;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: 50%;
            -webkit-filter: blur(12px);
            filter: blur(12px);
            opacity: .7;
            -webkit-transition: all .8s;
            transition: all .8s;
            -webkit-transform: scale(1.1);
            transform: scale(1.1);
            background-image: url("../../../assets/apps/music/bg-2.a1183040.jpg");
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
        }
    }
</style>
