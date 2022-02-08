<template>
    <div class="github">
        <window v-model:show="appInfo.desktop" title="GitHub" :appInfo="appInfo" width="1200" height="600">
            <div class="github-content wh100" v-if="appInfo.desktop">
                内容
            </div>
        </window>
    </div>
</template>

<script>
    export default{
        props:{
            appInfo:Object
        },
        setup(){
            console.log('111')
        }
    }
</script>
