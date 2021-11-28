<template>
    <div class="home">
        <vm-dock></vm-dock>
    </div>
</template>

<script>
import Dock from '@/components/Dock/index.vue';
import { getCurrentInstance } from "vue";
export default{
    components:{
        vmDock:Dock,
    },
    setup(){
        const { proxy } = getCurrentInstance();
        // 监听键盘事件
        window.addEventListener('keyup', function(v){
            proxy.$eventBus.$emit('globalKeyup',{
                code:v.key
            })
        }, true)
    }
}
</script>

<style lang="less">
    .home{
        width: 100%;height: 100vh;overflow: hidden;
        position: relative;
    }
</style>
