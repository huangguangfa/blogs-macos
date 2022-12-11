<template>
  <div class="blogs">
    <window
      v-model:show="appInfo.desktop"
      title="openAiChat"
      width="1000"
      height="600"
      :appInfo="appInfo"
    >
      <div class="open-ai-chat-content wh100" v-if="appInfo.desktop">
        <ul>
          <!-- 左 -->
          <li class="chat-item left" v-for="item in 100">
            <div class="avatar">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt=""
              />
            </div>
            <div class="messages">
              <div class="message-inner">我是测试消息内容</div>
            </div>
          </li>
          <!-- 右 -->
          <li class="chat-item right">
            <div class="messages">
              <div class="message-inner">我是测试消息内容</div>
            </div>
          </li>
        </ul>
      </div>
    </window>
  </div>
</template>

<script setup>
const props = defineProps({
  appInfo: Object,
});
</script>

<style lang="less" scoped>
.open-ai-chat-content {
  background: #111;
  height: 100%;
  width: 100%;
  padding: 50px 50px;
  box-sizing: border-box;
  overflow: auto;
  .chat-item {
    display: flex;
    align-items: center;
    margin: 5px 0;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .messages {
      margin-left: 10px;
      .message-inner {
        padding: 10px;
        line-height: 1.5;
        font-size: 12px;
        border-radius: 10px 10px 10px 0px;
      }
    }
  }
  .left {
    .messages {
      .message-inner {
        background-color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  .right {
    justify-content: flex-end;
    margin-top: 8px;

    .messages {
      letter-spacing: 0.5px;
      color: white;
      .message-inner {
        background-attachment: fixed;
        border-radius: 10px 10px 0 10px;
        background-color: #7c1cb4;
      }
    }
    .avatar {
      border-radius: 100%;
      background: #fff;
      color: red;
    }
  }
}
</style>
