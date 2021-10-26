<template>
    <div class="Terminal">
        <window v-model:show="appInfo.desktop" title="Terminal" v-model:appInfo="appInfo">
            <div class="terminal-content" v-if="appInfo.desktop">
                <div class="xterm" id="xterm"></div>
            </div>
        </window>
    </div>
</template>

<script>
import { watch, onMounted, nextTick  } from "vue";
import 'xterm/css/xterm.css';
import { initXterm } from "./index";
export default{
    props:{
        appInfo:Object
    },
    setup( props ){
        onMounted( () =>{
            props.appInfo.desktop && initXterm();
        })

        watch( () => props.appInfo.desktop, (status) =>{
            nextTick( () =>{
                status && initXterm();
            })
        })
    }
}
</script>
<style lang="less">
    .terminal-content{
        width: 100%;height: 100%;
        background: #000;
        #xterm{width: 100%;height: 100%;}
    }
</style>
