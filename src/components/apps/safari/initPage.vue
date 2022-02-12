<template>
    <div class="safari-init-page">
        <div class="init-page-row" v-for="row in initPageConfig" :key="row.id">
            <div class="title">{{ row.type_name }}</div>
            <div class="init-page-content">
                <ul>
                    <li v-for="(item,index) in row.list" :key="index" @click="dispatchNewWeb(item,index)">
                        <div class="item_img">
                            <img :src="item.img_url">
                        </div>
                        <span class="item-name">{{ item.name }}</span>
                    </li>
                </ul>
            </div>
        </div>
        
    </div>
</template>

<script setup>
    import { initPageConfig } from "./conifg.js"
    const emit = defineEmits(['dispatchNewWeb'])
    //methods
    function dispatchNewWeb(data,index){
        const { web_url } = data;
        emit('dispatchNewWeb',web_url)
    }
</script>

<style lang="less">
.safari-init-page{padding: 0 160px;box-sizing: border-box;padding-top: 50px;
    .init-page-row{
        .title{ font-size: 20px;font-weight: bold; }
        .init-page-content{
            ul{margin-top: 5px;display:flex; flex-wrap: wrap;
                li{width: 60px;margin:10px 7px;
                    .item_img{padding: 10px; box-sizing: border-box;width: 60px;height: 60px;background: #fff; border-radius: 10px;box-shadow:0 2px 8px rgba(0, 0, 0, .1);
                        img{width: 100%;height: 100%; }
                    }
                    .item-name{font-size: 12px;text-align: center;display: block;padding-top: 10px;color: #2a2a2a;}
                }
            }
        }
    }
}
</style>