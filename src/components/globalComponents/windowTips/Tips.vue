<template>
    <transition name="tips-message-fade" @after-leave="handleAfterLeave" appear>
        <div class="windowTips" :class="[ `windowTips-${type}` ]" v-show="isShow">
            {{ content }}
        </div>
    </transition>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
export default {
    props: {
        type: {
            type: String,
            defalut: 'info',
            validator(val) {
                return ['success', 'warning', 'info', 'error'].includes(val)
            }
        },
        duration: Number,
        content:String
    },
    setup(props,{ emit }) {
        const instance = getCurrentInstance()
        const isShow = ref(true)
        let timer
        function delayClose() {
            if (props.duration > 0) {
                timer = setTimeout(() => {
                _close()
                }, props.duration)
            }
        }
        function _close() {
            clearTimeout(timer)
            emit('close', instance)
            isShow.value = false
        }
        function handleAfterLeave() {
            instance.vnode.el.parentElement?.removeChild(instance.vnode.el)
        }
        delayClose()
        return {
            isShow,

            //methods
            handleAfterLeave
        }
    }
}
</script>


<style scoped lang="less">
    .windowTips{
        width: 100vw;height: 40px;top: 0;left:0;position: fixed;z-index: 9999999;background: red;text-align: center;line-height: 40px;
        font-size: 14px;color: #fff;transition: opacity 0.5s; overflow: hidden;
    }
    .windowTips-info{background: rgb(64, 158, 255);}
    .windowTips-success{background: #529b2e;}
    .windowTips-warning{background: #e6a23c;}
    .windowTips-error{background: #f56c6c;}
    .tips-message-fade-enter-from,
    .tips-message-fade-leave-to { opacity: 0; }
</style>