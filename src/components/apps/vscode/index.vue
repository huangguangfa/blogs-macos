<template>
    <div class="vscode">
        <window v-model:show="appInfo.desktop" title="VSCode" width="800" :appInfo="appInfo">
            <div class="vscode-content wh100" v-if="appInfo.desktop">
                <vm-iframe ids="VSCode" v-if="isLoginVscode" webUrl="https://huangguangfa.cn/vscode/"></vm-iframe>
                <div class="login_locks" v-else>
                    <p class="tips">登陆到云开发工具</p>
                    <vmlogin submitText="确认" userLabel="用户名" phoneLabel="密码" :isShowReset="false" :isInit="false" @submit="loginVscode"></vmlogin>
                </div>
            </div>
        </window>
    </div>
</template>

<script>
    import login from "../../locks/index.vue";
    import { logins } from "@/services/api/user-api.js"
    import { ref, getCurrentInstance } from "vue";
    export default{
        components:{
            vmlogin:login
        },
        props:{
            appInfo:Object
        },
        setup(){
            const { proxy } = getCurrentInstance();
            const isLoginVscode = ref(0);
            async function loginVscode(_,info){
                const { uId, uName } = info;
                const { success } = await logins({
                    "userName": uName,
                    "password": uId
                })
                if( success ){
                    isLoginVscode.value = true;
                }else{
                    proxy.$message.error({
                        content:'账号密码错误！'
                    })
                }
            }
            return {
                isLoginVscode,
                loginVscode
            }
        }        
    }
</script>
<style lang="less" scoped>
    .login_locks{
        width: 100%;height: 100%;position: relative;
        .tips{
            position: absolute;top: 50px;z-index: 9999;right: 150px; 
            font-weight: bold;color: #0092e9;
        }
    }
</style>