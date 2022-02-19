<template>
    <div class="window noCopy ov-hide"
        :class="{
            'isScreenFacade':isScreenFacade,
            'bor-radius7':!page_config.isFullScreen,
            'isFullScreen':page_config.isFullScreen,
            'topLevel':isMinimize
        }"
        v-show="page_config.shows"
        :id="windowId"
        @click.stop="setScreenFacade"
        @mousedown="windowBarDowStart">
        <div class="fullScreen-top" v-if="page_config.isFullScreen"></div>
        <div class="window-bar" 
            ref="ref_bar" 
            v-show="isBarShow"
            :class="[ 
                page_config.isFullScreen && 'barFadeInDownBig box-shadow', 
                page_config.isFullScreen && isBarShow && 'barFullScreen' 
            ]">
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
    let WINDOWID = 0;
</script>

<script setup>
    import { onMounted, reactive, onUnmounted, watch, nextTick, computed, ref } from 'vue';
    import { useSystemStore } from "@/store/system.js";
    const systemStore = useSystemStore();
    import { SET_WINDOW_ID, SET_FULL_SCREENBAR, SET_TABABR_NAVIGATION } from "@/config/store.config.js";
    import { addEvents, removeEvents, getByIdDom } from "@/utils/dom";
    import { initWindowStaus, mouseups, documentMoves, statusList, windowTbarConfig } from "./hooks/config.js";
    import { propsOption } from "./props";
    const props = defineProps(propsOption);
    const emit = defineEmits(['windowId', 'eventMousemove', 'change', 'windowSize']);

    let ref_windows = reactive({ dom:{} });
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
        barHeight:40
    });
    let domEvents = reactive(new Map());
    let statusLists = reactive(statusList);
    WINDOWID ++;
    let windowId = `window${ WINDOWID }`;
    // watch
    watch( () => props.show, ( status ) => {
        page_config.shows = status;
        status === true && nextTick(() =>{ 
            emit('windowId',windowId);
            const { offsetHeight } = ref_bar.value;
            page_config.barHeight = offsetHeight + 10;
            // 每次显示默认最前 
            setScreenFacade()
        })
    })
    
    // computed
    const isScreenFacade = computed(() => systemStore.WINDOWID === windowId );
    const isMinimize = computed( () => props.appInfo.isMinimize );
    const isBarShow = computed( () =>{
        const { isFullScreen, cursorPointerY } = page_config;
        let status = isFullScreen === false || isFullScreen === true && cursorPointerY  === true ;
        // 只有当前顶层app才能去对全局状态进行变化 barTop只需要判断全屏和是否到顶部
        if( isScreenFacade.value ){
            systemStore[SET_FULL_SCREENBAR](isFullScreen === true && cursorPointerY === true);
        }
        return status;
    })
    watch( () => props.appInfo.isMinimize, (status) =>{
        if(status === false){
            // 每次显示默认最前 
            setScreenFacade()
        }
    })
    onMounted( () =>{
        let windom = getByIdDom( windowId );
        ref_windows.dom = windom;
        initWindowStaus(windom, props.width, props.height);
        page_config.shows = props.show;
        // web页面移动
        domEvents.set('mousemove',ev =>{
            emit('eventMousemove',ev);
            const { winBarConfig:{winBarStart}, sticksConfig:{sticksStart} } = page_config;
            const { clientY } = ev;
            page_config.cursorPointerY = clientY < page_config.barHeight;
            if( winBarStart || sticksStart ) {
                documentMoves(windom, ev, page_config)
            };
        });
        // 鼠标松开、清除状态
        domEvents.set('mouseup',() =>{
            mouseups(page_config, props.title)
            changeSize()
        })
        addEvents(domEvents)
    })

    // methods
    function statusSwitch(index){
        const { _index } = props.appInfo;
        let isContinue = [ index === 1 && page_config.isFullScreen ];
        if( isContinue.some( item => item === true ) ) return;
        const { type, status } = windowTbarConfig[index];
        page_config.currentWindowStatus = type;
        page_config.shows = status;
        // 修改store的dokc状态
        systemStore[SET_TABABR_NAVIGATION]({ _index, dockData:{ desktop:status } })
        if( status === false ){
            page_config.isFullScreen = false;
        }
        // 全屏
        if( type === 'fullScreen' ){
            windowFullScreen()
        }
        // 最小化
        if( type === 'activeClose' ){
            const { width, height, top, left } = ref_windows.dom.style;
            // 保存最小化状态
            ref_windows.dom.minimize = { width, height, top, left };
            windowMinimize()
        }
        emit('change',{ type, status })
    }
    function setScreenFacade(){
        systemStore[SET_WINDOW_ID](windowId);
    }
    function windowBarDowStart(e){
        const { clientX, clientY } = e;
        let iframe = document.getElementById(props.title);
        iframe && (iframe.style['pointer-events'] = 'none')
        // 算出鼠标相对元素的位置
        let disX = clientX - ref_windows.dom.offsetLeft;
        let disY = clientY - ref_windows.dom.offsetTop;
        // 只有顶部才支持被拖拽
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
    async function windowMinimize(){
        const { _index } = props.appInfo;
        // 最小化保存状态
        systemStore[SET_TABABR_NAVIGATION]({ _index, dockData:{ isMinimize:true } });
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
        nextTick( () =>{
            ref_windows.dom.setAttribute('style',newStyle);
            changeSize();
        })
    }
    function changeSize(){
        const { width, height } = ref_windows.dom.style;
        emit('windowSize',{
            width,
            height
        })
    }
    // 销毁
    onUnmounted( () =>{
        removeEvents(page_config.domEvents)
    })
</script>

<style lang="less">
    @import url("./index.less");
</style>