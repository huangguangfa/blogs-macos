<template>
    <div class="Terminal">
        <window 
            v-model:show="appInfo.desktop" 
            title="Terminal" 
            v-model:appInfo="appInfo" 
            height="420"
            @windowSize="windowSize"
            width="800">
            <div class="terminal-content" v-if="appInfo.desktop">
                <div class="xterm" id="xterm"></div>
                <div class="login_locks" v-if="!isLoginXterm">
                    <p class="tips">登陆到云xterm</p>
                    <vmlogin submitText="确认" userLabel="用户名" phoneLabel="密码" :isShowReset="false" :isInit="false" @submit="loginXterm"></vmlogin>
                </div>
            </div>
        </window>
    </div>
</template>

<script setup>
    import { watch, nextTick, getCurrentInstance, ref } from "vue";
    import 'xterm/css/xterm.css';
    import { Terminal } from 'xterm';
    import { AttachAddon } from "./xterm-addon-attach";
    import { FitAddon } from "./FitAddon";
    import vmlogin from "../../locks/index.vue";
    import { logins } from "@/services/api/user-api"
    const props = defineProps({
        appInfo:Object
    })
    const isLoginXterm = ref(false);
    const { proxy } = getCurrentInstance();
    let attachAddon = null;
    let fitAddon = null;
    let xterms = null;
    watch( () => props.appInfo.desktop, (status) =>{
        nextTick( () =>{
            status && isLoginXterm.value && startXterm();
        })
    })
    async function loginXterm(_,info){
        const { uId, uName } = info;
        const { success } = await logins({
            "userName": uName,
            "password": uId
        })
        if( success ){
            isLoginXterm.value = true;
            startXterm();
        }else{
            proxy.$message.error({
                content:'账号密码错误！'
            })
        }
    }

    // methods
    async function initXterm(){
        const xtermConfig = {
            cols: 92,
            rows: 22,
            cursorBlink: true, // 光标闪烁
            cursorStyle: "bar", // 光标样式  null | 'block' | 'underline' | 'bar'
            scrollback: 800, //回滚
            tabStopWidth: 8, //制表宽度
            screenKeys: true//
        }
        xterms = new Terminal(xtermConfig);
        let terminalContainer = document.getElementById('xterm');
        xterms.open(terminalContainer,true);
        const initXtermTextList = ['\x1b[32m Welcome to gf cloud!!!\x1b[0m', '\x1B[1;3;31m个人五毛钱服务器、我相信你不会乱搞!!!\x1B[0m', '', '[root@VM-0-8-centos ~]# ', ''];
        initXtermTextList.forEach( text => xterms.writeln(text));
        attachAddon = new AttachAddon(proxy.$scoket.ws);
        fitAddon = new FitAddon();
        xterms.loadAddon(attachAddon);
        xterms.loadAddon(fitAddon);
        fitAddon.fit();
    }
    function windowSize(){
        fitAddon && fitAddon.fit();
    }
    function startXterm(){
        initXterm()
    }
</script>
<style lang="less">
    .terminal-content{
        width: 100%;height: 100%;
        background: #000;
        #xterm{width: 100%;height: 100%;}
    }
    .login_locks{
        .tips{
            position: absolute;top: 50px;z-index: 9999;right: 150px; 
            font-weight: bold;color: #0092e9;
        }
    }
</style>
