<template>
    <div class="active-user-content">
        <div class="active-user" v-if="activeUserList.length">
            <div class="user" v-for="item in activeUserList" :key="item.uid">
                <div class="flex align-items-center">
                    <img class="icon user-avatar " :src="item.uAvatar" alt="">
                    <div class="user_info" >
                        <p class="user-phone">{{ item.uId }}</p>
                        <p class="user-name">{{ item.uName }} </p>
                    </div>
                </div>
                <div v-if="!item._is_me" class="call_user">
                    <i v-if="item.isStartCamera" class="iconfont macos-shipindianhua" @click="callUser(item, 'callUser')"></i>
                    <i class="iconfont macos-liaotian" @click="callUser(item, 'chat')"></i>
                </div>
            </div>
        </div>
        <div class="no-data" v-else>
            <vm-empty text="暂无用户"></vm-empty>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        activeUserList:Array
    })
    const emit = defineEmits(['callUser'])
    function callUser(userInfo, type){
        emit(type,userInfo)
    }
</script>

<style lang="less">
    .active-user-content{
        .active-user{width: 100%;
            .user{display: flex;align-items: center; justify-content: space-between; position: relative;padding-bottom:10px;margin-top:10px;
                &::after{ content:"";position: absolute;bottom: 0;left: 45px; width: 100%;height: 1px;background: rgba(204,204,204,0.4); }
                .user-avatar{width:30px;height: 30px;margin-right: 10px;}
                .user_info{font-size: 14px;
                    .user-phone{font-weight: bold;}
                    .user-name{ font-size: 12px;margin-top: 4px; }
                }
                .call_user{
                    display: flex; flex-wrap: wrap;width:30px; justify-content:center;
                    .macos-shipindianhua{font-size:20px;color:#5bc24f;}
                    .macos-liaotian{font-size:13px;color:#5bc24f;margin-top: 4px;}

                }
            }
            .is-me{ filter: grayscale(100%);}
        }
    }
</style>
