<template>
    <li class="tabbar-item duration-150 ease-in flex align-items-center justify-flex-end flex-column relative">
        <p class="tabbar-title absolute d-none">{{ title }}</p>
        <img  class="tabbar-img" :style="`width:${TABABRLISTWIDTH[keyIndex]}px;height:${TABABRLISTWIDTH[keyIndex]}px;`" :data-index="keyIndex" :src="img" alt="">
    </li>
</template>

<script>
    export default{
        props:{
            title:{
                type: String,
                default: ''
            },
            img:{
                type: String,
                default: ''
            },
            keyIndex:{
                type:Number,
                default:0
            },
            TABABRLISTWIDTH:{
                type:Array,
                default:[]
            }
        }
    }
</script>

<style lang="less">
    .tabbar-item{ padding-left:8px; padding-bottom: 10px; will-change: width; user-select: none;
        &:hover .tabbar-title{display: block;}
        .tabbar-title{ color: black; background-color: rgba(209,213,219,0.8);  padding:5px 10px; border-radius: .375rem; top: -80px;}
        .tabbar-img{ transition-timing-function: cubic-bezier(0.4, 0, 1, 1); transform-origin: bottom; transition-duration: .15s;  will-change: width; }
    }
</style>