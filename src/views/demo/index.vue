<template>
    <div class="window" ref="ref_windows" @mousedown="windowBarDowStart">
        <div class="window-bar"></div>
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
                if( sticksStart ){
                    const { defaultWidth, defaultHeight } = page_config;
                    const pageX = ev.pageX;
                    const pageY = ev.pageY;
                    let widthX = parseInt(pageX-pointerX) + windom.offsetWidth;
                    console.log(widthX)
                    // console.log((widthX + windom.offsetWidth) + "px")
                    windom.style.width = ( widthX < defaultWidth ? defaultWidth : widthX ) + "px";
                    page_config.sticksConfig.pointerX = pageX;
                    // console.log(windom.offsetWidth)

                    // let widthX = parseInt(pageX-pointerX);
                    // console.log('结果',widthX)
                    // console.log(pointerX + '---' + pageX)
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
            const pointerX = typeof ev.pageX !== 'undefined' ? ev.pageX : ev.touches[0].pageX;
            const pointerY = typeof ev.pageY !== 'undefined' ? ev.pageY : ev.touches[0].pageY;
            this.page_config.sticksConfig.sticksStart = true;
            this.page_config.sticksConfig.pointerX = pointerX;
            this.page_config.sticksConfig.pointerY = pointerY;
            // ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
            let config = {
                'tl':'X',
                'tm':'Y',
                'tr':'Y',
                'mr':'X'
            }
            this.page_config.sticksConfig.sticksType = config[type];
        }
    }
}
</script>

<style lang="less">
    .window{
        width: 200px;height: 700px;
        background: aqua;
        will-change: left,top;
        box-sizing: border-box;
        overflow: hidden;
        position: absolute;
        display: inline-block;
        flex-shrink: 0;
        .window-bar{
            width: 100%;height: 30px;
            background: blueviolet;
        }
        .vdr-stick{
            box-sizing: border-box;
            position: absolute;
        }
        .vdr-stick-tl{
            width: 4px;height: 100%;
            left: 0;top: 0;
            background: red;
            cursor:w-resize;
            z-index: 2;
        }
        .vdr-stick-tm {
            width:100%;height: 4px;background: red;top: 0;left: 0;
            cursor: n-resize;
        }
        .vdr-stick-tr {
            width: 4px;height: 100%;background: red;right: 0;top: 0;
            cursor: e-resize;
        }
        .vdr-stick-mr {
            width: 100%;height: 4px;background: red;left: 0;bottom: 0;
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