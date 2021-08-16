<template>
    <div class="chatroom">
        <div class="chatroom-area">

        </div>
        <div class="input-area">
            <div class="input-area-content">
                <div class="phiz">
                    <i class="iconfont macos-biaoqing"></i>
                    <i class="iconfont macos-wenjian"></i>
                </div>
                <div class="textareas"  contenteditable="true"> </div>
            </div>
            <div class="send-btn">
                <span>发送</span>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    .chatroom{
        min-width: 300px;height: 100%;position: relative;display: flex;flex-wrap: wrap;border-left: 1px solid rgba(204, 204, 204, 0.4);;
        .chatroom-area{
            width: 100%;height: 70%;
        }
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