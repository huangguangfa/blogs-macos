<template>
    <div class="vscode">
        <window v-model:show="show" title="VSCode" width="800">
            <div class="vscode-content wh100">
                <vmlogin submitText="确认" userLabel="用户名" phoneLabel="密码" :isShowReset="false" :isInit="false"></vmlogin>
                <vm-iframe v-if="isLoginVscode" webUrl="https://github1s.com/huanggungfa/blogs-macos"></vm-iframe>
            </div>
        </window>
    </div>
</template>

<script>
    import { watch  } from "vue"
    import login from "../../locks/index.vue";
    export default{
        components:{
            vmlogin:login
        },
        props:{
            show:Boolean
        },
        setup(props, { emit }){
            const isLoginVscode = localStorage.getItem("isLoginVscode");

            watch( () => props.show ,status => emit('update:show',status))

            return {
                isLoginVscode
            }
        }        
    }
</script>