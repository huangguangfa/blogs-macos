<template>
  <div class="music">
    <window
      v-model:show="appInfo.desktop"
      :title="
        palyConfig.curPlay.name
          ? `正在播放-${palyConfig.curPlay.name}`
          : 'my Music'
      "
      width="1000"
      height="600"
      :appInfo="appInfo"
    >
      <div class="music-content">
        <div class="song-list">
          <div class="song-left">
            <div class="music-btn">
              <div class="music-btn_left">
                <span
                  :class="{ active: index === 0 }"
                  v-for="(item, index) in musicType"
                  :key="item.name"
                  >{{ item.name }}
                </span>
              </div>
              <div class="music-btn_right">
                <input
                  class="search_input"
                  placeholder="搜索输入歌名"
                  @input="getInputValue"
                  type="text"
                  list="search_list"
                />
                <datalist id="search_list">
                  <option
                    v-for="item in palyConfig.searchList"
                    :key="item.name"
                    :value="item.name"
                  >
                    <div @click="addPlay(item.name)">
                      {{ item.name }}
                    </div>
                  </option>
                </datalist>
              </div>
            </div>

            <div class="play-list music-list">
              <div class="music-list">
                <div class="list-item list-header">
                  <span class="list-name">歌曲</span>
                  <span class="list-artist">歌曲</span>
                  <span class="list-time">歌曲</span>
                </div>
                <div class="music-list-content">
                  <div
                    class="song-items"
                    :class="{ paly: item.name === palyConfig.curPlay.name }"
                    v-for="(item, index) in palyConfig.musicLists"
                    :key="item.url"
                    @click="addPlay(item.name)"
                  >
                    <span class="song-items-num">{{ index + 1 }}</span>
                    <span class="song-items-name">{{ item.name }}</span>
                    <span class="song-items-artist">{{ item.singer }}</span>
                    <span class="song-items-time"> {{ item.time }} </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="music-bar-btns">
              <audio
                id="audios"
                ref="audioDom"
                :src="palyConfig.curPlay.url"
                controls
              ></audio>
              <div class="right-round"></div>
            </div>
          </div>
        </div>
        <!-- 虚化背景 -->
        <div
          class="mmPlayer-bg"
          :style="`background-image: url(${palyConfig.playBg})`"
        ></div>
      </div>
    </window>
  </div>
</template>

<script setup>
import {
  nextTick,
  reactive,
  ref,
  watch,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import musicList from "../../../../file/music/index.json";
import { highlight } from "@/utils/utils";
const { proxy } = getCurrentInstance();

const props = defineProps({
  appInfo: Object,
});
const musicType = reactive([{ name: "正在播放" }, { name: "我的歌单" }]);
const palyConfig = reactive({
  musicLists: musicList,
  curPlay: {},
  curIndex: 0,
  playBg:
    "https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/ui/music-default-bg.jpeg",
  searchList: [],
});
const audioDom = ref(null);
onMounted(() => {
  // 音乐结束了
  audioDom.value.onended = function () {
    if (palyConfig.curIndex === palyConfig.musicLists.length - 1) {
      addPlay(palyConfig.musicLists[0].name);
    } else {
      const item = palyConfig.musicLists[palyConfig.curIndex + 1];
      addPlay(item.name);
    }
  };
});

// methods
function addPlay(name) {
  const index = musicList.findIndex((item) => item.name === name);
  const item = musicList[index];
  if (!item) return;
  palyConfig.curPlay = item;
  palyConfig.playBg = item.cover;
  palyConfig.curIndex = index;
  nextTick(() => {
    audioDom.value.play();
  });
}
watch(
  () => props.appInfo.desktop,
  (status) => {
    if (status === false && props.appInfo.isMinimize === false) {
      audioDom.value.pause();
    }
  }
);
function getInputValue(e) {
  const v = e.target.value;
  // select 选中
  if (!e.inputType) return addPlay(v);
  palyConfig.searchList = palyConfig.musicLists.map((item) => {
    return {
      ...item,
      _name: highlight(item.name, v),
    };
  });
}
function globalKeyup(e) {
  if (!props.appInfo.desktop) return false;
  const { code } = e;
  if (code === " ") {
    audioDom.value.paused ? audioDom.value.play() : audioDom.value.pause();
  }
}

proxy.$eventBus.$on("globalKeyup", globalKeyup);

onUnmounted(() => {
  proxy.$eventBus.$off("globalKeyup", globalKeyup);
});
</script>

<style lang="less" scoped>
.music-content {
  width: 100%;
  height: 100%;
  padding: 0px 25px 25px 25px;
  box-sizing: border-box;
  .song-list {
    height: 100%;
    .song-left {
      height: 100%;
      .music-btn {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .music-btn_right {
          .search_input {
            padding: 1px 11px;
            border-color: transparent;
            height: 20px;
            border-radius: 5px;
            font-size: 12px;
            background: #eee;
            &:focus {
              outline: none;
            }
          }
        }
        span {
          display: inline-block;
          height: 30px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin-right: 8px;
          padding: 0 10px;
          border: 1px solid hsla(0, 0%, 100%, 0.6);
          color: hsla(0, 0%, 100%, 0.6);
          border-radius: 2px;
          font-size: 12px;
          line-height: 30px;
          overflow: hidden;
          cursor: not-allowed;
        }
        .active {
          border-color: #fff;
          color: #fff;
          cursor: pointer;
        }
      }
      .play-list {
        height: 75%;
        overflow-y: auto;
        .music-list {
          height: 100%;
          .list-item {
            display: flex;
            width: 100%;
            color: #fff;
            overflow: hidden;
            font-size: 12px;
            height: 50px;
            border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
            line-height: 50px;
            .list-name {
              position: relative;
              padding-left: 40px;
              -webkit-box-flex: 1;
              flex: 1;
              user-select: none;
              box-sizing: border-box;
            }
            .list-artist {
              width: 150px;
            }
            .list-time {
              display: block;
              width: 60px;
              position: relative;
            }
          }
          .music-list-content {
            .song-items {
              height: 50px;
              border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
              line-height: 50px;
              overflow: hidden;
              display: flex;
              width: 100%;
              color: #ffffff99;
              font-size: 12px;
              .song-items-num {
                display: block;
                width: 30px;
                margin-right: 10px;
                text-align: center;
              }
              .song-items-name {
                position: relative;
                flex: 1;
                box-sizing: border-box;
              }
              .song-items-artist {
                width: 150px;
              }
              .song-items-time {
                display: block;
                width: 60px;
              }
            }
            .paly {
              background: rgba(255, 255, 255, 0.1);
            }
          }
        }
      }

      .music-bar-btns {
        color: #fff;
        height: 15%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        i {
          font-size: 30px;
          margin: 0 20px;
          cursor: pointer;
        }
      }
    }
  }

  .mmPlayer-bg {
    z-index: -2;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: 50%;
    -webkit-filter: blur(12px);
    filter: blur(12px);
    opacity: 0.7;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
}
</style>

<style>
audio::-webkit-media-controls {
  overflow: hidden !important;
}
audio::-webkit-media-controls-enclosure {
  width: calc(100% + 32px);
  margin-left: auto;
}
.right-round {
  height: 54px;
  width: 30px;
  background: #eff1f2;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}
</style>
