<template>
    <div class="safari-init-page">
        <div class="title">Favorites</div>
        <div class="init-page-content">
            <ul>
                <li v-for="item in 12" :key="item">
                    <img src="https://www.huangguangfa.cn/static/media/user.f7e06438.png">
                    <span class="item-name">百度</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="less">
    .safari-init-page{padding: 0 160px;box-sizing: border-box;padding-top: 50px;
        .title{ font-size: 20px;font-weight: bold; }
        .init-page-content{
            ul{margin-top: 5px;display:flex; flex-wrap: wrap;
                li{width: 60px;margin:10px 7px;
                    img{ width: 60px;height: 60px;border-radius: 6px; }
                    .item-name{font-size: 12px;text-align: center;display: block;}
                }
            }
        }
    }
</style>