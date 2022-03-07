<template>
    <div class="dmeo">
        <button @click="change">修改</button>
    </div>
</template>


<script>
export default {
    props:{
        bind:{
            type:Object,
            default:() =>{}
        }
    },
    setup(props) {
        const change = () =>{
            console.log('1')
            props.bind.setShow()
        }

        return {
            change
        }
    }
}
</script>
