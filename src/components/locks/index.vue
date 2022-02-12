<template>
    <div class="facetime-content-right-userInfo">
        <div class="userInfo">
            <img class="userInfo_img" draggable="false" src="@/assets/images/facetime/login.png" alt="">
            <div class="input-userInfo">
                <div class="reset-name" @click="resetName" v-if="configInfo.isShowReset">
                    <i class="iconfont macos-zhongzhi"></i>
                    <span>换一个</span>
                </div>
                <div class="inputs">
                    <div class="title">{{ configInfo.userLabel }}：</div>
                    <div class="inputs-content">
                        <input v-model="user.uName" type="text">
                        <label :alt="`请输入${configInfo.userLabel}`" :placeholder="`请输入${configInfo.userLabel}`"></label>
                    </div>
                </div>
                <div class="inputs">
                    <div class="title">{{ configInfo.phoneLabel }}：</div>
                    <div class="inputs-content">
                        <input v-model="user.uId" type="text" @keyup.enter="submit">
                        <label :alt="`请输入${configInfo.phoneLabel}`" :placeholder="`请输入${configInfo.phoneLabel}`"></label>
                    </div>
                </div>
                <div class="submit" @click="submit"> {{ configInfo.submitText }} </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { getRandomMoble, getRandomName, getRandomuAvatar } from "@/utils/utils.js"
    import { reactive } from 'vue';
    import { propsOptions } from "./props"
    const props = defineProps(propsOptions);
    const emit = defineEmits(["submit", "getUserInfo"]);
    const { isInit, isShowReset, submitText, userLabel, phoneLabel } = props;
    let user = reactive({ uId: null, uName:null, uAvatar:null });
    const configInfo = {
        submitText,
        isShowReset,
        isInit,
        userLabel,
        phoneLabel
    }
    isInit && resetName()
    function resetName(){
        user.uId = getRandomMoble();
        user.uName = getRandomName();
        user.uAvatar = getRandomuAvatar();
        emit('getUserInfo',user)
    }
    function submit(){
        emit('submit',true, user)
    }
</script>

<style lang="less" scoped>
    .facetime-content-right-userInfo{position: absolute;width: 100%;height: 100%;left: 0;top: 0;background: #fff;z-index: 100;
        .userInfo{ width: 100%;height: 100%;display: flex;align-items: center;
            img{height: 450px;width: auto;filter: grayscale(30%);}
            .input-userInfo{position: relative;cursor: pointer;
                .reset-name{position: absolute;right: 30px;top: -10px;font-size: 12px;display:flex;align-items:center;color:#898989;
                    i{font-size: 15px;margin-right:3px;}
                }
                .inputs{width: 100%;display: flex;align-items: center;margin: 20px 0;
                    .title{font-size: 12px;width: 60px;flex-shrink: 0;}
                    .inputs-content{height: 40px;position: relative;
                        input{ box-sizing: border-box;  width: 260px;  height:100%; border: 1px solid #cccccc; border-radius: 6px; background: #fff; resize: none; outline: none;text-indent: 20px;
                            color: #898989;
                            &:focus {  border-color: #5bc24f; color: #5bc24f;}
                            &:focus + label[placeholder]:before{color: #5bc24f;}
                            &:focus + .title{color: #5bc24f;}
                            &:focus + label[placeholder]:before, &:valid + label[placeholder]:before {  transition-duration: .2s; transform: translate(0, -20px) scale(0.9, 0.9); }
                            //&:invalid + label[placeholder][alt]:before{content: attr(alt);}
                            &:label[placeholder]{ display: block;  pointer-events: none;  line-height: 40px;}
                            & + label[placeholder]:before {
                                content: attr(placeholder); display: inline-block; color: #898989; white-space: nowrap;
                                transition: 0.3s ease-in-out;  background-image: linear-gradient(to bottom, #ffffff, #ffffff);
                                background-size: 100% 5px; background-repeat: no-repeat; background-position: center;
                            }
                        }
                        label{ position: absolute;left: 20px;top: 50%;transform:translate(0,-50%);font-size: 12px;text-align: left;width: 0;}
                    }
                }
                .submit{ border: 1px solid #5bc24f;padding: 0 50px;display: inline-block;line-height: 35px;border-radius: 10px;font-size: 12px;background: #5bc24f;
                    color:#fff;margin:0 100px;
                }
            }
        }
    }
</style>