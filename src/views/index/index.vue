<template>
    <div class="home">
        <VmTopbar></VmTopbar>
        <VmTabbar></VmTabbar>
    </div>
</template>



<script>
import Tabbar from '@/components/tabbar/index.vue';
import Topbar from "@/components/topbar/index.vue"
export default{
    components:{
        VmTabbar:Tabbar,
        VmTopbar:Topbar
    }
}
</script>


<style lang="less">
    
</style>