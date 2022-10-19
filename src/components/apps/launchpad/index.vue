<template>
  <div class="launchpad" v-show="appInfo.desktop" @click="closeLaunchpad">
    <div style="width: 100px; height: 100px; background: red"></div>
  </div>
</template>

<script setup>
import { watch, nextTick } from "vue";
const props = defineProps({
  appInfo: Object,
});
watch(
  () => props.appInfo.desktop,
  (status) => {
    nextTick(() => {
      if (status) {
        console.log("打开了");
      }
    });
  }
);

function closeLaunchpad() {
  props.appInfo.desktop = false;
}
</script>

<style lang="less" scoped>
.launchpad {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  &::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    backdrop-filter: blur(20px);
    background-color: rgba(0, 0, 0, 0.2);
  }
}
</style>
