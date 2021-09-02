<template>
    <div class="vscode">
        <window v-model:show="show" title="VSCode">
            <div class="vscode-content wh100" v-if="show">
                <vm-iframe webUrl="https://github1s.com/huanggungfa/blogs-macos"></vm-iframe>
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
        setup(props, { emit }){
            watch( () => props.show ,status => emit('update:show',status))
        }        
    }
</script>