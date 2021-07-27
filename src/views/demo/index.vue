<template>
    <div class="window" ref="ref_windows">
        <div class="window-bar"></div>
    </div>
</template>

<script>
import { onMounted, reactive, ref, computed } from 'vue';
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
                    let web_width =  document.body.offsetWidth;
                    let dom_width =  windowBarDom.offsetWidth;
                    let currenrLeft = parseInt(windowBarDom.style.left);
                    //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                    let left = e.clientX - disX;
                    let top = e.clientY - disY;
                    let letf_boundary =  parseInt((dom_width / 5) * 4);
                    //不可移动的距离、左右不可超5/4
                    if( (-letf_boundary) > left || ( left + dom_width ) > (web_width + letf_boundary ) ){  left = currenrLeft; }
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
        width: 100px;height: 700px;background: aqua;
        position: fixed;
        will-change: left,top;
        .window-bar{
            width: 100%;height: 30px;
            background: blueviolet;
        }
    }
</style>