<template>
    <div class="empty">
        <img draggable="false" src="../../assets/images/empty/empty.png" alt="">
        <div class="empyt-text">{{  empytText }}</div>
    </div>
</template>

<script>
    import { ref } from "vue"
    export default {
        name:"vmEmpty",
        props:{
            text:String
        },
        setup(props){
            let empytText = ref(props.text ?? '暂无数据')
            return {
                empytText
            }
        }
    }
</script>

<style lang="less">
    .empty{
        img{width: 100%;height: 100%}
        .empyt-text{color: #ccc;font-size: 12px;text-align: center}
    }
</style>