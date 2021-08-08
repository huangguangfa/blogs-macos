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
                <vm-init-page v-show="!isShowWeb" @dispatchNewWeb="openNewUrl"></vm-init-page>
                <vm-web-page v-show="isShowWeb" :webUrl="currentWebUrl"></vm-web-page>
            </div>
        </window>
    </div>
</template>

<script>
    import { watch, ref  } from "vue";
    import initPage from "./initPage.vue";
    import webPage from "./web.vue"
    export default{
        components:{
            vmInitPage:initPage,
            vmWebPage:webPage
        },
        props:{
            show:Boolean
        },
        setup(props, { emit }){
            const isShowWeb = ref(false);
            const currentWebUrl = ref(null);
            watch( () => props.show ,status => emit('update:show',status))

            // methods
            function openNewUrl(url){
                if(!url) return ;
                isShowWeb.value = true;
                currentWebUrl.value = url;

            }
            return {
                isShowWeb,
                currentWebUrl,

                //methods
                openNewUrl
            }
        }        
    }
</script>

<style lang="less">
    @import url("./index.less");
</style>
