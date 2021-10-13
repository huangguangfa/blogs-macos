<template>
    <div class="github">
        <window v-model:show="show" title="GitHub" :appInfo="appInfo">
            <div class="github-content wh100" v-if="show">
                <vm-iframe webUrl="https://github1s.com/huanggungfa/blogs-macos"></vm-iframe>
                <!-- <iframe style="width:100%;height:100%" src="https://github1s.com/huanggungfa/blogs-macos" frameborder="0"></iframe> -->
            </div>
        </window>
    </div>
</template>

<script>
    import { watch  } from "vue"
    export default{
        props:{
            show:Boolean,
            appInfo:Object
        },
        setup(props, {emit}){
            watch( () => props.show ,status => emit('update:show',status))
        }       
    }
</script>
