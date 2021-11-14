<template>
    <div class="topbar" :class="[ FULLSCREENBAR === true ? 'barFadeInDownBig zIndexTop theme-desktop-bg': 'nofull' ]">
        <div class="topbar-left">
            <vm-about></vm-about>
        </div>
        <div class="topbar-right">
            <vm-electricity></vm-electricity>
            <vm-wifi></vm-wifi>
            <vm-search></vm-search>
            <vm-controlcenter></vm-controlcenter>
        </div>
        <vm-global-search v-if="STARTGLOBALSEARCH"></vm-global-search>
    </div>
</template>

<script>
    import About from "./components/About.vue";
    import Electricity from "./components/Electricity.vue";
    import Wifi from "./components/Wifi.vue";
    import Search from "./components/Search.vue";
    import Controlcenter from "./components/Controlcenter.vue";
    import globalSearch from "@/components/search/index.vue";
    import { useStore } from "vuex";
    import { computed } from "vue";
    export default{
        components:{
            VmAbout:About,
            VmElectricity:Electricity,
            VmWifi:Wifi,
            VmSearch:Search,
            VmControlcenter:Controlcenter,
            VmGlobalSearch:globalSearch
        },
        setup(){
            const store = useStore();
            const FULLSCREENBAR = computed( () => store.getters.FULLSCREENBAR )
            const STARTGLOBALSEARCH = computed( () => store.getters.STARTGLOBALSEARCH)
            return {
                FULLSCREENBAR,
                STARTGLOBALSEARCH
            }
        }
    }
</script>

<style lang="less">
    .topbar{
        width: 100vw;height: 24px;
        backdrop-filter: blur(40px);
        display: flex;
        align-items: center;
        justify-content:space-between;
        padding: 0 10px 0 15px;
        box-sizing: border-box;
        position: fixed;
        top:0;left:0;
        z-index: 999;
        .topbar-left{
            height: 100%;
        }
        .topbar-right{
            height: 100%;
            display: flex;
            align-items: center;
        }
    }
    .nofull{background: rgba(24,48,87, 0.1);}
</style>