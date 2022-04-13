<template>
    <div class="blogs">
        <window v-model:show="appInfo.desktop" title="gfBlogs（https://www.yuque.com/caijih/gf/）" width="1400" height="700" :appInfo="appInfo">
            <div class="github-content wh100" v-if="appInfo.desktop">
                <vm-iframe ids="gfBlogs" webUrl="https://www.yuque.com/caijih/gf/"></vm-iframe>
            </div>
        </window>
    </div>
</template>

<script setup>
    const props = defineProps({
        appInfo:Object
    })
</script>
