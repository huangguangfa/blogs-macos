<template>
    <div class="Terminal">
        <window v-model:show="show" title="Terminal" v-model:appInfo="appInfo">
            <div class="terminal-content" v-if="show">
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
        show:Boolean,
        appInfo:Object
    },
    setup( props, { emit } ){
        onMounted( () =>{
            console.log('props',props.appInfo)
            props.show && initXterm();
        })

        // watch( () => props.appInfo.desktop, () =>{
        //     emit('update:show',status);
        //     nextTick( () =>{
        //         status && initXterm();
        //     })
        //     console.log('change le ...')
        // })
        watch( () => props.show , status =>{
            emit('update:show',status);
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
