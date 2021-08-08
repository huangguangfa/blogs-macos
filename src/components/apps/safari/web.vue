<template>
    <div class="web_page wh100">
       <vm-iframe :webUrl="propsWebUrl"></vm-iframe>
    </div>
</template>
<script>
import { ref,watch } from 'vue'
    export default{
        props:{
            webUrl:String
        },
        setup(props){
            let propsWebUrl = ref(props.webUrl);
            watch( () => props.webUrl, (newUrl) =>{
                propsWebUrl.value = newUrl;
            })
            return {
                propsWebUrl
            }
        }
    }
</script>

