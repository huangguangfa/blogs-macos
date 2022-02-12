<template>
    <div class="web_page wh100">
       <vm-iframe :webUrl="propsWebUrl"></vm-iframe>
    </div>
</template>
<script setup>
import { ref,watch } from 'vue'
    const props = defineProps({
        webUrl:String
    })
    let propsWebUrl = ref(props.webUrl);
    watch( () => props.webUrl, (newUrl) =>{
        propsWebUrl.value = newUrl;
    })
</script>

