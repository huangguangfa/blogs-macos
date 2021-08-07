<template>
    <div class="search" @click="startGlobalSearch">
        <i class="iconfont macos-sousuo"></i>
    </div>
</template>
<script>
    import store from "@/store/index";
    import { SET_START_GLOBAL_SEARCH } from "@/config/store.config.js";
    export default {
        methods:{
            startGlobalSearch(){
                store.commit(SET_START_GLOBAL_SEARCH,true)
            }
        }
    }
</script>

<style lang="less">
    .search{
        color: #fff;
        font-size: 12px;
        display: flex;
        align-items: center;
        padding: 0 5px;
        border-radius: 3px;
        height: 100%;
        margin: 0 5px;
        .macos-sousuo{
            font-size: 16px;
        }
        &:hover{
            background-color: rgba(255,255,255,0.3);
        }
    }
</style>