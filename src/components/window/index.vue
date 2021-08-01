<template>
    <div class="window noCopy" :class="{ 'isScreenFacade':isScreenFacade }"
        :style="initSzie"
        v-show="page_config.shows" :id="windowId"
        @click.stop="setScreenFacade"
        @mousedown="windowBarDowStart">
        <div class="fullScreen-top" v-if="page_config.isFullScreen"></div>
        <div class="window-bar" :class="[ page_config.isFullScreen ? 'barFullScreen barFadeInDownBig' : '' ]" v-show="isBarShow">
            <div class="window-bars">
                <div class="round" 
                    v-for="(item,index) in statusLists" 
                    :key="index" 
                    @click="statusSwitch(index)"
                    :class="[item.className, (index === 1 && page_config.isFullScreen) ? 'no-minimize' : '' ]">
                    <i class="iconfont" :class="item.icon"></i>
                </div>
            </div>
            <div class="bar-title"> {{ title }} </div>
        </div>
        <div class="window-content">
            <slot></slot>
        </div>
        <div v-for="(stick, index) in page_config.sticks"
            :key="index" class="vdr-stick"
            v-show="!page_config.isFullScreen"
            @mousedown.stop.prevent="stickDownStart(stick,$event)"
            :class="['vdr-stick-' + stick, index > 3 ? 'triangle':'']">
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, onUnmounted, watch, nextTick, computed } from 'vue';
import { initWindowStaus, mouseups, documentMoves, statusList } from "./data.js";
import { addEvents, removeEvents, getByIdDom } from "@/utils/dom";
import store from "@/store/index"
let id = 0;
export default{
    name:"window",
    props: {
        show: {
            type:Boolean,
            default:true
        },
        title:{
            type:String,
            default:'bar'
        },
        width:{
            type:[Number,String],
            default:635,
        },
        height:{
            type:[Number,String],
            default:400,
        }
    },
    setup(props){
        let ref_windows = reactive({ dom:null });
        let page_config = reactive({
            sticks: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
            winBarConfig:{
                winBarStart:false,
                disX:0,
                disY:0
            },
            sticksConfig:{
                sticksStart:false,
                pointerX:0,
                pointerY:0,
                sticksType:null
            },
            cursorPointerY:false,
            domEvents:new Map(),
            defaultWidth:300,
            defaultHeight:300,
            currentWindowStatus:'close',
            shows:false,
            isFullScreen:false
        });
        let statusLists = reactive(statusList);
        id ++;
        let windowId = `window${id}`;
        store.commit("SET_WINDOWID",windowId);
        watch( () => props.show, ( status ) => {
            page_config.shows = status;
            status === true && nextTick(() =>{ 
                initWindowStaus(getByIdDom( windowId ),props.width, props.height); 
            })
        })
        let initSzie = computed(() => `width:${props.width}px;height:${props.height}px;` );
        let isScreenFacade = computed(() => store.getters.WINDOWID === windowId );
        onMounted( () =>{
            let windom = getByIdDom( windowId );
            ref_windows.dom = windom;
            page_config.shows = props.show;
            props.show && nextTick(() =>{ initWindowStaus( getByIdDom( windowId ),props.width, props.height) })
            //web页面移动
            page_config.domEvents.set('mousemove',ev =>{
                const { clientY } = ev;
                page_config.cursorPointerY = clientY < 40;
                documentMoves(windom,ev,page_config)
            });
            //鼠标松开、清除状态
            page_config.domEvents.set('mouseup',() =>{
                mouseups(page_config)
            })
            addEvents(page_config.domEvents)
        })
        const isBarShow = computed( () =>{
            let status = page_config.isFullScreen === false || page_config.isFullScreen === true && page_config.cursorPointerY  === true;
            //barTop只需要判断全屏和是否到顶部
            store.commit("SET_FULLSCREENBAR",page_config.isFullScreen === true && page_config.cursorPointerY  === true);
            return status;
        })
        //销毁
        onUnmounted( () =>{
            removeEvents(page_config.domEvents)
        })
        return {
            ref_windows,
            statusLists,
            page_config,
            isBarShow,
            windowId,
            isScreenFacade,
            initSzie
        }
    },
    methods:{
        statusSwitch(index){
            let isContinue = [ index === 1 && this.page_config.isFullScreen ];
            if( isContinue.some( item => item === true ) ) return;
            let enums = {
                0:{
                    type:'close',
                    status:false
                },
                1:{
                    type:'activeClose',
                    status:false
                },
                2:{
                    type:'fullScreen',
                    status:true
                }
            }
            const { type, status } = enums[index];
            this.page_config.currentWindowStatus = type;
            this.page_config.shows = status;
            this.$emit('update:show',status);
            if( status === false ){
                this.page_config.isFullScreen = false;
            }
            if( type === 'fullScreen' ){
                this.windowFullScreen()
            }
        },
        setScreenFacade(){
            store.commit("SET_WINDOWID",this.windowId)
        },
        windowBarDowStart(e){
            let iframe = document.querySelector('iframe')
            iframe && (iframe.style['pointer-events'] = 'none')
            //算出鼠标相对元素的位置
            let disX = e.clientX - this.ref_windows.dom.offsetLeft;
            let disY = e.clientY - this.ref_windows.dom.offsetTop;
            //只有顶部才支持被拖拽
            if(disX < 6 || disY < 6 || disY > 30) return;
            this.page_config.winBarConfig.winBarStart = true;
            this.page_config.winBarConfig.disX = disX;
            this.page_config.winBarConfig.disY = disY;
        },
        stickDownStart(type,ev){
            let iframe = document.querySelector('iframe')
            iframe && (iframe.style['pointer-events'] = 'none')
            const pointerX = ev.pageX;
            const pointerY = ev.pageY;
            this.page_config.sticksConfig.sticksStart = true;
            this.page_config.sticksConfig.pointerX = pointerX;
            this.page_config.sticksConfig.pointerY = pointerY;
            this.page_config.sticksConfig.sticksType = type;
        },
        windowFullScreen(){
            this.page_config.isFullScreen = !this.page_config.isFullScreen;
            let newStyle = null;
            if( this.page_config.isFullScreen === true ){
                const { offsetWidth, offsetHeight, style } = this.ref_windows.dom;
                const { top, left } = style;
                let web_width = document.body.offsetWidth;
                let web_height = document.body.offsetHeight;
                this.ref_windows.dom.__formerW = offsetWidth;
                this.ref_windows.dom.__formerH = offsetHeight;
                this.ref_windows.dom.__formerL = parseInt(left);
                this.ref_windows.dom.__formerT = parseInt(top);
                newStyle = `width:${web_width}px;height:${web_height}px;top:0px;left:0px`;
            } else{
                const { __formerW, __formerH, __formerL, __formerT } = this.ref_windows.dom;
                newStyle = `width:${__formerW}px;height:${__formerH}px;top:${__formerT}px;left:${__formerL}px`;
            }
            this.ref_windows.dom.setAttribute('style',newStyle)
        }
    }
}
</script>

<style lang="less">
.window{
    will-change: left,top, width,height;
    box-sizing: border-box;
    overflow: hidden;
    position: fixed;
    display: inline-block;
    flex-shrink: 0;
    z-index: 9998;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);
    border-color: rgba(107,114,128,0.3);
    .fullScreen-top{
        position: fixed;top: 0;left: 0;width: 100%;height: 5px;z-index: 9999;
    }
    .top-hover{
        width: 100%;height:10px;background: red;
        &:hover +.window-bar{ display: block; }
    }
    .window-bar{
        width: 100%;height: 30px;
        background-color: rgba(229,231,235,1);
        display: flex; align-items:center;
        padding-left: 4px;
        justify-content: center;
        .bar-title{font-size: 14px; font-weight: 600;}
        .window-bars{ 
            display: flex; align-items:center;
            position: absolute; left: 10px;
            &:hover .round>.iconfont{display: block;}
            .round{ 
                width:12px;height: 12px;border-radius: 100%; background-color:rgb(239, 68, 68); margin: 0 4px;display: flex;align-items:center; justify-content: center;
                .iconfont{ font-size: 12px; font-weight: bold; display: none;}
                .macos-jian{ transform: scale(0.8) }
                .macos-quanping{transform: scale(0.9) }
                .macos-shanchu{ transform: scale(0.6);}
            }
            .remove-round{ background-color: rgb(245, 158, 11);}
            .fullscreen-round{ background-color:rgb(16, 185, 129)}
            .no-minimize{
                background-color:#424346;
                .iconfont{ color: #424346; }
            }
        }
    }
    .barFullScreen{
        position: absolute;
        top:24px;left:0;
        z-index: 99;
    }
    .window-content{  width: 100%; height:100%; background: #fff;}
    .vdr-stick{ box-sizing: border-box; position: absolute; z-index: 9999;}
    .vdr-stick-tl{
        width: 4px;height: 100%;
        left: 0;top: 0;
        cursor:w-resize;
        z-index: 2;
    }
    .vdr-stick-tm {
        width:100%;height: 4px;top: 0;left: 0;
        cursor: n-resize;
    }
    .vdr-stick-tr {
        width: 4px;height: 100%;right: 0;top: 0;
        cursor: e-resize;
    }
    .vdr-stick-mr {
        width: 100%;height: 4px;left: 0;bottom: 0;
        cursor: s-resize;
    }
    .triangle{
        width: 0;
        height: 0;
        border: 10px solid;
        border-color: transparent transparent transparent;
        z-index: 5;
    }
    //四个角
    .vdr-stick-br {
        top: -10px;
        left: -9px;
        transform: rotate( -42deg);
        cursor: nw-resize;
    }
    .vdr-stick-bm {
        top: -11px;
        right: -10px;
        transform: rotate( 42deg);
        cursor: ne-resize;
    }
    .vdr-stick-bl {
        bottom: -10px;
        left: -10px;
        transform: rotate( 225deg);
        cursor:sw-resize;
    }
    .vdr-stick-ml {
        bottom: -10px;
        right: -10px;
        transform: rotate( 135deg);
        cursor:se-resize;
    }
}
.isScreenFacade{z-index: 9999;}
</style>