<template>
  <div class="right-sidebar">
    <div class="weather"></div>
    <vmClock></vmClock>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.right-sidebar {
  position: fixed;
  width: 280px;
  height: 100vh;
  top: 24px;
  right: 0px;
  z-index: 99;
  transition: all 0.2s;
  padding: 0 10px;
  box-sizing: border-box;
  &::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    backdrop-filter: blur(20px);
    background-color: rgba(0, 0, 0, 0.1);
  }
  .weather {
    width: 100%;
    height: 200px;
    // background: rgba(255, 255, 255, 0.3);
    margin-top: 10px;
  }
}
</style>
