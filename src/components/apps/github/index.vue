<template>
    <div class="github">
        <window v-model:show="appInfo.desktop" title="GitHub" :appInfo="appInfo">
            <div class="github-content wh100" v-if="appInfo.desktop">
                <vm-iframe webUrl="https://github1s.com/huanggungfa/blogs-macos"></vm-iframe>
                <!-- <iframe style="width:100%;height:100%" src="https://github1s.com/huanggungfa/blogs-macos" frameborder="0"></iframe> -->
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
