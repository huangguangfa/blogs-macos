<template>
    <div class="blogs">
        <window v-model:show="appInfo.desktop" title="gfBlogs（https://www.huangguangfa.cn/blog/#/）" width="1100" height="700" :appInfo="appInfo">
            <div class="github-content wh100" v-if="appInfo.desktop">
                <vm-iframe ids="gfBlogs" webUrl="https://www.huangguangfa.cn/blog/#/"></vm-iframe>
            </div>
        </window>
    </div>
</template>

<script setup>
    const props = defineProps({
        appInfo:Object
    })
</script>
