<template>
  <div class="not-found__page w100vw h100vh o-hide">
    <div class="not-found__content">
      <img src="@/assets/images/common/404.png" alt="" />
      <div class="tips-text">抱歉，当前地址有误，没有找到应用</div>
      <el-button class="to_home">
        <router-link style="color: #fff; text-decoration: none" to="/">
          返回桌面
        </router-link>
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
<style lang="less" scoped>
.not-found__page {
  display: flex;
  justify-content: center;
  padding-top: 120px;
  width: 100vw;
  height: 100vh;
  background: #000;
  .not-found__content {
    width: 313px;
    flex-wrap: wrap;
    align-content: flex-start;
    display: flex;
    justify-content: center;
    img {
      width: 313px;
      height: 202px;
    }
    .tips-text {
      font-size: 14px;
      font-weight: 600;
      color: #eee;
    }
    .to_home {
      width: 116px;
      height: 36px;
      background: #7972fe;
      border-radius: 18px;
      color: #fff;
      font-size: 12px;
      margin-top: 17px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
