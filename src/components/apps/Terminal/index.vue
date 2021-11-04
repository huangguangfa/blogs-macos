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
import { watch, nextTick, getCurrentInstance,   } from "vue";
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { useStore } from 'vuex';
import { AttachAddon } from "./xterm-addon-attach";
import { initXterms } from "./index"
export default{
    props:{
        appInfo:Object
    },
    setup( props ){
        const store = useStore()
        const { proxy } = getCurrentInstance();
        let xterms = null;
        watch( () => props.appInfo.desktop, (status) =>{
            nextTick( () =>{
                // status && initXterms();
                status && startXterm();
            })
        })
        
        // 结果写入终端
        watch( () => store.getters.GLOABL_SOCKET_DATA, (val, old) =>{
            const { event, data } = val;
            event === 'xterm' && xterms.writeln(data)
        })

        const xtermConfig = {
            cols: 92,
            rows: 22,
            cursorBlink: true, // 光标闪烁
            cursorStyle: "bar", // 光标样式  null | 'block' | 'underline' | 'bar'
            scrollback: 800, //回滚
            tabStopWidth: 8, //制表宽度
            screenKeys: true//
        }
        // methods
        function initXterm(){
            xterms = new Terminal(xtermConfig);
            let terminalContainer = document.getElementById('xterm');
            xterms.open(terminalContainer,true);
            const initXtermTextList = ['\x1b[32m Welcome to gf cloud!!!\x1b[0m', '\x1B[1;3;31m个人五毛钱服务器、我相信你不会乱搞!!!\x1B[0m', '', '[root@VM-0-8-centos ~]# ', ''];
            initXtermTextList.forEach( text => xterms.writeln(text));

            const attachAddon = new AttachAddon(proxy.$scoket.ws);
            console.log('attachAddon',attachAddon)
            xterms.loadAddon(attachAddon);
        }
        
        function startXterm(){
            initXterm()
        }

        function closeXterm(){

        }
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
