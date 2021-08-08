<template>
    <div class="maps">
        <window v-model:show="show" title="高德地图">
            <div class="github-content wh100" v-if="show">
                <iframe style="width:100%;height:100%" src="https://www.amap.com" frameborder="0"></iframe>
            </div>
        </window>
    </div>
</template>

<script>
    import { watch  } from "vue"
    export default{
        props:{
            show:Boolean
        },
        setup(props, {emit}){
            watch( () => props.show ,status => emit('update:show',status))
        }        
    }
</script>
