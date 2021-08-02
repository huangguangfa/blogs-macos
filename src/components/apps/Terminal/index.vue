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
import { watch, onMounted, reactive  } from "vue";
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
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
export default{
    props:{
        show:Boolean
    },
    setup(props, vm){
        onMounted( () =>{
            const initSysEnv = async () =>
                await axios
                .post("http://106.54.70.48/terminal")
                .then((res) => res.data)
                .catch((err) => {
                throw new Error(err);
            });
            let terminalContainer = document.getElementById('xterm')
            xterms.open(terminalContainer,true);
            xterms.writeln('Welcome to gf cloud!!!');
            async function asyncInitSysEnv() {
                const pid = await initSysEnv();
                console.log(pid)
                // ws = new WebSocket(socketURL + pid),
                // attachAddon = new AttachAddon(ws);
                // term.loadAddon(attachAddon);
            }
            asyncInitSysEnv();
            // xterms._initialized = true;
            // xterms.prompt = () => {
            //     xterms.write('\r\n~$ ');
            // };
            // xterms.prompt();
            // xterms.onData( function(data) {
            //     xterms.write(data)
            // })
            // xterms.onKey(e => {
            //     const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
            //     if (e.domEvent.keyCode === 13) {
            //         xterms.prompt()
            //     } else if (e.domEvent.keyCode === 8) {
            //         if (xterms._core.buffer.x > 3) {
            //             xterms.write('\b \b');
            //         }
            //     }
            // });
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
