<template>
    <div class="github">
        <window v-model:show="appInfo.desktop" title="GitHub" :appInfo="appInfo" width="1200" height="600">
            <div class="github-content wh100" v-if="appInfo.desktop">
                <canvas ref="canvas" style="width:100%;height:100%;"></canvas>
            </div>
        </window>
    </div>
</template>

<script>
    import { ref, onMounted } from "vue"
    export default{
        props:{
            appInfo:Object
        },
        setup(){
            const canvas = ref(null);
            let ctx = null;
            let canvasWidth = 0;
            let canvasHeight = 0;
            let fireworks = []; // 烟花集合
            let particles = []; // 粒子集合
            // #优化性能
            // 点击事件发射烟花 loop函数每循环调用5次才发射一次
            let limiterTotal = 5
            let limiterTick = 0
            // 自动发射烟花 loop函数每循环调用80次才发射一次
            let timerTotal = 50
            let timerTick = 0

            // 当前鼠标坐标
            let mouseCoord = {x: 0, y: 0}
            // 鼠标是否按下
            let isMousedown = false

  
            onMounted( () =>{
                initCanvas()
            })

            function initCanvas(){
                ctx = canvas.value.getContext('2d');
                canvasWidth = canvas.width;
                canvasHeight = canvas.height;
                // canvas全屏
                canvas.value.width = canvasWidth
                canvas.value.height = canvasHeight
                // 鼠标点击就发射烟花
                canvas.value.addEventListener('mousemove', function (e) {
                    mouseCoord = {
                        x: e.pageX - canvas.offsetLeft,
                        y: e.pageY - canvas.offsetTop,
                    }
                })
                canvas.value.addEventListener('mousedown', function (e) {
                    e.preventDefault()
                    isMousedown = true
                })
                canvas.value.addEventListener('mouseup', function (e) {
                    e.preventDefault()
                    isMousedown = false
                })
            }
            return {
                canvas
            }
        }
    }
</script>
