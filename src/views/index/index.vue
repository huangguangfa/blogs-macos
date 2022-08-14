<template>
  <div class="home">
    <vm-dock></vm-dock>
  </div>
</template>

<script setup>
import vmDock from "@/components/dock/index.vue";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
// 监听键盘事件
window.addEventListener(
  "keyup",
  function (v) {
    proxy.$eventBus.$emit("globalKeyup", {
      code: v.key,
    });
  },
  true
);
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState == "hidden") {
    document.title = "过来玩我呀";
  } else {
    document.title = "Cloud Desktop";
  }
});
</script>

<style lang="less">
.home {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
