<template>
    <div class="maps">
        <window v-model:show="show" title="高德地图" width="1000" height="600">
            <div class="github-content wh100" v-if="show">
                <vm-iframe webUrl="https://www.amap.com"></vm-iframe>
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
