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
        <div class="open-ai-chat-content__wrap">
          <ul>
            <div v-for="(item, index) in state.resultList" :key="index">
              <!-- 左 -->
              <li class="chat-item left" v-if="item.name !== 'me'">
                <div class="avatar">
                  <img
                    src="https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/tabbar-navigation/openai.png"
                  />
                </div>
                <div class="messages">
                  <div class="message-inner">{{ item.content }}</div>
                </div>
              </li>
              <!-- 右 -->
              <li class="chat-item right" v-else>
                <div class="messages">
                  <div class="message-inner">{{ item.content }}</div>
                </div>
              </li>
            </div>
          </ul>
        </div>

        <div class="open-ai-input">
          <!-- <div class="loading">
            <div class="loading__content"></div>
          </div> -->
          <input
            tabindex="0"
            rows="1"
            v-model="state.search"
            class="open-ai__textarea"
            @keyup.enter.native="submit"
            style="overflow-y: hidden"
          />
          <button class="submit" @click="submit">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 20 20"
              class="w-4 h-4 rotate-90"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </window>
  </div>
</template>

<script setup>
import { getOpenAiRes } from "@/services/api/open-ai";
import { reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
  appInfo: Object,
});

const state = reactive({
  search: "",
  resultList: [],
  loading: false,
});

const submit = async () => {
  if (state.loading || state.search === "") return;
  state.loading = true;
  try {
    const searchVal = state.search;
    state.search = "";
    state.resultList.push({
      name: "me",
      content: searchVal,
    });
    const res = await getOpenAiRes(searchVal);
    state.resultList.push({
      name: "openAi",
      content: res.result,
    });
    console.log(res);
  } catch (err) {
    proxy.$message.error({
      content: "200块的服务器超时了....",
    });
    console.log(err);
  } finally {
    state.loading = false;
  }
};
</script>

<style lang="less" scoped>
.open-ai-chat-content {
  background: #111;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  .open-ai-chat-content__wrap {
    height: 100%;
    width: 100%;
    padding: 10px;
    overflow: auto;
    box-sizing: border-box;
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
    }
  }

  .open-ai-input {
    width: 100%;
    position: absolute;
    bottom: 0px;
    left: 0;
    height: 50px;
    background-color: rgba(64, 65, 79, 1);
    display: flex;
    align-items: center;
    .open-ai__textarea {
      width: 100%;
      height: 100%;
      background-color: transparent;
      padding-right: 1.75rem;
      padding-left: 6px;
      resize: none;
      border-width: 0;
      font-size: 1rem;
      font-weight: inherit;
      color: inherit;
      font-family: inherit;
      line-height: 1.5rem;
      color: #fff;
      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }
    }
    .submit {
      background-color: transparent;
      background-image: none;
      text-indent: 0px;
      text-shadow: none;
      display: inline-block;
      text-align: center;
      border: 0;
      padding-right: 20px;
      display: flex;
      align-items: center;
      svg {
        transform: translate(0, 0) rotate(90deg) skewX(0) skewY(0) scaleX(1.2)
          scaleY(1);
        cursor: pointer;
        color: rgba(142, 142, 160, 1);
      }
    }
  }
}
</style>
