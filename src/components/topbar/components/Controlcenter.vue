<template>
    <div class="controlcenter">
        <div class="controlcenter-img" :class="{ 'selectControlcenter':isShowControlcenter }">
            <img src="@/assets/images/topbar/controlcenter.png" alt="" @click="handleShowControlcenter(true)" v-clickoutside="handleShowControlcenter">
            <div class="controlcenter-content" v-show="isShowControlcenter">
                <div class="controlcenter-content-options">
                    <div class="options-content">
                        <div class="options-left bg-radius-com">
                            <div class="options-row" v-for="(item,index) in options.module" :key="index">
                                <div class="options-wifi options-coms" :class="{'off':item.is_start === false }">
                                    <i class="iconfont" :class="item.icon"></i>
                                </div>
                                <div class="options-text">
                                    <p class="fontbold options-name">{{ item.name }}</p>
                                    <p class="options-dec">{{ item.is_start ? item.des : 'off' }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="options-right">
                            <div class="options-row bg-radius-com right-mode">
                                <div class="options-coms off"> <i class="iconfont macos-wifi" ></i> </div>
                                <div class="options-text">
                                    <p class="fontbold options-name">Light Mode</p>
                                </div>
                            </div>
                            <div class="right-mode-bottom">
                                <div class="right-mode-bottom-item bg-radius-com">
                                    <i class="iconfont macos-wifi" ></i>
                                    <p>Keyboard Brightness</p>
                                </div>
                                <div @click="handleFullScreens" class="right-mode-bottom-item bg-radius-com" :class="{'select':isFullscreen}">
                                    <i class="iconfont macos-quanping1" ></i>
                                    <p>Enter Fullscreen</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="siri-img flex align-items-center">
            <img class="siri ml5" src="@/assets/images/topbar/siri.png" alt="">
        </div>
        <div class="systemTime ml10 noCopy">
            <span>{{ datesResult.day }}</span>
            <span class="ml10">{{ datesResult.time }}</span>
        </div>
    </div>
</template>

<script setup>
    import { reactive, computed, onUnmounted, onMounted } from "vue";
    import { handleFullScreen } from "@/utils/index";
    import { SET_SYSTEM_CONFIG } from "@/config/store.config.js"
    import { useSystemStore } from "@/store/system.js";
    const systemStore = useSystemStore();
    let intervalId = null;
    let dates = reactive({
        date:new Date()
    })
    let options = reactive({
        module:[
            {
                icon:"macos-wifi",
                name:"Wi-Fi",
                des:"GF-Home",
                is_start:false
            },
            {
                icon:"macos-wifi",
                name:"Wi-Fi",
                des:"GF-Home",
                is_start:true
            },
            {
                icon:"macos-wifi",
                name:"Wi-Fi",
                des:"GF-Home",
                is_start:true
            }
        ]
    })
    let datesResult = computed(() =>{
        let date = dates.date;
        let h = date.getHours();
        let period = h > 12 ? " PM" : " AM"
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let day_list = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
        let getMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        return {
            time:`${h} : ${m}  ${period}`,
            day:`${day_list[date.getDay()]}  ${getMonth[date.getMonth()]} ${date.getUTCDate()}`
        }
    })
    intervalId = setInterval(() => {
        dates.date = new Date()
    }, 60 * 1000);
    let isFullscreen = computed(() => systemStore.SYSTEM_CONFIG.isFullscreen)
    let isShowControlcenter = computed(() => systemStore.SYSTEM_CONFIG.isShowControlcenter)
    //销毁
    onUnmounted( () =>{ clearInterval(intervalId) })
    onMounted( () =>{
        //监听全屏变化
        document.addEventListener('fullscreenchange',() =>{
            //取消全屏的时候
            if ( !document.fullscreenElement && isFullscreen.value === true ){
                handleFullScreens();
            }
        })
    })
    // methods
    //全屏
    function handleFullScreens(){
        handleFullScreen(isFullscreen.value).then( res =>{
            systemStore[SET_SYSTEM_CONFIG]({
                ...systemStore.SYSTEM_CONFIG,
                isFullscreen:!res
            })
        });
    }
    function handleShowControlcenter(status){
        systemStore[SET_SYSTEM_CONFIG]({
            ...systemStore.SYSTEM_CONFIG,
            isShowControlcenter:status
        })
    }
</script>

<style lang="less">
    .controlcenter{
        display: flex;
        align-items: center;
        height: 100%;
        .controlcenter-img{
            height: 100%;
            padding: 0 5px;
            display: flex;
            align-items: center;
            border-radius: 3px;
            //反转图片颜色
            img{
                filter: invert(100%);
                filter: invert(1); /* same */
                width: 15px;height: 15px;
            }
            &:hover{
                background-color: rgba(255,255,255,0.3);
            }
            .bg-radius-com{
                background: #fff;
                box-shadow: 0 0 5px 0 rgba(0, 0, 0,.25);
                border-radius: 12px;
                cursor: pointer;
            }
            .controlcenter-content{
                position: fixed;
                top:33px;
                right: 10px;
                padding: 10px; 
                border-radius: 16px;
                box-shadow: rgba(0,0,0,0.3) 0px 0px 5px 0px;
                background-color: rgba(243,244,246, 0.7);
                .options-content{
                    display: flex;
                }
                .options-left{
                    width: 146px;
                    height: 140px;
                    display: grid;
                    grid-template-columns: 1fr;
                    box-sizing: border-box;
                }
                .options-right{margin-left: 8px;}
                .options-row{
                    display: flex;
                    align-items: center;
                    padding-left: 8px;
                    .options-coms{
                        width: 32px;height: 32px;background: rgb(59,130,246);
                        display: flex;align-items: center; justify-content: center;color: #FFF;
                        border-radius: 50%;
                    }
                    .off{
                        background-color: rgba(156,163,175,0.25);
                        color:rgba(55,65,81,1);
                    }
                    .options-text{
                        margin-left: 8px;
                        .options-name{
                            font-size: 14px;
                        }
                        .options-dec{
                            font-size: 12px;
                            color: rgb(107,114,128);
                        }
                    }   
                }
                .right-mode{
                    width: 146px;height: 66px;
                }
                .right-mode-bottom{
                    display: flex; justify-content: space-between; margin-top: 6px;
                    .right-mode-bottom-item{
                        width: 73px;height: 66px;
                        font-size: 12px;
                        display: flex;
                        justify-content: center;
                        flex-wrap: wrap;
                        align-content: flex-start;
                        p{text-align: center;}
                        padding-top: 10px;
                        box-sizing: border-box;
                    }
                }
            }
        }
        .selectControlcenter{background-color: rgba(255,255,255,0.3);}
        .siri{
            width: 15px;height: 15px;
        }
        .systemTime{
            font-size: 12px;color: #fff;
        }
    }
    .select{
        background: rgb(59,130,246) !important;color: #FFF;
    }
</style>