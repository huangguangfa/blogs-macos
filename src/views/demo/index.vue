<template>
    <div class="window" ref="ref_windows" @mousedown="windowBarDowStart">
        <div class="window-bar">
<!--            <div class="window-bars">-->
<!--                <div class="round">-->
<!--                    <i class="iconfont macos-shanchu"></i>-->
<!--                </div>-->
<!--                <div class="round remove-round">-->
<!--                    <i class="iconfont macos-jian"></i>-->
<!--                </div>-->
<!--                <div class="round fullscreen-round">-->
<!--                    <i class="iconfont macos-quanping"></i>-->
<!--                </div>-->
<!--            </div>-->
        </div>
        <div class="window-content"></div>
        <div v-for="(stick, index) in page_config.sticks"
             :key="index" class="vdr-stick"
             @mousedown.stop.prevent="stickDownStart(stick,$event)"
             :class="['vdr-stick-' + stick, index > 3 ? 'triangle':'']">
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, ref, computed, onUnmounted } from 'vue';
import { pageConfig } from "./data.js";
import { addEvents, removeEvents } from "@/utils/dom"
export default{
    setup(){
        let ref_windows = ref(null);
        let page_config = reactive(pageConfig);
        onMounted( () =>{
            //移动
            page_config.domEvents.set('mousemove',(ev) =>{
                const { winBarStart, disX, disY } = page_config.winBarConfig;
                const { sticksStart, pointerX,pointerY, sticksType } = page_config.sticksConfig;
                let windom = ref_windows.value;
                //窗口移动
                if( winBarStart ){
                    let web_width =  document.body.offsetWidth;
                    let dom_width =  windom.offsetWidth;
                    let currenrLeft = parseInt(windom.style.left);
                    //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                    let left = ev.clientX - disX;
                    let top = ev.clientY - disY;
                    let letf_boundary =  parseInt((dom_width / 5) * 4);
                    //不可移动的距离、左右不可超5/4
                    if( (-letf_boundary) > left || ( left + dom_width ) > (web_width + letf_boundary ) ){  left = currenrLeft; }
                    windom.style.left = left + "px";
                    windom.style.top = top + "px";
                }
                //边框拖动
                if( sticksStart ){
                    let config = {
                        //left
                        'tl':{
                            dir:'X',
                            computedX:( value ) => -1 * value
                        },
                        //top
                        'tm':{
                            dir:'Y',
                            computedY:( value ) => -1 * value
                        },
                        //right
                        'tr':{
                            dir:'X',
                            computedX:( value ) => 1 * value
                        },
                        //bottom
                        'mr':{
                            dir:'Y',
                            computedY:( value ) => 1 * value
                        },
                        // top + left
                        'br':{
                            dir:'XY',
                            computedX:( value ) => -1 * value,
                            computedY:( value ) => -1 * value,
                            isChangePositionX:true,
                            isChangePositionY:true
                        },
                        // top + right
                        'bm':{
                            dir:'XY',
                            computedY:( value ) => -1 * value,
                            computedX:( value ) => 1 * value,
                            isChangePositionY:true
                        },
                        // left + bottom
                        'bl':{
                            dir:'XY',
                            computedX:( value ) => -1 * value,
                            computedY:( value ) => 1 * value,
                            isChangePositionX:true
                        },
                        //right/bottom
                        'ml':{
                            dir:'XY',
                            computedX:( value ) => 1 * value,
                            computedY:( value ) => 1 * value,
                        },
                    }
                    const { dir,computedX, computedY, isChangePositionX, isChangePositionY } = config[sticksType];
                    const { defaultWidth, defaultHeight } = page_config;
                    const winLeft = parseInt(windom.style.left);
                    const winTop = parseInt(windom.style.top);
                    const pageX = ev.pageX;
                    const pageY = ev.pageY;
                    // left/right
                    if( ['X','XY'].includes(dir) ){
                        const computedChangeValue = computedX(parseInt( pageX - pointerX ));
                        let widthX = computedChangeValue + windom.offsetWidth;
                        windom.style.width = ( widthX < defaultWidth ? defaultWidth : widthX ) + "px";
                        if( (widthX > defaultWidth) && (sticksType === 'tl' || isChangePositionX ) ){
                            windom.style.left = (winLeft - computedChangeValue) + 'px'
                        }
                        page_config.sticksConfig.pointerX = pageX;
                    }
                    //top/bottom
                    if( ['Y','XY'].includes(dir) ){
                        const computedChangeValue = computedY(parseInt( pageY - pointerY ));
                        let heightY = computedChangeValue + windom.offsetHeight;
                        windom.style.height = ( heightY < defaultHeight ? defaultHeight : heightY ) + "px";
                        page_config.sticksConfig.pointerY = pageY;
                        if( (heightY > defaultHeight) && (sticksType === 'tm' || isChangePositionY ) ){
                            windom.style.top = (winTop - computedChangeValue) + 'px'
                        }
                    }
                }


            })
            //鼠标松开、清除状态
            page_config.domEvents.set('mouseup',() =>{
                page_config.winBarConfig.winBarStart = false;
                page_config.sticksConfig.sticksStart = false;
            })

            addEvents(page_config.domEvents)

        })
        //销毁
        onUnmounted( () =>{
            removeEvents(page_config.domEvents)
        })
        return {
            ref_windows,
            page_config
        }
    },
    methods:{
        windowBarDowStart(e){
            //算出鼠标相对元素的位置
            let disX = e.clientX - this.ref_windows.offsetLeft;
            let disY = e.clientY - this.ref_windows.offsetTop;
            //只有顶部才支持被拖拽
            if(disX < 6 || disY < 6 || disY > 30) return;
            this.page_config.winBarConfig.winBarStart = true;
            this.page_config.winBarConfig.disX = disX;
            this.page_config.winBarConfig.disY = disY;
        },
        stickDownStart(type,ev){
            const pointerX = ev.pageX;
            const pointerY = ev.pageY;
            this.page_config.sticksConfig.sticksStart = true;
            this.page_config.sticksConfig.pointerX = pointerX;
            this.page_config.sticksConfig.pointerY = pointerY;
            this.page_config.sticksConfig.sticksType = type;
        }
    }
}
</script>

<style lang="less">
    .window-content{
        width: 300px;height: 300px;
    }
    .window{
        will-change: left,top, width,height;
        box-sizing: border-box;
        overflow: hidden;
        position: absolute;
        display: inline-block;
        flex-shrink: 0;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);
        border-radius: 4px;
        border-color: rgba(107,114,128,0.3);
        .window-bar{
            width: 100%;height: 24px;
            background-color: rgba(229,231,235,1);
            display: flex; align-items:center;
            padding-left: 4px;
            .window-bars{
                display: flex; align-items:center;
                &:hover .round>.iconfont{display: block;}
                .round{
                    width:12px;height: 12px;border-radius: 100%;
                    background-color:rgb(239, 68, 68);
                    margin: 0 4px;
                    display: flex;align-items:center; justify-content: center;
                    .iconfont{
                        font-size: 12px;
                        font-weight: bold;
                        display: none;
                    }
                    .macos-jian{ transform: scale(0.8) }
                    .macos-quanping{transform: scale(0.9) }
                    .macos-shanchu{ transform: scale(0.6);}
                }
                .remove-round{
                    background-color: rgb(245, 158, 11);
                }
                .fullscreen-round{
                    background-color:rgb(16, 185, 129)
                }
            }
        }
        .vdr-stick{
            box-sizing: border-box;
            position: absolute;
        }
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
</style>