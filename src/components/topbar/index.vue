<template>
  <div
    class="topbar"
    :class="[
      FULLSCREENBAR === true
        ? 'barFadeInDownBig zIndexTop theme-desktop-bg'
        : 'nofull',
    ]"
  >
    <div class="topbar-left">
      <vm-about></vm-about>
    </div>
    <div class="topbar-right">
      <vm-xy-info></vm-xy-info>
      <vm-electricity></vm-electricity>
      <vm-wifi></vm-wifi>
      <vm-search></vm-search>
      <vm-controlcenter></vm-controlcenter>
    </div>
    <vm-global-search v-if="STARTGLOBALSEARCH"></vm-global-search>
  </div>
</template>

<script setup>
import { computed } from "vue";
import VmAbout from "./components/About.vue";
import VmElectricity from "./components/Electricity.vue";
import VmWifi from "./components/Wifi.vue";
import VmSearch from "./components/Search.vue";
import VmControlcenter from "./components/Controlcenter.vue";
import VmGlobalSearch from "@/components/search/index.vue";
import VmXyInfo from "./components/Xy-info.vue";
import { useSystemStore } from "@/store/index";
const systemStore = useSystemStore();

const FULLSCREENBAR = computed(() => systemStore.FULLSCREENBAR);
const STARTGLOBALSEARCH = computed(() => systemStore.STARTGLOBALSEARCH);
</script>

<style lang="less">
.topbar {
  width: 100vw;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 15px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  &::after {
    content: "";
    width: 100%;
    height: 100%;
    background: rgba(24, 48, 87, 0.1);
    backdrop-filter: blur(40px);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .topbar-left {
    height: 100%;
  }
  .topbar-right {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
.nofull {
  background: rgba(24, 48, 87, 0.1);
}
</style>
