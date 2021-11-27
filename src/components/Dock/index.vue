<template>
    <div class="tabbars mx-auto fixed bottom-0 right-0 left-0 ">
        <vm-topbar></vm-topbar>
        <div class="flex dock">
            <ul class="tabbars-u justify-between justify-center flex-row flex rounded-none border-gray-400 bg-opacity-20 bg-white blur"
                @mousemove="tabbarMove" @mouseout="tabbarMouseout">
                <li 
                    class="tabbar-item duration-150 ease-in flex align-items-center justify-flex-end flex-column relative"
                    :class="{
                        'trash':index === TABABR_NAVIGATIONS.length - 1
                    }"
                    v-for="(item,index) in TABABR_NAVIGATIONS"  
                    :key="index">
                    <p class="tabbar-title absolute d-none">{{ item.title }}</p>
                    <div class="dock-items" :style="dockStyle(index)" @click="openWindows(index, item)">
                        <span class="minimizes-mark" v-if="item.isMinimize"></span>
                        <img class="tabbar-img" :src="item.img" :data-index="index">
                    </div>
                </li>
            </ul>

        </div>

        <div class="app-container">
            <component 
                v-for="apps in APPS_COMPONENT" 
                :key="apps.appsName" 
                :appInfo="dockItemsInfo(apps.appsDataIndex)"
                :is="apps.appsName">
            </component>
        </div>
    </div>
</template>

<script>
    import APPSCONFIG from "./apps-config"
    import { reactive, computed, getCurrentInstance } from "vue";
    import { SET_TABABR_NAVIGATION, SET_WINDOW_ID } from "@/config/store.config.js";
    import topbar from "@/components/topbar/index.vue";
    import { useStore } from 'vuex';
    export default{
        components:{
            ...APPSCONFIG.appsInject,
            vmTopbar:topbar
        },
        setup(){
            const { proxy } = getCurrentInstance();
            const store = useStore();
            const TABABR_NAVIGATIONS = computed( () => store.getters.TABABR_NAVIGATION);
            const TABABR_LIST_WIDTH = reactive(Array(store.getters.TABABR_NAVIGATION.length).fill(50));
            const APPS_COMPONENT = APPSCONFIG.appsComponent;
            const dockStyle = computed( () =>{
                return function(index){
                    return `width:${TABABR_LIST_WIDTH[index]}px;height:${TABABR_LIST_WIDTH[index]}px;`
                }
            })
            const dockItemsInfo = computed( () =>{
                return function(index){
                    return store.getters.TABABR_NAVIGATION[index];
                }
            })
            const TABABR_MINIMIZE = computed( () => store.getters.TABABR_MINIMIZE );

            // methods
            function tabbarMove(e){
                const { target } = e;
                let currentEleIndex = Number( target.getAttribute("data-index") );
                if( currentEleIndex === undefined ) return;
                TABABR_LIST_WIDTH[ currentEleIndex ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex] = 110 );
                //左
                TABABR_LIST_WIDTH[ currentEleIndex - 1 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex -1] = 80 );
                TABABR_LIST_WIDTH[ currentEleIndex - 2 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex -2] = 70 );
                //右
                TABABR_LIST_WIDTH[ currentEleIndex + 1 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex + 1] = 80 );
                TABABR_LIST_WIDTH[ currentEleIndex + 2 ] !== undefined && ( TABABR_LIST_WIDTH[currentEleIndex + 2] = 70 );
            }
            function tabbarMouseout(){
                TABABR_LIST_WIDTH.fill(50)
            }
            function openWindows(index, dock){
                store.commit(SET_TABABR_NAVIGATION, { _index:index, dockData:{ desktop:true, isMinimize:false } });
                store.commit(SET_WINDOW_ID,dock.id);
                if( [0,1,2,5,9].includes(index) ){
                    proxy.$message.error({
                        content:'正在开发中....😊'
                    })
                }
            }

            return {
                TABABR_NAVIGATIONS,
                TABABR_LIST_WIDTH,
                APPS_COMPONENT,
                TABABR_MINIMIZE,
                dockStyle,
                dockItemsInfo,

                // methods
                tabbarMove,
                tabbarMouseout,
                openWindows
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
        width: 100vw;
        height: 100vh;
        .dock{
            position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);z-index:99999;
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
            }
            .tabbar-item{ 
                padding-bottom: 10px; 
                will-change: width height; user-select: none;position: relative;
                &:hover .tabbar-title{display: block;}
                .tabbar-title{ color: black; background-color: rgba(209,213,219,0.8);  padding:5px 10px; border-radius: .375rem; top: -80px;}
                .dock-items{
                    transition-timing-function: cubic-bezier(0.4, 0, 1, 1); transform-origin: bottom; 
                    transition-duration: .15s;  will-change: width height;
                    -webkit-user-drag: none; padding: 0 3px; 
                    position: relative;
                    .tabbar-img{ 
                        width: 100%;height: 100%;
                    }
                    .minimizes-mark{
                        width: 10px;height: 10px;border-radius: 100%;background: red; position: absolute; top: 2px;right: 5px;
                    }
                }
            }
            .trash{
                position: relative;padding-left: 20px;
                &::after{
                    content:"";
                    width: 2px;
                    height: 50px;
                    background: rgba(156,163,175,0.2);
                    position: absolute;
                    top: 7px;left: 10px;
                    border-radius: 10px;
                }
            }
        }
    }
</style>