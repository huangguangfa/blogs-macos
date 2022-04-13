<template>
    <div class="blogs">
        <window v-model:show="appInfo.desktop" title="@gf-ui" width="1200" height="600" :appInfo="appInfo">
            <div class="github-content wh100" v-if="appInfo.desktop">
                <vm-iframe ids="gfBlogs" webUrl="https://www.huangguangfa.cn/doc/zh/core/install.html"></vm-iframe>
            </div>
        </window>
    </div>
</template>

<script setup>
    const props = defineProps({
        appInfo:Object
    })
</script>
