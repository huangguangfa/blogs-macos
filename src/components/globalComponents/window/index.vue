<template>
<!-- fixed -->
    <div class="window noCopy  ov-hide" :class="{ 'isScreenFacade':isScreenFacade, 'bor-radius7':!page_config.isFullScreen}"
        :style="initSzie"
        v-show="page_config.shows" :id="windowId"
        @click.stop="setScreenFacade"
        @mousedown="windowBarDowStart">
        <div class="fullScreen-top" v-if="page_config.isFullScreen && !page_config.isMinimize"></div>
        <div class="minimize_mark"  v-if="page_config.isMinimize" @click.stop="setScreenFacade"></div>
        <div class="window-bar" ref="ref_bar" 
            :class="[ 
                page_config.isFullScreen && 'barFadeInDownBig box-shadow', 
                page_config.isFullScreen && isBarShow && 'barFullScreen' 
            ]" 
            v-show="isBarShow">
            <div class="window-bars">
                <div class="round" 
                    v-for="(item,index) in statusLists" 
                    :key="index" 
                    @click.stop="statusSwitch(index)"
                    :class="[item.className, (index === 1 && page_config.isFullScreen) ? 'no-minimize' : '' ]">
                    <i class="iconfont" :class="item.icon"></i>
                </div>
            </div>
            <slot name="bar-title">
                <div class="bar-title"> {{ title }} </div>
            </slot>
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
import { onMounted, reactive, onUnmounted, watch, nextTick, computed, ref } from 'vue';
import { initWindowStaus, mouseups, documentMoves, statusList, windowTbarConfig } from "./hooks/config.js";
import { SET_WINDOW_ID, SET_FULL_SCREENBAR, SET_TABABR_MINIMIZE } from "@/config/store.config.js";
import { addEvents, removeEvents, getByIdDom } from "@/utils/dom";
import { props } from "./props";
import store from "@/store/index";
let id = 0;
export default{
    name:"window",
    props,
    setup(props,{ emit }){
        const { appInfo } = props;
        let ref_windows = reactive({ dom:null });
        let ref_bar = ref(null);
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
            defaultWidth:300,
            defaultHeight:300,
            currentWindowStatus:'close',
            shows:false,
            isFullScreen:false,
            isMinimize:false,
            barHeight:40
        });
        let domEvents = reactive(new Map());
        let statusLists = reactive(statusList);
        id ++;
        let windowId = `window${id}`;
        store.commit(SET_WINDOW_ID,windowId);
        //watch
        watch( () => props.show, ( status ) => {
            page_config.shows = status;
            status === true && nextTick(() =>{ 
                const { offsetHeight } = ref_bar.value;
                page_config.barHeight = offsetHeight + 10;
                initWindowStaus(getByIdDom( windowId ),props.width, props.height); 
            })
        })
        //computed
        let initSzie = computed(() => {
            const w = props.width;
            const h = props.height;
            // const scale = page_config.isMinimize ? 0.06 : 1 ;
            const scale = 1 ;
            const { top, left } = ref_windows.dom && ref_windows.dom.style || { top:0, left:0 };
            return `width:${w}px;height:${h}px;transform:scale(${ scale });left:${left};top:${top};`
        });
        const isScreenFacade = computed(() => store.getters.WINDOWID === windowId );
        const isBarShow = computed( () =>{
            const { isFullScreen, cursorPointerY, isMinimize } = page_config;
            let status =  !isMinimize && ( isFullScreen === false || isFullScreen === true && cursorPointerY  === true );
            //barTop只需要判断全屏和是否到顶部
            store.commit(SET_FULL_SCREENBAR,isFullScreen === true && cursorPointerY  === true);
            return status;
        })
        onMounted( () =>{
            let windom = getByIdDom( windowId );
            ref_windows.dom = windom;
            page_config.shows = props.show;
            props.show && nextTick(() =>{ initWindowStaus( getByIdDom( windowId ),props.width, props.height) })
            //web页面移动
            domEvents.set('mousemove',ev =>{
                const { winBarConfig:{winBarStart}, sticksConfig:{sticksStart} } = page_config;
                const { clientY } = ev;
                page_config.cursorPointerY = clientY < page_config.barHeight;
                if( winBarStart ||  sticksStart) {
                    documentMoves(windom,ev,page_config)
                };
            });
            //鼠标松开、清除状态
            domEvents.set('mouseup',() =>{
                mouseups(page_config,props.title)
            })
            addEvents(domEvents)
        })

        //methods
        function statusSwitch(index){
            let isContinue = [ index === 1 && page_config.isFullScreen ];
            if( isContinue.some( item => item === true ) ) return;
            const { type, status } = windowTbarConfig[index];
            page_config.currentWindowStatus = type;
            page_config.shows = status;
            emit('update:show',status);
            if( status === false ){
                page_config.isFullScreen = false;
            }
            //全屏
            if( type === 'fullScreen' ){
                windowFullScreen()
            }
            //最小化
            if( type === 'activeClose' ){
                const { width, height, top, left } = ref_windows.dom.style;
                //保存最小化状态
                ref_windows.dom.minimize = {  width, height, top, left };
                windowMinimize()
            }
        }
        function setScreenFacade(){
            page_config.isMinimize = false;
            ref_windows.dom.style.transform = `scale(1)`;
            let updateMinimize = store.getters.TABABR_MINIMIZE.filter( i => props.appInfo.id !== i.id);
            store.commit(SET_TABABR_MINIMIZE,updateMinimize); 
            store.commit(SET_WINDOW_ID,windowId)
        }
        function windowBarDowStart(e){
            const { clientX, clientY } = e;
            let iframe = document.getElementById(props.title);
            iframe && (iframe.style['pointer-events'] = 'none')
            //算出鼠标相对元素的位置
            let disX = clientX - ref_windows.dom.offsetLeft;
            let disY = clientY - ref_windows.dom.offsetTop;
            //只有顶部才支持被拖拽
            if(disX < 6 || disY < 6 || disY > 30) return;
            page_config.winBarConfig.winBarStart = true;
            page_config.winBarConfig.disX = disX;
            page_config.winBarConfig.disY = disY;
        }
        function stickDownStart(type,ev){
            const { pageX, pageY } = ev;
            let iframe = document.getElementById(props.title);
            iframe && (iframe.style['pointer-events'] = 'none');
            page_config.sticksConfig.sticksStart = true;
            page_config.sticksConfig.pointerX = pageX;
            page_config.sticksConfig.pointerY = pageY;
            page_config.sticksConfig.sticksType = type;
        }
        function windowMinimize(){
            // 保存最小化应用
            const { id, img, title, desktop } = appInfo;
            const { offsetHeight, offsetWidth  } = document.body;
            const minimize_length = store.getters.TABABR_MINIMIZE.length;
            if( !store.getters.TABABR_MINIMIZE.map( i => i.id ).includes(id) ){
                page_config.isMinimize = true;
                const { top, left } = ref_windows.dom.style;
                const w_dom_top = Number(top.replace('px',""));
                const w_dom_left = Number(left.replace('px',""));
                
                console.log('offsetWidth',offsetWidth)
                let appDes = {
                    id,
                    img,
                    title,
                    desktop,
                    app_top:w_dom_top,
                    app_left:w_dom_left
                }
                store.commit(SET_TABABR_MINIMIZE,[
                    ...store.getters.TABABR_MINIMIZE ,
                    appDes,
                ]); 
                nextTick( () =>{
                    let dock_w = document.getElementsByClassName('tabbars')[0].offsetWidth;
                    let win_w = (ref_windows.dom.offsetWidth - (ref_windows.dom.offsetWidth * 0.06 / 2)) / 2
                    const lefts = parseInt( offsetWidth - (dock_w + win_w));
                    console.log(',,,',100 - win_w)
                    ref_windows.dom.style.transform = `scale(0.06)`;
                    ref_windows.dom.style.top = `auto`;
                    ref_windows.dom.style.bottom = '-164px'
                    ref_windows.dom.style.left = `${lefts}px`;
                })
            }
        }
        function windowFullScreen(){
            page_config.isFullScreen = !page_config.isFullScreen;
            let newStyle = null;
            if( page_config.isFullScreen === true ){
                const { offsetWidth, offsetHeight, style } = ref_windows.dom;
                const { top, left } = style;
                let web_width = document.body.offsetWidth;
                let web_height = document.body.offsetHeight;
                ref_windows.dom.__formerW = offsetWidth;
                ref_windows.dom.__formerH = offsetHeight;
                ref_windows.dom.__formerL = parseInt(left);
                ref_windows.dom.__formerT = parseInt(top);
                newStyle = `width:${web_width}px;height:${web_height}px;top:0px;left:0px`;
            } else{
                const { __formerW, __formerH, __formerL, __formerT } = ref_windows.dom;
                newStyle = `width:${__formerW}px;height:${__formerH}px;top:${__formerT}px;left:${__formerL}px`;
            }
            ref_windows.dom.setAttribute('style',newStyle)
        }
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
            initSzie,
            ref_bar,

            //methods
            windowFullScreen,
            windowMinimize,
            windowBarDowStart,
            setScreenFacade,
            statusSwitch,
            stickDownStart
        }
    }
}
</script>

<style lang="less">
    @import url("./index.less");
</style>