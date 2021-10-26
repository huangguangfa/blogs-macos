<template>
    <div class="active-user-content">
        <div class="active-user" v-if="activeUserList.length">
            <div class="user" v-for="item in activeUserList" :key="item.uid">
                <div class="flex align-items-center">
                    <img class="icon user-avatar " :src="item.uavatar" alt="">
                    <div class="user_info" >
                        <p class="user-phone">{{ item.uid }}</p>
                        <p class="user-name">{{ item.uname }} </p>
                    </div>
                </div>
                <i v-if="!item._is_me" class="iconfont macos-shipindianhua" @click="callUser(item)"></i>
            </div>
        </div>
        <div class="no-data" v-else>
            <vm-empty text="暂无用户"></vm-empty>
        </div>
    </div>
</template>

<script>
    export default{
        props:{
            activeUserList:Array
        },
        setup(props,{ emit }){
            function callUser(userInfo){
                emit('callUser',userInfo)
            }

            return {
                callUser
            }
        }
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
                .macos-shipindianhua{font-size:30px;color:#5bc24f;}
            }
            .is-me{ filter: grayscale(100%);}
        }
    }
</style>
