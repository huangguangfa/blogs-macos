<template>
    <div class="global-search fixed left-0 top-0">
        <div class="search-tag absolute ov-hide" v-clickoutside="cancelGlobalSearch">
            <div class="search-tga-input flex align-items-center">
                <div class="iconfont macos-sousuo"></div>
                <input class="search-input" placeholder="Spotlight Search" type="text">
            </div>
            <div class="search-cpntent">
                search-cpntent
            </div>
        </div>
    </div>
</template>

<script>
    import store from "@/store/index";
    export default {
        setup(){
            return {

            }
        },
        methods:{
            cancelGlobalSearch(){
                store.commit('SET_STARTGLOBALSEARCH',false)
            }
        }
    }
</script>

<style lang="less">
    .global-search{ width: 100vw;height: 100vh;
        .search-tag{width:660px;box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);backdrop-filter: blur(40px);background: #fff;border: 1px solid rgba(156,163,175,0.5);left: 50%;top: 10%;transform: translate(-50%);border-radius: .375rem;
            .search-tga-input{width: 100%;height: 59px;padding: 0 10px; box-sizing:border-box;
                .macos-sousuo{width: 60px;height: 100%;display: flex;align-items: center;justify-content: center;color: rgb(75,85,99);font-size: 30px;}
                .search-input{width: 100%;height: 100%;border: none;padding: 0;line-height:0;box-sizing: border-box;
                    &:focus{border: none;outline:none;}
                    &::placeholder {
                        opacity: .4; color: rgba(0,0,0,1);font-size: 28px;
                        position: relative;
                        top:5px;
                    }
                }
            }
            .search-cpntent{width: 100%;height: 400px;margin-top: 1px;border-top: 1px solid rgba(0,0,0,0.1);

            }
        }
    }
</style>