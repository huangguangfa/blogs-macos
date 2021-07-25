<template>
    <div class="topbar">
        <div class="topbar-left">
            <VmAbout></VmAbout>
        </div>
        <div class="topbar-right">
            <VmElectricity></VmElectricity>
            <VmWifi></VmWifi>
            <VmSearch></VmSearch>
            <VmControlcenter></VmControlcenter>
        </div>
    </div>
</template>

<script>
    import About from "./components/About.vue";
    import Electricity from "./components/Electricity.vue";
    import Wifi from "./components/Wifi.vue";
    import Search from "./components/Search.vue";
    import Controlcenter from "./components/Controlcenter.vue";
    export default{
        components:{
            VmAbout:About,
            VmElectricity:Electricity,
            VmWifi:Wifi,
            VmSearch:Search,
            VmControlcenter:Controlcenter
        }

    }
</script>


<style lang="less">
    .topbar{
        width: 100vw;height: 24px;
        background: rgba(24,48,87, 0.1);
        display: flex;
        align-items: center;
        justify-content:space-between;
        padding: 0 10px 0 15px;
        box-sizing: border-box;
        .topbar-left{
            height: 100%;
        }
        .topbar-right{
            height: 100%;
            display: flex;
            align-items: center;
        }
    }
</style>