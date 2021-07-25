<template>
    <div class="tabbars mx-auto fixed bottom-0 right-0 left-0 ">
        <ul 
            class="tabbars-u justify-between justify-center flex-row flex rounded-none border-gray-400 bg-opacity-20 bg-white blur"
            @mousemove="tabbarMove" @mouseout="tabbarMouseout">
            <tabbarItem 
                :data-index="index"
                v-for="(item,index) in TABABR_NAVIGATIONS" 
                :title="item.title"
                :key-index="index"
                :img="item.img"
                :TABABRLISTWIDTH="TABABR_LIST_WIDTH"
                :key="index">
            </tabbarItem>
        </ul>
    </div>
</template>

<script>
    import tabbarItem from "./tabbar-item.vue";
    import { TABABR_NAVIGATION } from "@/config/tabbar.config";
    import { reactive } from "vue"
    export default{
        components:{
            tabbarItem
        },
        setup(){
            const TABABR_NAVIGATIONS = reactive(TABABR_NAVIGATION);
            const TABABR_LIST_WIDTH = reactive(Array(TABABR_NAVIGATIONS.length).fill(50));

            return {
                TABABR_NAVIGATIONS,
                TABABR_LIST_WIDTH
            }
        },
        methods:{
            tabbarMove(e){
                const { target } = e;
                let currentEleIndex = target.getAttribute("data-index");
                if( !currentEleIndex ) return;
                currentEleIndex = Number(currentEleIndex);
                let TABABR_LIST_WIDTH = this.TABABR_LIST_WIDTH;
                TABABR_LIST_WIDTH[ currentEleIndex ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex] = 100 );
                //左
                TABABR_LIST_WIDTH[ currentEleIndex - 1 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex -1] = 70 );
                TABABR_LIST_WIDTH[ currentEleIndex - 2 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex -2] = 60 );
                //右
                TABABR_LIST_WIDTH[ currentEleIndex + 1 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex + 1] = 70 );
                TABABR_LIST_WIDTH[ currentEleIndex + 2 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex + 2] = 60 );
            },
            tabbarMouseout(){
                this.TABABR_LIST_WIDTH.fill(50)
            }
        }
    }
</script>

<style lang="less">
    .tabbars{
        z-index: 99999;
        width:-webkit-min-content;
        width: max-content;
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
            display: flex; 
            // align-items: center;
            li:first-child{padding-left: 0;}
        }
    }
</style>