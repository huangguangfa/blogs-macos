<template>
    <!-- <window v-model:show="data.status"></window> -->
    <safari></safari>
    <button @click="data.status = true ">显示</button>
</template>

<script>
    import { reactive } from "vue";
    import safari from "../../components/apps/safari.vue"
    export default {
        components:{
            safari
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