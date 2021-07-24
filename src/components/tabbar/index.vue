<template>
    <div class="tabbars mx-auto fixed bottom-0 right-0 left-0 ">
        <ul 
            class="tabbars-u justify-between justify-center flex-row flex rounded-none border-gray-400 bg-opacity-20 bg-white blur"
            @mousemove="enter" @mouseleave="leave">
            <tabbarItem v-for="item in 8" :key="item"></tabbarItem>
        </ul>
    </div>
</template>

<script>
    import tabbarItem from "./tabbar-item.vue"
    export default{
        components:{
            tabbarItem
        },
        setup(){

        },
        methods:{
            enter(){
                console.log('移入')
            },
            leave(){
                console.log('移出')
            }
        }
    }
</script>

<style lang="less">
    .tabbars{
        z-index: 99999;
        width: 500px;
        .tabbars-u{
            height: 65px;
            box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.17);
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            box-sizing: border-box;
            border: 1px solid #e5e7eb;
            border-bottom: transparent;
            border-color: rgba(156,163,175,0.3);
            li:first-child{margin: 0;}
        }
    }
</style>