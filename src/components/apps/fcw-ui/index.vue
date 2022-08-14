<template>
    <div class="fcw-ui">
        <window v-model:show="appInfo.desktop" title="fcw-ui库" width="1500" height="800" :appInfo="appInfo">
            <div class="github-content wh100" v-if="appInfo.desktop">
                <vm-iframe webUrl="https://huangguangfa.cn/fcwui/"></vm-iframe>
            </div>
        </window>
    </div>
</template>

<script setup>
    const props = defineProps({
        appInfo:Object
    })
</script>
