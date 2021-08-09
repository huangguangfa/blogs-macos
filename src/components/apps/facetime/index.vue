<template>
    <div class="facetime">
        <window v-model:show="show" title="Facetime" width="350" height="450">
            <div class="facetime-content" v-if="show">
                <video id="videos" ref="videos" autoplay></video>
                <div class="closure" @click="closures">
                    <i class="iconfont macos-guaduan"></i>
                </div>
            </div>
        </window>
    </div>
</template>

<script>
    import { ref, watch, reactive  } from "vue";
    import { getUserMedia } from "@/utils/utils.js";
    import { getActiveUserList } from "../../../services/facetime"

    export default{
        props:{
            show:Boolean
        },
        setup(props, { emit }){
            const videos = ref(null);
            let streams = reactive({
                stream:null
            });
            watch( () => props.show ,(status) => {
                emit('update:show',status);
                if( status ){
                    getUserMedia( stream => {
                        getActiveUserList().then( res =>{
                            console.log('11111',res)
                        })
                        streams.stream = stream;
                        let video = videos.value;
                        video.srcObject = stream;
                        video.onerror = function() { stream && stream.getTracks().forEach( track => track.stop() ); };
                    }, err =>{})
                }else{
                    streams.stream.getTracks().forEach( track => track.stop() );
                }
            });
            //methods
            function closures(){
                this.streams.stream.getTracks().forEach( track => track.stop() );
                this.$emit('update:show',false);
            }
            return {
                videos,
                streams,

                closures
            }
        }
    }
</script>

<style lang="less">
.facetime-content{
    width: 100%;height: 100%; position: relative;
    #videos{
        width: 100%;height: 100%;
        object-fit: cover;
    }
    .closure{
        position: absolute;
        left: 50%;bottom: 60px;
        transform: translate(-50%);
        z-index: 2;
        background: crimson;
        width: 40px;height:40px; border-radius:100%;
        display: flex; justify-content: center; align-items: center;
        .iconfont{
            color:#fff;
            font-size: 25px;
            cursor: pointer;
        }
    }
    
}
</style>
