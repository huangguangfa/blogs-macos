<template>
    <div class="home">
        <VmTopbar></VmTopbar>
        <VmDock></VmDock>
    </div>
</template>

<script>
import Dock from '@/components/Dock/index.vue';
import Topbar from "@/components/topbar/index.vue";
export default{
    components:{
        VmDock:Dock,
        VmTopbar:Topbar
    }
}
</script>

<style lang="less">
    .home{
        width: 100%;height: 100vh;overflow: hidden;
        position: relative;
    }
</style>