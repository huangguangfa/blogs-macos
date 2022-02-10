<template>
    <div class="github">
        <window v-model:show="appInfo.desktop" title="2022/01/03" :appInfo="appInfo" width="1500" height="700">
            <div class="github-content wh100" style="background-image: linear-gradient(to bottom, #1d1c2c, #3c364c);" v-if="appInfo.desktop">
                <canvas id="canvas" ref="canvas" style="width:100%;height:100%;"></canvas>
            </div>
        </window>
    </div>
</template>

<script>
    import { watch, nextTick, onUnmounted } from "vue"
    export default{
        props:{
            appInfo:Object
        },
        setup(props){
            // const canvas = ref(null);
            let ctx = null;
            let canvasWidth = 0;
            let canvasHeight = 0;
            let fireworks = []; // 烟花集合
            let particles = []; // 粒子集合
            let textData = null;
            let dateTextData = null;
            let requestId;
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
            // 粒子
            class Particle {
                // 初始化时的x,y坐标
                constructor(x, y, hue) {
                this.x = x
                this.y = y

                // 粒子坐标集合
                this.coords = [
                    [x, y],
                    [x, y],
                    [x, y],
                ]

                // 随机弧度
                this.angle = randomRange(0, Math.PI * 2)
                // 随机基本速度
                this.speed = randomRange(1, 10)

                // 摩擦系数、重力（减缓粒子速度、模拟抛物线下坠）
                this.friction = 0.95 // 百分比 不同材质的物体摩擦系数不同（有现成值）
                this.gravity = 1 // 作用于y轴加速度 模拟往下坠

                // 随机色调（基础色调-20和+20之间）
                this.hue = randomRange(hue - 20, hue + 20)
                // 随机亮度
                this.brightness = randomRange(50, 80)
                // 初始透明度
                this.alpha = 1
                // 随机的透明度衰变系数（透明度减淡）
                this.alphaDecay = randomRange(0.015, 0.03)
                }

                // 更新某个（索引）粒子属性
                update(index) {
                // 删掉最后一项 在最前面塞入一项
                this.coords.pop()
                this.coords.unshift([this.x, this.y])

                this.speed *= this.friction // 先减速

                // 由弧度计算出当前x,y坐标值
                // 难点：看原理/正弦余弦理解.png
                this.x += Math.cos(this.angle) * this.speed
                this.y += Math.sin(this.angle) * this.speed + this.gravity

                // 透明度衰减
                this.alpha -= this.alphaDecay
                // 当透明度小于最小衰减值 就把这个例子对象删除
                if (this.alpha < this.alphaDecay) {
                    particles.splice(index, 1)
                }
                }

                // 绘制粒子（例子以line的方式）
                draw() {
                ctx.beginPath()
                // 从集合中最后一个项开始
                const [startX, startY] = this.coords[this.coords.length - 1]
                ctx.moveTo(startX, startY)
                ctx.lineTo(this.x, this.y)
                // hsla的颜色模式
                ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha}`
                ctx.lineWidth = 3
                ctx.lineCap = 'round'
                ctx.stroke()
                }
            }
            // 烟火
            class Firework {  
                // 起始点坐标sx,sy 目标点坐标tx,ty
                constructor(sx, sy, tx, ty) {
                    // 当前坐标
                    this.x = sx
                    this.y = sy
                    // 起始点坐标
                    this.sx = sx
                    this.sy = sy
                    // 目标点坐标
                    this.tx = tx
                    this.ty = ty

                    // 起始点到目标点的距离
                    this.distanceToTarget = calcPointsDistance(sx, sy, tx, ty)
                    // 移动后的距离
                    this.distanceTraveled = 0

                    // 烟花的轨迹坐标
                    this.coords = [
                        [this.x, this.y],
                    ]

                    // Math.atan2是计算某点到原点0,0与x正轴的弧度值，传入y,x
                    // 难点：看原理/向量坐标的关系.png 目标点向量为两个点的向量相加 已经有了起始点 那就求出另一个点
                    // 求出弧度后为了update中分解为vx,vy服务
                    this.angle = Math.atan2(ty - sy, tx - sx)
                    this.speed = 2 // 基础移动速度为2
                    this.acceleration = 1.05 // 加速度系数
                    this.hue = randomRange(0, 360)
                    this.brightness = randomRange(50, 70) // 随机亮度
                }

                // 更新某个烟花属性（烟花移动是加速度的）
                update(index) {
                    // 删掉最后一项 在最前面塞入一项
                    this.coords.pop()
                    this.coords.unshift([this.x, this.y])

                    this.speed *= this.acceleration // 进行加速度

                    const vx = Math.cos(this.angle) * this.speed
                    const vy = Math.sin(this.angle) * this.speed

                    // 计算出移动后的距离
                    this.distanceTraveled = calcPointsDistance(this.sx, this.sy, this.x + vx, this.y + vy)

                    // 如果移动到目标点 就创建50个爆炸粒子对象，并删除这个射出的烟火对象
                    // 否则继续更新this.x,this.y
                    if (this.distanceTraveled >= this.distanceToTarget) {
                        for (let i = 0; i < 75; i++) {
                            particles.push(new Particle(this.tx, this.ty, this.hue))
                        }
                        fireworks.splice(index, 1)
                    } else {
                        this.x += vx
                        this.y += vy
                    }
                }

                // 绘制烟火
                draw() {
                    ctx.beginPath()
                    const [startX, startY] = this.coords[this.coords.length - 1]
                    ctx.moveTo(startX, startY)
                    ctx.lineTo(this.x, this.y)
                    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, 60%` // 仅亮度会变化
                    ctx.lineWidth = 1
                    ctx.stroke()
                }
            }
            // 文字粒子
            class TextParticle {
                constructor(point) {
                this.x = point.x; // 记录点位最终应该停留在的x轴位置
                this.y = point.y; // 记录点位最终应该停留在的y轴位置
                this.mx = Math.random() * canvas.width;
                this.my = Math.random() * canvas.height;
                this.radius = Math.random() * 3;
                this.speed = Math.random() * 40 + point.speed;
                this.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
                    Math.random() * 255
                },${Math.random() + 0.2})`;
                }
                draw() {
                    ctx.beginPath();
                    ctx.fillStyle = this.color;
                    ctx.arc(this.mx, this.my, this.radius, 0, Math.PI * 2, false);
                    ctx.fill();
                    this.update();
                }
                // 可以使用更复杂的贝塞尔曲线
                update() {
                    this.mx = this.mx + (this.x - this.mx) / this.speed;
                    this.my = this.my + (this.y - this.my) / this.speed;
                }
            }

            watch( () => props.appInfo.desktop, (status) =>{
                nextTick( () =>{
                    if( status ){ initCanvas() }
                    else{
                        console.log('删除了')
                        window.cancelAnimationFrame(requestId);
                    }
                })
            })

            function initCanvas(){
                const canvas = document.getElementById('canvas')
                ctx = document.getElementById('canvas').getContext('2d')
                canvasWidth = 1500;
                canvasHeight = 700;
                // canvas全屏
                canvas.width = canvasWidth
                canvas.height = canvasHeight
                // 鼠标点击就发射烟花
                canvas.addEventListener('mousemove', function (e) {
                    mouseCoord = {
                        x: e.pageX - canvas.offsetLeft,
                        y: e.pageY - canvas.offsetTop,
                    }
                })
                canvas.addEventListener('mousedown', function (e) {
                    e.preventDefault()
                    isMousedown = true
                })
                canvas.addEventListener('mouseup', function (e) {
                    e.preventDefault()
                    isMousedown = false
                })
                // 调用循环函数
                textData = getTextImageData();
                dateTextData = getTextImageData('2022 - 01 - 03  广发', canvasWidth-700, canvasHeight / 2 + 160, 75)
                render()
            }
            function render() {
                requestId = window.requestAnimationFrame(render);
                // 制造拖尾效果，不使用clearRect 每次覆盖一层带透明度的底色
                ctx.globalCompositeOperation = 'destination-out' // 现有内容保持在新图形不重叠的地方
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
                ctx.fillRect(0, 0, canvasWidth, canvasHeight)
                ctx.globalCompositeOperation = 'lighter'
                textData.forEach( value => value.draw() );
                dateTextData.forEach( value => value.draw() );
                // 循环绘制和更新
                for (let i = 0; i < fireworks.length; i++) {
                    fireworks[i].draw()
                    fireworks[i].update(i)
                }
                for (let i = 0; i < particles.length; i++) {
                    particles[i].draw()
                    particles[i].update(i)
                }

                // 函数循环80次自动发射8支烟花
                if (timerTick >= timerTotal) {
                    if (!isMousedown) {
                        for (let i = 0; i < 8; i++) {
                            fireworks.push(new Firework(canvasWidth / 2, canvasHeight, randomRange(0, canvasWidth), randomRange(0, canvasHeight / 2)))
                        }
                        timerTick = 0
                    }
                } else {
                    timerTick++
                }

                // 达到循环5次且鼠标按下时 发射一个烟火
                if (limiterTick >= limiterTotal) {
                if (isMousedown) {
                    fireworks.push(new Firework(canvasWidth / 2, canvasHeight, mouseCoord.x, mouseCoord.y))
                    limiterTick = 0 // 清0
                }
                } else {
                    limiterTick++
                }
            }
            // 获取范围内的随机数
            function randomRange(min, max) {
                return Math.random() * (max - min) + min
            }

            // 计算两点之间/起始点到目标点的距离
            //（公式：求两个向量之间距离）
            function calcPointsDistance(sx, sy, tx, ty) {
                return Math.sqrt(Math.pow((tx - sx), 2) + Math.pow((ty - sy), 2))
            }
            function getTextImageData(text = '翻过的高墙会成为人生的盾牌', x, y , fontSize=100){
                ctx.font = `${fontSize}px Fantasy`;
                const measure = ctx.measureText(text);
                x = x || (canvasWidth - measure.width) / 2;
                y = y || canvasHeight / 2
                ctx.fillText(text, x, y);
                let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
                const particles = [];
                for (let x = 0; x < canvasWidth; x += 4) {
                    for (let y = 0; y < canvasHeight; y += 4) {
                        // 判断当前像素点是否有文字
                        const pxAlphaIndex = (x + y * canvasWidth) * 4 + 3;
                        if (imageData[pxAlphaIndex] > 0) {
                            particles.push(
                                new TextParticle({ x, y, speed:10 })
                            );
                        }
                    }
                }
                return particles;
            }
            return {
                // canvas
            }
        }
    }
</script>
