<template>
    <div class="window" ref="ref_windows">
        <div class="window-bar"></div>
    </div>
</template>

<script>
import { addEvents, removeEvents } from "@/utils/dom.js";
import {onMounted, reactive, ref, computed} from 'vue';
export default{
    setup(){
        let ref_windows = ref(null);
        let page_config = reactive({

        })
        onMounted( () =>{
            let windowBarDom = ref_windows.value;
            windowBarDom.onmousedown = function (e){
                //算出鼠标相对元素的位置
                let disX = e.clientX - windowBarDom.offsetLeft;
                let disY = e.clientY - windowBarDom.offsetTop;
                //只有顶部才支持被拖拽
                if(disY > 30) return;
                document.onmousemove = e => {
                    //不可移动的距离
                    let web_width =  document.body.offsetWidth;
                    let dom_width =  windowBarDom.offsetWidth;
                    //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                    console.log(parseInt(windowBarDom.style.left))
                    let left = e.clientX - disX;
                    let top = e.clientY - disY;
                    // if( parseInt(windowBarDom.style.left))
                    console.log(windowBarDom.offsetLeft);
                    windowBarDom.style.left = left + "px";
                    windowBarDom.style.top = top + "px";
                };
                //鼠标弹起来的时候不再移动
                document.onmouseup = e => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        })
        return {
            ref_windows,
            page_config
        }
    }
}
</script>

<style lang="less">
    .window{
        width: 100px;height: 400px;background: aqua;
        position: fixed;
        will-change: left,top;
        .window-bar{
            width: 100%;height: 30px;
            background: blueviolet;
        }
    }
</style>