<template>
    <div class="github">
        <window v-model:show="show" title="GitHub">
            <div class="github-content wh100" v-if="show">
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
        setup(props, vm){
            watch( () => props.show ,(status) =>{
                vm.emit('update:show',status);
            })
        }        
    }
</script>
