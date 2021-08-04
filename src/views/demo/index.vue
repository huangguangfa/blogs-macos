<template>
    <Terminal v-model:show="data.status"></Terminal>
    <button @click="data.status = true ">显示</button>
</template>

<script>
    import { reactive } from "vue";
    import safari from "../../components/apps/safari.vue"
    import vscode from "@/components/apps/vscode/index.vue"
    import Terminal from "@/components/apps/Terminal/index.vue"
    export default {
        components:{
            safari,
            vscode,
            Terminal
        },
        setup(){
            let data = reactive({
                status:true
            })
            return {
                data
            }
        }
    }
</script>
