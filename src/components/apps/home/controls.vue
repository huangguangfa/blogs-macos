<template>
    <div class="controls">
        <div class="flex justify-center">
            <div class="code">W</div> 
        </div>
        <div class="flex">
            <div class="code">A</div> 
            <div class="code">S</div> 
            <div class="code">D</div> 
        </div>
        <div class="thirdPerson">
            <div class="code"> V  </div>
            <div class="thirdPerson-text">第三人称</div>
        </div>
        
    </div>
    
</template>

<script>

    export default{
        setup(){
            return {

            }
        }
    }
</script>

<style lang="less" scoped>
    .controls{
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 999;
        .code{
            width: 20px;height: 20px;
            align-items: center;display: flex;justify-content: center;
            border: 1px solid #000;border-radius: 3px;
        }

        .thirdPerson{
            font-size: 12px;margin-top: 10px;width: 65px;
            display: flex;justify-content: center;flex-wrap: wrap; align-items: center;
            .thirdPerson-text{width: 65px;text-align: center;margin-top: 5px;}
        }
    }
</style>
