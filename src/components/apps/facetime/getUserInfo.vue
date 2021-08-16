<template>
    <div class="facetime-content-right-userInfo">
        <div class="userInfo">
            <img class="userInfo_img" draggable="false" src="../../../assets/images/facetime/login.png" alt="">
            <div class="input-userInfo">
                <div class="reset-name" @click="resetName">
                    <i class="iconfont macos-zhongzhi"></i>
                    <span>换一个</span>
                </div>
                <div class="inputs">
                    <span class="title">姓名：</span>
                    <div class="inputs-content">
                        <input v-model="user.uname" type="text">
                        <label alt="请输入名称" placeholder="请输入名称"></label>
                    </div>
                </div>
                <div class="inputs">
                    <span class="title">手机：</span>
                    <div class="inputs-content">
                        <input v-model="user.uid" type="text">
                        <label alt="请输入手机号" placeholder="请输入手机号"></label>
                    </div>
                </div>
                <div class="submit" @click="submit">  提交 </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getRandomMoble, getRandomName } from "@/utils/utils.js"
    import { reactive } from 'vue';
    export default{
        setup(props, { emit }){
            let user = reactive({ uid: null,  uname:null });
            resetName()
            function resetName(){
                user.uid = getRandomMoble();
                user.uname = getRandomName();
                emit('getUserInfo',user)
            }
            function submit(){
                emit('webrtcStarter',true)
            }
            return {
                resetName,
                submit,
                user
            }
        }
    }
</script>


<style lang="less">
    .facetime-content-right-userInfo{position: absolute;width: 100%;height: 100%;left: 0;top: 0;background: #fff;z-index: 100;
        .userInfo{ width: 100%;height: 450px;display: flex;align-items: center;
            img{height: 450px;width: auto;filter: grayscale(30%);}
            .input-userInfo{position: relative;cursor: pointer;
                .reset-name{position: absolute;right: 30px;top: -10px;font-size: 12px;display:flex;align-items:center;color:#898989;
                    i{font-size: 15px;margin-right:3px;}
                }
                .inputs{width: 100%;display: flex;align-items: center;margin: 20px 0;
                    .title{font-size: 12px;display: block;width: 40px;}
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
                        label{ position: absolute;left: 20px;top: 50%;transform:translate(0,-50%);font-size: 12px;text-align: left;}
                    }
                }
                .submit{ border: 1px solid #5bc24f;padding: 0 50px;display: inline-block;line-height: 35px;border-radius: 10px;font-size: 12px;background: #5bc24f;
                    color:#fff;margin:0 100px;
                }
            }
        }
    }
</style>