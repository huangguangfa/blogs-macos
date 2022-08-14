<template>
  <div class="electricity">
    <span class="mr5 cursorAuto noCopy">90%</span>
    <i class="iconfont macos-electricity-full"></i>
  </div>
</template>
<script></script>

<style lang="less">
.electricity {
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 3px;
  cursor: auto;
  .macos-electricity-full {
    font-size: 23px;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}
</style>
