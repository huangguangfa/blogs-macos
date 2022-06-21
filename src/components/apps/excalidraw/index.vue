<template>
  <div class="blogs">
    <window
      v-model:show="appInfo.desktop"
      title="excalidraw"
      width="1200"
      height="600"
      :appInfo="appInfo"
    >
      <div class="github-content wh100" v-if="appInfo.desktop">
        <vm-iframe
          ids="excalidraw"
          webUrl="https://huangguangfa.cn/excalidraw/index.html"
        ></vm-iframe>
      </div>
    </window>
  </div>
</template>

<script setup>
const props = defineProps({
  appInfo: Object,
});
</script>
