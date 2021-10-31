<template>
    <div class="home">
        <vm-dock></vm-dock>
    </div>
</template>

<script>
import Dock from '@/components/Dock/index.vue';
export default{
    components:{
        vmDock:Dock,
    }
}
</script>

<style lang="less">
    .home{
        width: 100%;height: 100vh;overflow: hidden;
        position: relative;
    }
</style>
