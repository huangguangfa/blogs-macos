<template>
    <div class="iframe_page">
        <iframe 
            v-show="!loading" 
            :id="ids" 
            ref="iframes" 
            frameborder="0" 
            sandbox="allow-scripts 
			allow-top-navigation
			allow-same-origin
			allow-popups">
        </iframe>
        <vm-loading v-if="loading"></vm-loading>
    </div>
</template>

<script>
    import { ref, watch, onMounted } from 'vue';
    export default{
        name:"vmIframe",
        props:{
            webUrl:String,
            ids:String
        },
        setup(props){
            let iframes = ref(null);
            let loading = ref(true);
            watch( () => props.webUrl, (newUrl) =>initIframe(newUrl))
            onMounted(() =>{
                props.webUrl && initIframe(props.webUrl);
            })
            //methods
            function onload(){
                loading.value = false;
            }
            function initIframe(url){
                loading.value = true;
                let iframe = iframes.value;
                iframe.src = url;
                iframe.attachEvent ? iframe.attachEvent("onload", onload) : iframe.onload = onload;
            }
            return {
                iframes,
                loading
            }
        }
    }
</script>

<style lang="less">
    .iframe_page{
        width: 100%;height:100%;
        iframe{width: 100%;height:100%;}
    }
</style>
