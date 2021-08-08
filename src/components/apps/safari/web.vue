<template>
    <div class="web_page">
        <iframe ref="iframes" frameborder="0"></iframe>
    </div>
</template>

<script>
    import { ref, watch } from 'vue'
    export default{
        props:{
            webUrl:String
        },
        setup(props){
            let iframes = ref(null);
            let loading = ref(true);
            watch( () => props.webUrl, (newUrl) =>{
                loading.value = true;
                let iframe = iframes.value;
                iframe.src = newUrl;
                iframe.attachEvent ? iframe.attachEvent("onload", onload) : iframe.onload = onload;
            })

            //methods
            function onload(){
                loading.value = false;
                console.log('加载成功')
            }
            return {
                iframes,
                loading
            }
        }
    }
</script>

<style lang="less">
    .web_page{
        width: 100%;height:100%;
        iframe{width: 100%;height:100%;}
    }
    
</style>
