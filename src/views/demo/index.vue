<template>
    <window :show="data.status"></window>
    <button @click=" data.status = !data.status ">显示</button>
</template>

<script>
    import { reactive } from "vue";
    export default {
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