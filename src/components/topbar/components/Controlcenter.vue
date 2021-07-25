<template>
    <div class="controlcenter">
        <div class="controlcenter-img">
            <img src="@/assets/images/topbar/controlcenter.png" alt="">
        </div>
        <div class="systemTime ml15">
            <span>Sun Jul 25</span>
            <span class="ml10">11:23 PM</span>
        </div>
    </div>
</template>


<style lang="less">
    .controlcenter{
        display: flex;
            align-items: center;
        height: 100%;
        .controlcenter-img{
            height: 100%;
            padding: 0 5px;
            display: flex;
            align-items: center;
            border-radius: 3px;
            //反转图片颜色
            img{
                filter: invert(100%);
                filter: invert(1); /* same */
                width: 15px;height: 15px;
            }
            &:hover{
                background-color: rgba(255,255,255,0.3);
            }
        }
        .systemTime{
            font-size: 12px;color: #fff;
        }
    }
</style>