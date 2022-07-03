<template>
  <div class="right-sidebar">
    <div class="clock-wrap">
      <div class="clock-items">
        <vmClock></vmClock>
        <div class="country">深圳(⛅️ 26 *C)</div>
      </div>
      <div class="clock-items">
        <vmClock :hour="15"></vmClock>
        <div class="country">西雅图(⛅️ 26 *C)</div>
      </div>
    </div>
    <div class="weather"></div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.right-sidebar {
  position: fixed;
  width: 300px;
  height: 100vh;
  top: 24px;
  right: 0px;
  z-index: 999;
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
  .clock-wrap {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    .clock-items {
      text-align: center;
      .country {
        font-size: 14px;
        margin-top: 10px;
        font-weight: bold;
        color: #fff;
      }
    }
  }
}
</style>
