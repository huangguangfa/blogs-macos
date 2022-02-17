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

<script setup>
    // import { useStore } from "vuex";
    import { computed } from "vue";
    import VmAbout from "./components/About.vue";
    import VmElectricity from "./components/Electricity.vue";
    import VmWifi from "./components/Wifi.vue";
    import VmSearch from "./components/Search.vue";
    import VmControlcenter from "./components/Controlcenter.vue";
    import VmGlobalSearch from "@/components/search/index.vue";

    // const store = useStore();
    // const FULLSCREENBAR = computed( () => store.getters.FULLSCREENBAR )
    // const STARTGLOBALSEARCH = computed( () => store.getters.STARTGLOBALSEARCH)
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