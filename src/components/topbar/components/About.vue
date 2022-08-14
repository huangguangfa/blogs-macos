<template>
  <div class="about">
    <i class="iconfont macos-apple"></i>
    <span class="about-text noCopy">Finder</span>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.about {
  height: 100%;
  display: flex;
  align-items: center;
  color: #fff;
  .macos-apple {
    height: 100%;
    display: block;
    display: flex;
    align-items: center;
    padding: 0 15px;
    border-radius: 3px;
    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
  .about-text {
    font-size: 12px;
    font-weight: bold;
    padding-left: 5px;
  }
}
</style>
