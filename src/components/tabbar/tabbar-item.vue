<template>
    <li class="tabbar-item duration-150 ease-in">
        <p class="tabbar-title" v-show="false">bear</p>
        <img class="tabbar-img" src="@/assets/images/tabbar-navigation/bear.png" alt="">
    </li>
</template>

<style lang="less">
    .tabbar-item{
        display: flex; align-items: center;margin-left:8px;
        position: relative;
        .tabbar-title{
            color: black;
            background-color: rgba(209,213,219,0.8);
            padding-top: .25rem;
            padding-bottom: .25rem;
            padding-left: .75rem;
            padding-right: .75rem;
            border-radius: .375rem;
            position: absolute;
            top: -80px;
        }
        .tabbar-img{
            width: 50px;height: 50px;
        }
    }
</style>