<template>
    <vscode></vscode>
    <safari></safari>
    <button @click="data.status = true ">显示</button>
</template>

<script>
    import { reactive } from "vue";
    import safari from "../../components/apps/safari.vue"
    import vscode from "../../components/apps/vscode.vue"
    export default {
        components:{
            safari,
            vscode
        },
        setup(){
            let data = reactive({
                status:false
            })
            return {
                data
            }
        }
    }
</script>
