<template>
    <div class="loading">
        <img draggable="false" src="@/assets/images/loading/loadings.gif" alt="">
    </div>
</template>
<script>
    export default{
        name:"vmLoading"
    }
</script>

<style lang="less">
    .loading{
        width: 100%;height: 100%;background: #000; position: absolute;top: 0;left: 0;
        display: flex; align-items: center; justify-content: center;
    }    
</style>