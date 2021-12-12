<template>
    <div class="home">
        <window v-model:show="appInfo.desktop" width="1000" height="700" title="MyHome" @windowId="getWindowId" :appInfo="appInfo">
			<vm-loading v-if="loading"></vm-loading>
            <div ref="windowRefs" class="home-content wh100"></div>
        </window>
    </div>
</template>

<script>
    import { nextTick, onMounted, ref, watch, onUnmounted } from "vue";
    import * as THREE from "@/lib/threeJS/three.module.js";
    import { OrbitControls } from '@/lib/threeJS/jsm/controls/OrbitControls.js';
    import { MD2CharacterComplex } from '@/lib/threeJS/jsm/misc/MD2CharacterComplex.js';
    import { Gyroscope } from "@/lib/threeJS/jsm/misc/Gyroscope.js";
    import { PointerLockControls } from '@/lib/threeJS/jsm/controls/PointerLockControls.js';
    import rasslightBig from "@/lib/threeJS/textures/grasslight-big.jpg";
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	import { randomNum } from "@/utils/utils";
    export default{
        props:{
            appInfo:Object
        },
        setup({appInfo}){
            const observer = new MutationObserver(() =>{
               onWindowResize()
            });
			const loading = ref(true);
            const windowRefs = ref(null);
            // 相机 // 场景 // 渲染器
			let camera, scene, renderer;
            // 鼠标控制相机变量
            // let cameraControls;
			// 定义方向键状态
			const controls = {
				moveForward: false,
				moveBackward: false,
				moveLeft: false,
				moveRight: false
			};
			// 第三人称
            let thirdPerson;
            let thirdPersonStatus = false;
            const characters = [];
            let nCharacters = 0;
            let light;
            const clock = new THREE.Clock();
            const getWindowId = (id) =>{
                observer.observe(document.getElementById(id),{ attributes: true})
            }
            
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
                light = new THREE.DirectionalLight( 0xffffff, 2.25 );
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
                // 添加场景拖拽
                addCameraControls()
                scene.add( thirdPerson.getObject() );
                // 添加键盘事件
                addEvents()
                // 创建管家
                addButler()
            }
            // 事件的绑定
            const addEvents = () =>{
				document.addEventListener( 'keydown', onKeyDown );
				document.addEventListener( 'keyup', onKeyUp );
            }
            const onWindowResize = () => {
                const container = windowRefs.value;
				renderer.setSize( container.offsetWidth, container.offsetHeight );
				camera.aspect = container.offsetWidth / container.offsetHeight;
				camera.updateProjectionMatrix();
			}

            const onKeyDown = ( event ) => {
				switch ( event.code ) {
					case 'ArrowUp':
					case 'KeyW': controls.moveForward = true; break;

					case 'ArrowDown':
					case 'KeyS': controls.moveBackward = true; break;

					case 'ArrowLeft':
					case 'KeyA': controls.moveLeft = true; break;

					case 'ArrowRight':
					case 'KeyD': controls.moveRight = true; break;

					case 'KeyC': controls.crouch = true; break;
					case 'Space': controls.jump = true; break;
					case 'ControlLeft':
					case 'ControlRight': controls.attack = true; break;
                    // 第三人称视角设置
                    case 'KeyV':
                        if( thirdPersonStatus ){
                            thirdPersonStatus = false;
                            camera.position.set(0, 190, 1300);
                            thirdPerson.unlock();
                        }else{
                            thirdPersonStatus = true;
                            camera.position.set(0, 110, 20);
                            thirdPerson.lock(); 
                        }
                        break;
				}
			}

            const onKeyUp = ( event ) => {
				switch ( event.code ) {
					case 'ArrowUp':
					case 'KeyW': controls.moveForward = false; break;

					case 'ArrowDown':
					case 'KeyS': controls.moveBackward = false; break;

					case 'ArrowLeft':
					case 'KeyA': controls.moveLeft = false; break;

					case 'ArrowRight':
					case 'KeyD': controls.moveRight = false; break;

					case 'KeyC': controls.crouch = false; break;
					case 'Space': controls.jump = false; break;
					case 'ControlLeft':
					case 'ControlRight': controls.attack = false; break;
				}
			}


            // 添加鼠标拖拽相机功能
            const addCameraControls = () =>{
				// cameraControls = new OrbitControls( camera, renderer.domElement );
				// cameraControls.target.set( 0, 1, 0 );
				// cameraControls.update();
                thirdPerson = new PointerLockControls( camera, document.body );

            }
            // 创建管家
            const addButler = () =>{
				const configOgro = {
					baseUrl: "/src/lib/threeJS/models/md2/ogro/",
					body: "ogro.md2",
					// skins: [ "grok.jpg", "ogrobase.png", "arboshak.png", "ctf_r.png", "ctf_b.png", "darkam.png", "freedom.png", "gib.png", "gordogh.png", "igdosh.png", "khorne.png", "nabogro.png", "sharokh.png" ],
					skins: [ "darkam.png"],
					weapons: [[ "weapon.md2", "weapon.jpg" ]],
					animations: {
						move: "run",
						idle: "stand",
						jump: "jump",
						attack: "attack",
						crouchMove: "cwalk",
						crouchIdle: "cstand",
						crouchAttach: "crattack"
					},
					walkSpeed: 350,
					crouchSpeed: 175
				};
                const nRows = 1;
				const nSkins = configOgro.skins.length;
				nCharacters = nSkins * nRows;
				for ( let i = 0; i < nCharacters; i ++ ) {
					const character = new MD2CharacterComplex();
					character.scale = 3;
					character.controls = controls;
					characters.push( character );

				}
                const baseCharacter = new MD2CharacterComplex();
				baseCharacter.scale = 3;
				baseCharacter.onLoadComplete = function () {
					let k = 0;
					for ( let j = 0; j < nRows; j ++ ) {
						for ( let i = 0; i < nSkins; i ++ ) {
							const cloneCharacter = characters[ k ];
							cloneCharacter.shareParts( baseCharacter );
							// cast and receive shadows
							cloneCharacter.enableShadows( true );
							cloneCharacter.setWeapon( 0 );
							cloneCharacter.setSkin( i );
							cloneCharacter.root.position.x = ( i - nSkins / 2 ) * 150;
							cloneCharacter.root.position.z = j * 250;
							scene.add( cloneCharacter.root );
							k ++;
						}
					}
					const gyro = new Gyroscope();
					gyro.add( camera );
					gyro.add( light, light.target );

					characters[ Math.floor( nSkins / 2 ) ].root.add( gyro );

				};

				baseCharacter.loadParts( configOgro );
            }
            const render = () =>{
                const delta = clock.getDelta();
				for ( let i = 0; i < nCharacters; i ++ ) {
					characters[ i ].update( delta );
				}
                renderer.render( scene, camera );
                // cameraControls.update();
            }

            const animate = () => {
				requestAnimationFrame( animate );
				render();
			}
			const start = () =>{
				setTimeout( () =>{
					loading.value = false;
				},randomNum(3,4) * 1000)
				init()
                animate()
			}
            onMounted( () =>{
                appInfo.desktop && nextTick( () =>{
                    start()
                })
            })
            watch( ( ) => appInfo.desktop ,(status)=>{
                if(status){
                    nextTick( () =>{
                        start()
                    })
                }else{
                    observer.disconnect();
                }
            })

            onUnmounted( () =>{
                observer.disconnect();
            })

            return {
                windowRefs,
                getWindowId,
				loading
            }
        }
    }
</script>
