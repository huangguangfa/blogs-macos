<template>
  <div class="global-search fixed left-0 top-0">
    <div
      class="search-tag absolute ov-hide"
      v-clickoutside="cancelGlobalSearch"
    >
      <div class="search-tga-input flex align-items-center">
        <div class="iconfont macos-sousuo"></div>
        <input
          class="search-input"
          ref="searchDom"
          placeholder="Spotlight Search"
          @input="getInputValue"
          @keyup.enter="enterApps"
          @blur="inputIsFocus = false"
          @focus="inputIsFocus = true"
          type="text"
        />
      </div>
      <div class="search-content">
        <div
          class="search-item"
          v-for="(apps, index) in activeApps"
          @click="openApps(apps, index)"
          :class="{ active: selectIndex === index }"
          :key="apps.id"
        >
          <img :src="apps.img" alt="" />
          <span v-html="apps.id"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onUnmounted, onMounted } from "vue";
import {
  SET_START_GLOBAL_SEARCH,
  SET_TABABR_NAVIGATION,
  SET_WINDOW_ID,
} from "@/config/store.config";
import { useSystemStore } from "@/store/index";
import { highlight } from "@/utils/utils";
const systemStore = useSystemStore();

const { proxy } = getCurrentInstance();
const TABABR_NAVIGATIONS = systemStore.TABABR_NAVIGATION;
const activeApps = ref(TABABR_NAVIGATIONS.filter((i) => i.id !== "Trash"));
const searchDom = ref(null);
let selectIndex = ref(0);
let inputIsFocus = ref(false);
const keyupName = ["ArrowUp", "ArrowDown"];

function globalKeyup(e) {
  const { code } = e;
  const index = keyupName.indexOf(code);
  if (index >= 0) {
    // 判断键盘上下
    if (index === 0 && selectIndex.value !== 0) {
      selectIndex.value -= 1;
    } else if (index === 1 && selectIndex.value < activeApps.value.length - 1) {
      selectIndex.value += 1;
    }
    // 选中第一个 且继续按上键、让input得到焦点
    index === 0 && selectIndex.value === 0 && searchDom.value.focus();
  }
  // 不是input且按了enter键盘
  code === "Enter" && inputIsFocus.value === false && enterApps();
}
proxy.$eventBus.$on("globalKeyup", globalKeyup);
// methods
function getInputValue(e) {
  const v = e.target.value;
  const value = TABABR_NAVIGATIONS.filter(
    (i) =>
      i.title !== "Trash" &&
      (i.title.toLowerCase().includes(v) || i.title.includes(v))
  ).map((item) => {
    return {
      ...item,
      id: highlight(item.title, v),
    };
  });
  activeApps.value = value;
  selectIndex.value = 0;
}
function cancelGlobalSearch() {
  systemStore[SET_START_GLOBAL_SEARCH](false);
}
function openApps(apps, index) {
  const appsIndex = TABABR_NAVIGATIONS.findIndex((app) => app.id === apps.id);
  selectIndex.value = index;
  setTimeout(() => {
    systemStore[SET_TABABR_NAVIGATION]({
      _index: appsIndex,
      dockData: { desktop: true, isMinimize: false },
    });
    systemStore[SET_WINDOW_ID](apps.id);
    cancelGlobalSearch();
  }, 100);
}
function enterApps() {
  const apps = activeApps.value[selectIndex.value];
  openApps(apps, selectIndex.value);
}
onUnmounted(() => {
  proxy.$eventBus.$off("globalKeyup", globalKeyup);
});
onMounted(() => {
  selectIndex.value === 0 && searchDom.value.focus();
});
</script>

<style lang="less">
.global-search {
  width: 100vw;
  height: 100vh;
  .search-tag {
    width: 660px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(40px);
    background-color: rgba(243, 244, 246, 0.8);
    border: 1px solid rgba(156, 163, 175, 0.5);
    left: 50%;
    top: 10%;
    transform: translate(-50%);
    border-radius: 0.375rem;
    .search-tga-input {
      width: 100%;
      height: 59px;
      padding: 0 10px;
      box-sizing: border-box;
      .macos-sousuo {
        width: 60px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(75, 85, 99);
        font-size: 30px;
      }
      .search-input {
        width: 100%;
        height: 100%;
        border: none;
        padding: 0;
        line-height: 0;
        box-sizing: border-box;
        background: none;
        &:focus {
          border: none;
          outline: none;
        }
        &::placeholder {
          opacity: 0.4;
          color: rgba(0, 0, 0, 1);
          font-size: 28px;
          position: relative;
          top: 5px;
        }
      }
    }
    .search-content {
      width: 100%;
      max-height: 400px;
      overflow-y: auto;
      overflow-x: hidden;
      margin-top: 1px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding: 10px 10px;
      box-sizing: border-box;
      .search-item {
        display: flex;
        align-items: center;
        margin-top: 10px;
        cursor: pointer;
        padding: 2px 10px;
        img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }
      .active {
        background: #317add;
        color: #fff;
        border-radius: 5px;
      }
    }
  }
}
</style>
