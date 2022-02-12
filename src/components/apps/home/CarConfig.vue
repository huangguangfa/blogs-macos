<template>
    <div class="car-config">
        <div class="optins-content">
            <div class="optins-items" v-for="(item, index) in state.optins" :key="index" @click="selectOp(index)">{{ item }} </div>
        </div>
        <div class="select-color">
            <div class="color-items" :style="`background:${item}`" v-for="(item, index) in state.colorList" :key="index" @click="selectColor(item)"></div>
        </div>
    </div>
</template>

<script setup>
    import { reactive } from 'vue'
    const emit = defineEmits(['onCar']);
    let state = reactive({
        optins:["分解","合成"],
        colorList:["#FFDAB9", "#F0FFF0", "#E6E6FA", "#54FF9F", "#000080", "#FFC125", "#EE6363", "#6959CD"]
    })

    const selectOp = (index) =>{
        handleCarEvent({
            type:index + 1
        })
    }
    const selectColor = (color) =>{
        handleCarEvent({ color })
    }
    const handleCarEvent = (data) =>{
        emit("onCar",data )
    }
</script>


<style scoped lang="less">
    .car-config{
        position: fixed;
        z-index: 99;
        bottom: 10px;
        left: 10px;
        background: rgba(0,0,0,0.2);
        padding: 10px 20px;
        border-radius: 5px;
        .optins-content{
            display: flex;
            .optins-items{
                font-size: 12px;padding: 5px 10px;background: linear-gradient(180deg,#67c23a 0,#67c23a);
                margin: 0 5px;color: #fff;border-radius: 5px; cursor: pointer;
            }
        }
        .select-color{
            margin-top: 10px;
            display: flex;
            width: 120px;
            flex-wrap: wrap;
            .color-items{
                width: 20px;height: 20px;border-radius: 100%;cursor: pointer;margin: 3px 5px;
            }
        }
    }
</style>