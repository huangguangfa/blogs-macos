<template>
    <div class="vscode">
        <window v-model:show="show" title="VSCode">
            <div class="vscode-content wh100" v-if="show">
                <iframe style="width:100%;height:100%" src="https://github1s.com/huanggungfa/blogs-macos" frameborder="0"></iframe>
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