<template>
    <div class="home">
        <window v-model:show="appInfo.desktop" width="1000" height="700" title="home" :appInfo="appInfo">
            <div ref="windowRefs" class="home-content wh100" v-if="appInfo.desktop"></div>
        </window>
    </div>
</template>

<script>
    import { nextTick, onMounted, ref, watch } from "vue";
    import * as THREE from "@/lib/threeJS/three.module.js";
    import { OrbitControls } from '@/lib/threeJS/jsm/controls/OrbitControls.js';
    import { MD2CharacterComplex } from '@/lib/threeJS/jsm/misc/MD2CharacterComplex.js';
    import { Gyroscope } from "@/lib/threeJS/jsm/misc/Gyroscope.js";
    import rasslightBig from "@/lib/threeJS/textures/grasslight-big.jpg";
    import { createFloor } from "./hooks/floor"
    export default{
        props:{
            appInfo:Object
        },
        setup({appInfo}){
            // 相机 // 场景 // 渲染器
			let camera, scene, renderer;
            const windowRefs = ref(null);

            const init = () =>{
                const container = windowRefs.value;
                // 创建相机
                camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 4000 );
                // 设置位置
                camera.position.set(0, 150, 1300);
                // 创建场景
                scene = new THREE.Scene();
                // 设置场景背景颜色
                scene.background = new THREE.Color(0xffffff);
                // 创建阴天 雾化效果
                scene.fog = new THREE.Fog(0xffffff, 1000, 4000);
                // 往场景里面添加摄像机
                scene.add( camera );

                // 添加光影
                scene.add( new THREE.AmbientLight(0x222222));
                const light = new THREE.DirectionalLight( 0xffffff, 2.25 );
				light.position.set( 200, 450, 500 );
				light.castShadow = true;
				light.shadow.mapSize.width = 1024;
				light.shadow.mapSize.height = 512;
				light.shadow.camera.near = 100;
				light.shadow.camera.far = 1200;
				light.shadow.camera.left = - 1000;
				light.shadow.camera.right = 1000;
				light.shadow.camera.top = 350;
				light.shadow.camera.bottom = - 350;
				scene.add( light );

                // 创建地面
                const gt = new THREE.TextureLoader().load( rasslightBig );
				const gg = new THREE.PlaneGeometry( 16000, 16000 );
				const gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );
				const ground = new THREE.Mesh( gg, gm );
				ground.rotation.x = - Math.PI / 2;
				ground.material.map.repeat.set( 64, 64 );
				ground.material.map.wrapS = THREE.RepeatWrapping;
				ground.material.map.wrapT = THREE.RepeatWrapping;
				ground.material.map.encoding = THREE.sRGBEncoding;
				// 请注意，由于地面不会投射阴影，因此 .castShadow 为 false
				ground.receiveShadow = true;
				// 添加进场景
				scene.add( ground );


                // 创建渲染器
				renderer = new THREE.WebGLRenderer( { antialias: true } );
                // 返回当前显示设备的物理像素分辨率与CSS像素分辨率之比
				renderer.setPixelRatio( window.devicePixelRatio );
                // 设置渲染大小
				renderer.setSize( container.offsetWidth, container.offsetHeight );
				// 把渲染结果添加到节点
				container.appendChild( renderer.domElement );
                // 输出的格式
				renderer.outputEncoding = THREE.sRGBEncoding;
				// 开启渲染层阴影效果、模型人物的阴影
				renderer.shadowMap.enabled = true;
				// 阴影投放类型
				renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            }

            function render(){
                renderer.render( scene, camera );
            }

            function animate() {
				requestAnimationFrame( animate );
				render();
			}

            onMounted( () =>{
                appInfo.desktop && nextTick( () =>{
                    init()
                    animate()
                })
            })
            watch( ( ) => appInfo.desktop ,(status)=>{
                if(status){
                    init()
                    animate()
                }
            })

            return {
                windowRefs
            }
        }
    }
</script>
