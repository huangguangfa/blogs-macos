<template>
    <div class="gf-blogs-macos bg-cover bg-center">
        <router-view></router-view>
    </div>
</template>

<style lang="less">
    .gf-blogs-macos{
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: url("~assets/ui/wallpaper-day.jpg") no-repeat;
        filter: brightness(106%);
    }
</style>

<style lang="less">
    @import url("@/styles/index.less");
</style>
