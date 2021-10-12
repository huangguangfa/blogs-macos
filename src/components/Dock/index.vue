<template>
    <div class="tabbars mx-auto fixed bottom-0 right-0 left-0 ">
        <div class="flex">
            <ul class="tabbars-u justify-between justify-center flex-row flex rounded-none border-gray-400 bg-opacity-20 bg-white blur"
                @mousemove="tabbarMove" @mouseout="tabbarMouseout">
                <li 
                    class="tabbar-item duration-150 ease-in flex align-items-center justify-flex-end flex-column relative"
                    v-for="(item,index) in TABABR_NAVIGATIONS"  
                    :key="index">
                    <p class="tabbar-title absolute d-none">{{ item.title }}</p>
                    <img @click="openWindows(index)" class="tabbar-img"  :style="dockStyle(index)"  :data-index="index" :src="item.img">
                </li>
            </ul>
            <ul class="minimize justify-between justify-center flex-row flex rounded-none border-gray-400 bg-opacity-20 bg-white">
                <li class="tabbar-item duration-150 ease-in flex align-items-center justify-flex-end flex-column relative" 
                    v-for="(item,index) in TABABR_MINIMIZE" :key="index">
                    <p class="tabbar-title absolute d-none">{{ item.title }}</p>
                    <img class="tabbar-img" :src="item.img">
                </li>
            </ul>
        </div>
        
        <app-facetime v-model:show="TABABR_NAVIGATIONS[3].desktop"></app-facetime>
        <app-mpas v-model:show="TABABR_NAVIGATIONS[4].desktop"></app-mpas>
        <app-safari v-model:show="TABABR_NAVIGATIONS[6].desktop"></app-safari>
        <app-termial v-model:show="TABABR_NAVIGATIONS[7].desktop"></app-termial>
        <app-vscode v-model:show="TABABR_NAVIGATIONS[8].desktop"></app-vscode>
    </div>
</template>

<script>
    import { reactive, computed } from "vue";
    import safari from "@/components/apps/safari/index.vue";
    import vscode from "@/components/apps/vscode/index.vue";
    import facetime from "@/components/apps/facetime/index.vue";
    import termial from "@/components/apps/Terminal/index.vue";
    import maps from "@/components/apps/maps/index.vue";
    import { useStore } from 'vuex'
    export default{
        components:{
            appSafari:safari,
            appVscode:vscode,
            appFacetime:facetime,
            appTermial:termial,
            appMpas:maps
        },
        setup(){
            const store = useStore();
            const TABABR_NAVIGATIONS = reactive(store.getters.TABABR_NAVIGATION);
            const TABABR_MINIMIZE = reactive(store.getters.TABABR_MINIMIZE)
            const TABABR_LIST_WIDTH = reactive(Array(TABABR_NAVIGATIONS.length).fill(50));
            const dockStyle = computed( () =>{
                return function(index){
                    return `width:${TABABR_LIST_WIDTH[index]}px;height:${TABABR_LIST_WIDTH[index]}px;`
                }
            })
            return {
                TABABR_NAVIGATIONS,
                TABABR_LIST_WIDTH,
                dockStyle,
                TABABR_MINIMIZE
                
            }
        },
        methods:{
            tabbarMove(e){
                const { target } = e;
                let currentEleIndex = Number( target.getAttribute("data-index") );
                if( currentEleIndex === undefined ) return;
                let TABABR_LIST_WIDTH = this.TABABR_LIST_WIDTH;
                TABABR_LIST_WIDTH[ currentEleIndex ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex] = 110 );
                //左
                TABABR_LIST_WIDTH[ currentEleIndex - 1 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex -1] = 80 );
                TABABR_LIST_WIDTH[ currentEleIndex - 2 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex -2] = 70 );
                //右
                TABABR_LIST_WIDTH[ currentEleIndex + 1 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex + 1] = 80 );
                TABABR_LIST_WIDTH[ currentEleIndex + 2 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex + 2] = 70 );
            },
            tabbarMouseout(){
                this.TABABR_LIST_WIDTH.fill(50)
            },
            openWindows(index){
                this.TABABR_NAVIGATIONS[index].desktop = true;
                if( [0,1,2,5].includes(index) ){
                    this.$message.error({
                        content:'正在开发中....😊'
                    })
                }
            }
        }
    }
</script>

<style lang="less">
    .tabbars{
        width:-webkit-min-content;
        width: max-content;
        position: fixed;
        z-index: 99999;
        .tabbars-u{
            height: 65px;
            box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.17);
            border-top-left-radius: 0.5rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            box-sizing: border-box;
            border: 1px solid #e5e7eb;
            border-bottom: transparent;
            border-right: none;
            border-color: rgba(156,163,175,0.3);
            display: flex;
        }
        .tabbar-item{ 
            padding-bottom: 10px; 
            will-change: width height; user-select: none;
            &:hover .tabbar-title{display: block;}
            .tabbar-title{ color: black; background-color: rgba(209,213,219,0.8);  padding:5px 10px; border-radius: .375rem; top: -80px;}
            .tabbar-img{ transition-timing-function: cubic-bezier(0.4, 0, 1, 1); transform-origin: bottom; transition-duration: .15s;  will-change: width height;-webkit-user-drag: none; padding: 0 3px; }
        }
        .minimize{
            min-width: 70px;
            height: 65px;
            border-top-right-radius: 0.5rem;
            border: 1px solid #e5e7eb;
            border-color: rgba(156, 163, 175, 0.3);
            border-left: none;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            border-bottom: transparent;
            backdrop-filter: blur(0px);
            position: relative;
            img{width: 50px;height: 50px;}
            &::after{
                content:"";
                width: 2px;
                height: 50px;
                background: rgba(156,163,175,0.2);
                position: absolute;
                top: 7px;left: 10px;
                border-radius: 10px;
            }
            .tabbar-item{
                .tabbar-title{
                    top: -40px;
                }
            }
        }
    }
</style>