<template>
    <div class="maps">
        <window v-model:show="appInfo.desktop" title="高德地图" width="1000" height="600" :appInfo="appInfo">
            <div class="github-content wh100" v-if="appInfo.desktop">
                <vm-iframe ids="高德地图" webUrl="https://www.amap.com"></vm-iframe>
            </div>
        </window>
    </div>
</template>

<script>
    export default{
        props:{
            appInfo:Object
        }       
    }
</script>
