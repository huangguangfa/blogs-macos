<template>
    <div class="vscode">
        <window v-model:show="show" title="VSCode" width="800">
            <div class="vscode-content wh100" v-if="show">
                <vm-iframe ids="VSCode" v-if="isLoginVscode" webUrl="http://vscode.huangguangfa.cn:6689"></vm-iframe>
                <div class="login_locks" v-else>
                    <p class="tips">登陆到云开发工具</p>
                    <vmlogin submitText="确认" userLabel="用户名" phoneLabel="密码" :isShowReset="false" :isInit="false" @submit="loginVscode"></vmlogin>
                </div>
            </div>
        </window>
    </div>
</template>

<script>
    import { watch  } from "vue";
    import login from "../../locks/index.vue";
    import { ref, getCurrentInstance } from "vue";
    export default{
        components:{
            vmlogin:login
        },
        props:{
            show:Boolean
        },
        setup(props, { emit }){
            const { proxy } = getCurrentInstance();
            const isLoginVscode = ref(localStorage.getItem("isLoginVscode"));
            watch( () => props.show ,status => emit('update:show',status))

            function loginVscode(_,info){
                const { uid, uname } = info;
                if( uid === 'guangfa123' && uname === 'gf' ){
                    localStorage.setItem("isLoginVscode",true)
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