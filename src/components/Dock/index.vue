<template>
    <div class="tabbars mx-auto fixed bottom-0 right-0 left-0 ">
        <ul 
            class="tabbars-u justify-between justify-center flex-row flex rounded-none border-gray-400 bg-opacity-20 bg-white blur"
            @mousemove="tabbarMove" @mouseout="tabbarMouseout">
            <li 
                class="tabbar-item duration-150 ease-in flex align-items-center justify-flex-end flex-column relative"
                v-for="(item,index) in TABABR_NAVIGATIONS"  
                :key="index">
                <p class="tabbar-title absolute d-none">{{ item.title }}</p>
                <img @click="openWindows(index)" class="tabbar-img"  :style="dockStyle(index)"  :data-index="index" :src="item.img">
            </li>
        </ul>
        
        <app-facetime v-model:show="TABABR_NAVIGATIONS[3].desktop"></app-facetime>
        <app-safari v-model:show="TABABR_NAVIGATIONS[5].desktop"></app-safari>
        <app-vscode v-model:show="TABABR_NAVIGATIONS[7].desktop"></app-vscode>
    </div>
</template>

<script>
    import { TABABR_NAVIGATION } from "@/config/dock.config.js";
    import { reactive, computed } from "vue";
    import safari from "@/components/apps/safari.vue";
    import vscode from "@/components/apps/vscode.vue";
    import facetime from "@/components/apps/facetime/index.vue";
    export default{
        components:{
            appSafari:safari,
            appVscode:vscode,
            appFacetime:facetime
        },
        setup(){
            const TABABR_NAVIGATIONS = reactive(TABABR_NAVIGATION);
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
            border-top-right-radius: 0.5rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            box-sizing: border-box;
            border: 1px solid #e5e7eb;
            border-bottom: transparent;
            border-color: rgba(156,163,175,0.3);
            display: flex;
            .tabbar-item{ 
                padding-bottom: 10px; 
                will-change: width height; user-select: none;
                &:hover .tabbar-title{display: block;}
                .tabbar-title{ color: black; background-color: rgba(209,213,219,0.8);  padding:5px 10px; border-radius: .375rem; top: -80px;}
                .tabbar-img{ transition-timing-function: cubic-bezier(0.4, 0, 1, 1); transform-origin: bottom; transition-duration: .15s;  will-change: width height;-webkit-user-drag: none; padding: 0 3px; }
            }
        }
    }
</style>