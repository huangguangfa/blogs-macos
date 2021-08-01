<template>
    <div class="safari">
        <window v-model:show="show" title="Safari">safari浏览器</window>
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
