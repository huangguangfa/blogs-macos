<template>
    <li class="tabbar-item duration-150 ease-in">
        <p class="tabbar-title">{{ title }}</p>
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
    .tabbar-item{
        padding-left:8px;
        position: relative;
        padding-bottom: 10px;
        justify-content: flex-end;
        align-items: center;
        flex-direction: column;
        will-change: width;
        display: flex;
        .tabbar-title{
            color: black;
            background-color: rgba(209,213,219,0.8);
            padding-top: .25rem;
            padding-bottom: .25rem;
            padding-left: .75rem;
            padding-right: .75rem;
            border-radius: .375rem;
            position: absolute;
            top: -70px;
            display: none;
        }
        .tabbar-img{
            transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
            transform-origin: bottom;
            transition-duration: .15s;
            will-change: width;
            
        }
        &:hover .tabbar-title{display: block;}
    }
</style>