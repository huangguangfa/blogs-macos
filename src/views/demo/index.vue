<template>
    <div class="demo">
        <div class="theme-bc testcss">测试theme</div>
        <button @click="switchTheme">切换主题</button>
    </div>
</template>

<script>
  export default{
      methods:{
          switchTheme(){
              console.log('切换主题',this.$theme)
              this.$theme.setThemeCssName("Dark")
          }
      }
  }
</script>

<style>
  .testcss{width: 200px;height: 100px;}
</style>