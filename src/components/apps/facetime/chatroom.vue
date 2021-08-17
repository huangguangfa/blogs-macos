<template>
    <div class="chatroom">
        <div class="chatroom-area">
            <div class="chatroom-area-list">
                <div class="user-common" :class="{ 'justify-flex-end':row.type === 'right' }" v-for="( row, index ) in MessageList" :key="index">
                    <img v-if="row.type === 'left'" class="user-avatar" src="https://www.huangguangfa.cn/static/media/user.f7e06438.png" alt="">
                    <div class="content" :class="row.type === 'left' ? 'left-mark' : 'right-mark' "> {{ row.mes_content }} </div>
                    <img v-if="row.type === 'right'" class="user-avatar" src="https://www.huangguangfa.cn/static/media/user.f7e06438.png" alt="">
                </div>
            </div>
        </div>
        <div class="input-area">
            <div class="input-area-content">
                <div class="phiz">
                    <i v-for="(item) in options_config.icon_list" class="iconfont" :class="item.name"></i>
                </div>
                <div class="textareas" @input="changeText" id="textareas" contenteditable="true"></div>
            </div>
            <div class="send-btn">
                <span @click="sendMes">发送</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { watch, reactive, ref } from "vue";
    export default {
        props:{
            MessageList:Array
        },
        setup(props, { emit } ){
            let mes_text = ref(null)
            let options_config = reactive({
                icon_list:[
                    {name:'macos-biaoqing'},
                    {name:'macos-wenjian'}
                ]
            })
            function sendMes(){
                if( !mes_text.value ) return;
                let mes_data = {
                    type:'right',
                    mes_content:mes_text.value,
                    isHaveRead:true
                }
                emit('newMessage',mes_data);
                mes_text.value = null;
                document.getElementById("textareas").innerText = "";
            }
            function changeText(val){
                mes_text.value = val.target.innerText;
            }

            return {
                options_config,
                mes_text,

                sendMes,
                changeText,
            }
        }
    }
</script>

<style lang="less">
    .chatroom{
        min-width: 300px;height: 100%;position: relative;display: flex;flex-wrap: wrap;border-left: 1px solid rgba(204, 204, 204, 0.4);max-width: 320px;
        .chatroom-area{
            width: 100%;height: 70%;background: rgb(245,245,245);box-sizing:border-box;padding: 0 20px;overflow-x: auto;
            .chatroom-area-list{
                .user-common{
                    display: flex;margin: 15px 0;
                    .user-avatar{width: 35px;height: 35px;border-radius: 3px;padding-top: 2px;}
                    .content{padding: 10px;box-sizing:border-box; font-size: 12px;border-radius: 3px;line-height: 15px;}
                    .left-mark{ margin-left: 15px; background: #fff;border: 1px solid #eee;position: relative;
                        &:hover{background: rgb(246,246,246);cursor:text;}
                        &:after{content:"";width: 0px;height: 0px;border: 7px solid transparent;
                            border-bottom-color: #eee;transform:rotate(-90deg) ;display: block; position: absolute;left: -14px;top: 12px; }
                        &:before{ content:"";width: 0px;height: 0px;
                            border: 5px solid transparent; z-index: 2; border-bottom-color: #fff;transform:rotate(-90deg) ;display: block; position: absolute;left: -10px;top: 12px; }
                        &:hover::before{border-bottom-color: rgb(246,246,246);}
                    }
                    .right-mark{
                        margin-right: 15px; background: rgb(158,234,106);border: 1px solid #eee;position: relative;
                        &:hover{background: rgb(152,225,101);cursor:text;}
                        &:after{content:"";width: 0px;height: 0px;border: 7px solid transparent;
                            border-bottom-color: rgb(158,234,106);;transform:rotate(90deg) ;display: block; position: absolute;right: -14px;top: 12px; }
                        &:before{ content:"";width: 0px;height: 0px;
                            border: 5px solid transparent; z-index: 2; border-bottom-color: rgb(158,234,106);;transform:rotate(90deg) ;display: block; position: absolute;right: -10px;top: 12px; }
                        &:hover::before{border-bottom-color:rgb(152,225,101)}
                    }
                }
            }
        }
        .chatroom-area::-webkit-scrollbar { width : 5px;  height: 1px;  position: absolute;right: 10px;}
        .chatroom-area::-webkit-scrollbar-thumb { border-radius:10px; background-color: rgba(204,204,204,0.5);}
        .chatroom-area::-webkit-scrollbar-track { background: none;border-radius: 10px; }
        .input-area{width: 100%;height: 30%;border-top: 1px solid rgba(204, 204, 204, 0.4); display: flex;padding-bottom: 30px;box-sizing:border-box;
            .input-area-content{display: flex;flex-wrap: wrap;align-content: flex-start;flex-direction: column;width: 100%;
                .phiz{height: 35px;width: 100%;display: flex;align-items: center;padding: 0 5px;color: #898989;font-size: 20px;
                    .iconfont{font-size: 20px;margin: 0 5px; cursor: pointer;}
                }
                .textareas{width: 236px;flex: 1;overflow-y:auto;outline: none;color: #898989;padding-top: 5px;font-size: 12px;padding-left: 10px;box-sizing:border-box; word-break: break-all;line-height: 17px;
                    &::-webkit-scrollbar{ display:none;}
                }
            }
            .send-btn{display: flex;justify-content: flex-end;flex: 0 0 auto;
                span{font-size: 12px;color: #fff;background:rgba(91, 194, 79,0.7);padding: 10px 20px; border-radius: 2px;line-height: 64px;cursor:pointer;}
                span:active {  position:relative; top:2px; }
            }
        }
    }
</style>