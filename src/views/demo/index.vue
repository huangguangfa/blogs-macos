<template>
<!--    <Terminal v-model:show="data.status"></Terminal>-->
    <button @click="show">显示</button>
<!--    <globalSearch></globalSearch>-->
    <facetime :show="data.status"></facetime>
    <!-- <safari :show="true"></safari> -->
</template>

<script>
    import { reactive } from "vue";
    import safari from "@/components/apps/safari/index.vue"
    import vscode from "@/components/apps/vscode/index.vue"
    import Terminal from "@/components/apps/Terminal/index.vue"
    import facetime from "@/components/apps/facetime/index.vue"
    export default {
        components:{
            safari,
            vscode,
            Terminal,
            facetime
        },
        setup(){
            let data = reactive({
                status:true
            })

            function show(){
                data.status = true
            }
            return {
                data,
                show
            }
        }
    }
</script>
