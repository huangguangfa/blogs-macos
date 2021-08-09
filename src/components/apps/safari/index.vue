<template>
    <div class="safari">
        <window v-model:show="show" width="1000" height="600" title="Safari">
            <template v-slot:bar-title>
                <div class="bar-title-content">
                    <div class="bar-title-content-left">
                        <i class="iconfont macos-fenlan"></i>
                        <i class="iconfont macos-jiantouarrow487 left-s ml25" :class="{ 'disable': isShowWeb === false }" @click="backLastPage('left')"></i>
                        <i class="iconfont macos-jiantouarrow487 ml15" :class="{ 'disable': ( currentWebUrl === null && isShowWeb === false ||  currentWebUrl !== null && isShowWeb === true) }" @click="backLastPage('right')"></i>
                    </div>
                    <div class="safai-search">
                        <i class="iconfont macos-dunpai mr10"></i>
                        <input class="safai-search-input" type="text" v-model="inputWebUrl" @keyup.enter="submit" placeholder="Search or enter website name">
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
    import { watch, ref } from "vue";
    import initPage from "./initPage.vue";
    import webPage from "./web.vue";
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
            const inputWebUrl = ref(null);
            watch( () => props.show ,status => emit('update:show',status))
            // methods
            function openNewUrl(url){
                if(!url) return ;
                isShowWeb.value = true;
                currentWebUrl.value = url.trim();
                if( url !== inputWebUrl ){ inputWebUrl.value = url }
            }
            function backLastPage(type){
                let is_continue = {
                    'left':{
                        status:isShowWeb.value !== false,
                        callback:()=>{
                            isShowWeb.value = false;
                            inputWebUrl.value = null;
                        }
                    },
                    'right':{
                        status:currentWebUrl.value !== null && isShowWeb.value === false,
                        callback:()=>{
                            isShowWeb.value = true;
                            inputWebUrl.value = currentWebUrl.value;
                        }
                    }
                }
                const { status, callback } = is_continue[type];
                if( status ) callback();
            }
            function submit(){
                let url = inputWebUrl.value.indexOf('htt') !== -1 ? inputWebUrl.value : 'http://' + inputWebUrl.value;
                openNewUrl(url);
            }
            return {
                isShowWeb,
                currentWebUrl,
                inputWebUrl,

                //methods
                openNewUrl,
                backLastPage,
                submit
            }
        }        
    }
</script>

<style lang="less">
    @import url("./index.less");
</style>
