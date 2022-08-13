<template>
  <div class="clock">
    <canvas ref="clockRef" :height="props.size" :width="props.size"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, withDefaults } from "vue";
const props = withDefaults(defineProps<{ size?: number; hour?: number }>(), {
  size: 120,
  hour: 0,
});
const clockRef = ref();
let ctx: any, width: number, height: number, r: number, rem: number;
let times: NodeJS.Timer;

onMounted(() => {
  ctx = clockRef.value.getContext("2d");
  width = ctx.canvas.width;
  height = ctx.canvas.height;
  r = width / 2;
  rem = width / 230; //比例
  times = setInterval(draw, 1000);
});

onUnmounted(() => {
  times && clearInterval(times);
});

//画圆
function drawBackground() {
  ctx.save();
  ctx.translate(r, r);
  ctx.beginPath();
  ctx.lineWidth = 10 * rem;
  //以0，0为原点，r为半径，0为起始角，2*Math.PI为结束角，顺时针画圆
  ctx.arc(0, 0, r - ctx.lineWidth / 2, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.fill();
  let hourNumber = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
  ctx.font = 18 * rem + "px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  //画出1-12的数字
  ctx.fillStyle = "#000";
  hourNumber.forEach(function (number, i) {
    let rad = ((2 * Math.PI) / 12) * i;
    let x = Math.cos(rad) * (r - 30 * rem);
    let y = Math.sin(rad) * (r - 30 * rem);
    ctx.fillText(number, x, y);
  });
  ctx.strokeStyle = "#000";
  //画出秒针走动的60个点
  // for (let i = 0; i < 60; i++) {
  //   let rad = ((2 * Math.PI) / 60) * i;
  //   let x = Math.cos(rad) * (r - 18 * rem);
  //   let y = Math.sin(rad) * (r - 18 * rem);
  //   ctx.beginPath();
  //   if (i % 5 === 0) {
  //     ctx.fillStyle = "#000";
  //     ctx.arc(x, y, 2 * rem, 0, 2, 2 * Math.PI, false);
  //   } else {
  //     ctx.fillStyle = "#ccc";
  //     ctx.arc(x, y, 2 * rem, 0, 2, 2 * Math.PI, false);
  //   }
  //   ctx.fill();
  // }
}

//绘制时针
function drawHour(hour: number, minute: number) {
  ctx.save();
  ctx.beginPath();
  let rad = ((2 * Math.PI) / 12) * hour;
  let mrad = ((2 * Math.PI) / 12 / 60) * minute;
  ctx.rotate(rad + mrad);
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.moveTo(0, 10 * rem);
  ctx.lineTo(0, -r / 2);
  ctx.stroke();
  ctx.restore();
}

//绘制分针
function drawMinute(minute: number) {
  ctx.save();
  ctx.beginPath();
  let rad = ((2 * Math.PI) / 60) * minute;
  ctx.rotate(rad);
  ctx.lineWidth = 3 * rem;
  ctx.lineCap = "round";
  ctx.moveTo(0, 10);
  ctx.lineTo(0, -r + 30 * rem);
  ctx.stroke();
  ctx.restore();
}

//绘制秒针
function drawSecond(second: number) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#d89436";
  let rad = ((2 * Math.PI) / 60) * second;
  ctx.rotate(rad);
  ctx.moveTo(-2, 20 * rem);
  ctx.lineTo(2, 20 * rem);
  ctx.lineTo(1, -r + 18 * rem);
  ctx.lineTo(-1, -r + 18 * rem);
  ctx.fill();
  ctx.restore();
}

//画时钟上的中心白色原点
function drawDot() {
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.arc(0, 0, 3 * rem, 0, 2 * Math.PI, false);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  let now = new Date(new Date().setHours(new Date().getHours() - props.hour));
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  drawBackground();
  drawHour(hour, minutes);
  drawMinute(minutes);
  drawSecond(seconds);
  drawDot();
  ctx.restore();
}
</script>
