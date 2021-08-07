<template>
    <div class="safari">
        <window v-model:show="show" width="1000" height="600" title="Safari">
            <template v-slot:bar-title>
                <div class="bar-title-content">
                    <div class="bar-title-content-left">
                        <i class="iconfont macos-fenlan"></i>
                        <i class="iconfont macos-jiantouarrow487 left-s ml25 disable"></i>
                        <i class="iconfont macos-jiantouarrow487 ml15 disable"></i>
                    </div>
                    
                    <div class="safai-search">
                        <i class="iconfont macos-dunpai mr10"></i>
                        <input class="safai-search-input" type="text" placeholder="Search or enter website name">
                    </div>
                    <div class="bar-title-content-right">
                        <i class="iconfont macos-fenxiang"></i>
                        <i class="iconfont macos-fuzhi"></i>
                    </div>  
                </div>
            </template>
            <div class="safari-content">
                <vm-init-page></vm-init-page>
            </div>
        </window>
    </div>
</template>

<script>
    import { watch  } from "vue";
    import initPage from "./initPage.vue"
    export default{
        components:{
            vmInitPage:initPage
        },
        props:{
            show:Boolean
        },
        setup(props, vm){
            watch( () => props.show ,(status) =>{
                vm.emit('update:show',status);
            })
        }        
    }
</script>

<style lang="less">
    @import url("./index.less");
</style>
