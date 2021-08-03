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
import { watch, onMounted  } from "vue";
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach'
import axios from "axios";
const xterms = new Terminal({
    cols: 92,
    rows: 22,
    cursorBlink: true, // 光标闪烁
    cursorStyle: "bar", // 光标样式  null | 'block' | 'underline' | 'bar'
    scrollback: 800, //回滚
    tabStopWidth: 8, //制表宽度
    screenKeys: true//
})
const socketURL = "ws://106.54.70.48:4000/socket/";
export default{
    props:{
        show:Boolean
    },
    setup(props, vm){
        onMounted( () =>{
            const initSysEnv = async () =>
                await axios
                .post("http://106.54.70.48:4000/terminal")
                .then((res) => res.data)
                .catch((err) => {
                throw new Error(err);
            });
            let terminalContainer = document.getElementById('xterm')
            xterms.open(terminalContainer,true);
            xterms.writeln('Welcome to gf cloud!!!');
            async function asyncInitSysEnv() {
                const pid = await initSysEnv(),
                ws = new WebSocket(socketURL + pid),
                attachAddon = new AttachAddon(ws);
                xterms.loadAddon(attachAddon);
            }
            asyncInitSysEnv();
        })
        watch( () => props.show ,(status) =>{
            vm.emit('update:show',status);
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
