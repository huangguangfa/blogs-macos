<template>
    <div class="Terminal">
        <window v-model:show="show" title="Terminal">
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
        show:Boolean
    },
    setup(props, vm){
        onMounted( () =>{
            props.show && initXterm();
        })
        watch( () => props.show ,(status) =>{
            vm.emit('update:show',status);
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
