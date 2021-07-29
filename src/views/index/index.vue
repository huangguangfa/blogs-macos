<template>
    <div class="home">
        <VmTopbar></VmTopbar>
        <VmDock></VmDock>
    </div>
</template>

<script>
import Dock from '@/components/Dock/index.vue';
import Topbar from "@/components/topbar/index.vue"
export default{
    components:{
        VmDock:Dock,
        VmTopbar:Topbar
    }
}
</script>


<style lang="less">
    
</style>