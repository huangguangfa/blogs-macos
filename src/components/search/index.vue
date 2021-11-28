<template>
    <div class="global-search fixed left-0 top-0">
        <div class="search-tag absolute ov-hide" v-clickoutside="cancelGlobalSearch">
            <div class="search-tga-input flex align-items-center">
                <div class="iconfont macos-sousuo"></div>
                <input class="search-input" placeholder="Spotlight Search" @input="getInputValue" type="text">
            </div>
            <div class="search-content">
                <div class="search-item" 
                    v-for="apps in activeApps" 
                    @click="openApps(apps)"
                    :key="apps.id">
                    <img :src="apps.img" alt="">
                    <span>{{ apps.id }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { SET_START_GLOBAL_SEARCH, SET_TABABR_NAVIGATION, SET_WINDOW_ID  } from "@/config/store.config";
    import { useStore } from 'vuex';
    import { ref } from 'vue';

    export default {
        setup(){
            const store = useStore();
            const TABABR_NAVIGATIONS = store.getters.TABABR_NAVIGATION;
            const activeApps = ref(TABABR_NAVIGATIONS);
            // methods
            function getInputValue(e){
                const v = e.target.value;
                const value = TABABR_NAVIGATIONS.filter( i => i.id !== 'Trash' && i.id.toLowerCase().includes(v) );
                activeApps.value = value;
            }
            function cancelGlobalSearch(){
                store.commit(SET_START_GLOBAL_SEARCH,false);
            }
            function openApps(apps){
                const appsIndex = TABABR_NAVIGATIONS.findIndex( app => app.id === apps.id);
                store.commit(SET_TABABR_NAVIGATION, { _index:appsIndex, dockData:{ desktop:true, isMinimize:false } });
                store.commit(SET_WINDOW_ID,apps.id);
                cancelGlobalSearch();
            }
            return {
                activeApps,

                // methods
                getInputValue,
                cancelGlobalSearch,
                openApps
            }
        }
    }
</script>

<style lang="less">
    .global-search{ width: 100vw;height: 100vh;
        .search-tag{width:660px;box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);backdrop-filter: blur(40px);background-color: rgba(243, 244, 246, 0.8);border: 1px solid rgba(156,163,175,0.5);left: 50%;top: 10%;transform: translate(-50%);border-radius: .375rem;
            .search-tga-input{width: 100%;height: 59px;padding: 0 10px; box-sizing:border-box;
                .macos-sousuo{width: 60px;height: 100%;display: flex;align-items: center;justify-content: center;color: rgb(75,85,99);font-size: 30px;}
                .search-input{width: 100%;height: 100%;border: none;padding: 0;line-height:0;box-sizing: border-box;background: none;
                    &:focus{border: none;outline:none;}
                    &::placeholder {
                        opacity: .4; color: rgba(0,0,0,1);font-size: 28px;
                        position: relative;
                        top:5px;
                    }
                }
            }
            .search-content{width: 100%;max-height: 400px;overflow-y: auto; overflow-x:hidden ; margin-top: 1px;border-top: 1px solid rgba(0,0,0,0.1);padding:10px 20px; box-sizing: border-box;
                .search-item{
                    display: flex;align-items: center;margin-top:10px;cursor: pointer;
                    img{width: 30px;height: 30px;margin-right: 10px;}
                }
            }
        }
    }
</style>