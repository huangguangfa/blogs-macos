<template>
    <div class="maps">
        <window v-model:show="appInfo.desktop" title="高德地图" width="1000" height="600" :appInfo="appInfo">
            <div class="github-content wh100" v-if="appInfo.desktop">
                <div class="maps" id="map"></div>
            </div>
        </window>
    </div>
</template>

<script setup>
    import { watch, nextTick } from "vue";
    let map = null;
    const props = defineProps({
        appInfo:Object
    })
    watch( () => props.appInfo.desktop, (status) =>{
        nextTick( () =>{
            if( status ){ initMap() }
        })
    })
    function initMap(){
        map = new AMap.Map('map', {
            viewMode: '3D',
            zoom: 16.4,
            pitch:75, 
            center: [121.489048,31.237877],
            mapStyle: 'amap://styles/dark',
            showBuildingBlock: false,
            showLabel: false,
        });
        addModel(map);
    }
    
    function addModel(map){
        let loca = window.loca = new Loca.Container({ map });
        loca.ambLight = { intensity: 2.2, color: '#babedc'};
        loca.dirLight = {
            intensity: 0.46,
            color: '#d4d4d4',
            target: [0, 0, 0],
            position: [0, -1, 1],
        };
        loca.pointLight = {
            color: 'rgb(15,19,40)',
            position: [121.482697,31.239712, 2600],
            intensity: 25,
            // 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失
            distance: 3900,
        };
        let geo = new Loca.GeoJSONSource({
            url: 'https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/apps/maps/sh_building_center.json',
        });
        let pl = window.pl = new Loca.PolygonLayer({
            zIndex: 120,
            shininess: 10,
            hasSide: true,
            cullface: 'back',
            depth: true,
        });
        pl.setSource(geo);
        pl.setStyle({
            topColor: '#111',
            height: function (_, feature) {
                return feature.properties.h;
            },
            textureSize: [1000, 820],
            texture: 'https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/apps/maps/windows.jpg',
        });
        pl.setLoca(loca);
        map.on('complete', function () {
            loca.animate.start();
            setTimeout( () =>{
                animate(loca);
            },2000)
        });
    }

    function animate(loca){
        let speed = 1;
        loca.viewControl.addAnimates([
            {
                // 环绕
                pitch: {
                    value: 50,
                    control: [[0, 40], [1, 50]],
                    timing: [0.3, 0, 1, 1],
                    duration: 7000 / speed,
                },
                rotation: {
                    value: 260,
                    control: [[0, -80], [1, 260]],
                    timing: [0, 0, 0.7, 1],
                    duration: 7000 / speed,
                },
                zoom: {
                    value: 16.4,
                    control: [[0.3, 16], [1, 16]],
                    timing: [0.3, 0, 0.9, 1],
                    duration: 5000 / speed,
                },
            }
        ]
        );
    }
</script>

<style lang="less" scoped>
    .maps{
        width: 100%;height: 100%;
    }
</style>