<template>
    <div class="home">
        <window v-model:show="appInfo.desktop" width="1000" height="700" title="MyHome" @windowId="getWindowId" :appInfo="appInfo">
			<vm-loading v-if="appInfo.desktop && loading"></vm-loading>
            <div v-if="appInfo.desktop" ref="windowRefs" class="home-content wh100"></div>
			<vm-controls></vm-controls>
        </window>
    </div>
</template>

<script>
    import { nextTick, onMounted, ref, watch, onUnmounted } from "vue";
    import * as THREE from "@/lib/threeJS/three.module.js";
    import { OrbitControls } from '@/lib/threeJS/jsm/controls/OrbitControls.js';
    import { MD2CharacterComplex } from '@/lib/threeJS/jsm/misc/MD2CharacterComplex.js';
	import { FBXLoader } from "@/lib/threeJS/jsm/loaders/FBXLoader.js"
	import { GLTFLoader } from '@/lib/threeJS/jsm/loaders/GLTFLoader.js';
    import { Gyroscope } from "@/lib/threeJS/jsm/misc/Gyroscope.js";
    import { PointerLockControls } from '@/lib/threeJS/jsm/controls/PointerLockControls.js';
    import rasslightBig from "@/lib/threeJS/textures/grasslight-big.jpg";
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	import { randomNum } from "@/utils/utils";
	import Controls from "./controls.vue";
    export default{
		components:{
			vmControls:Controls
		},
        props:{
            appInfo:Object
        },
        setup({appInfo}){
            const observer = new MutationObserver(() =>{
               onWindowResize()
            });
			let cameraControls;
			const loading = ref(true);
            const windowRefs = ref(null);
            // 相机 // 场景 // 渲染器
			let camera, scene, renderer;
			const FBXloader = new FBXLoader();
			// 定义方向键状态
			let controls = {
				moveForward: false,
				moveBackward: false,
				moveLeft: false,
				moveRight: false
			};
			// 第三人称
            let thirdPerson;
            let thirdPersonStatus = false;
            let characters = [];
            let nCharacters = 0;
            let light;
            let clock;
            const getWindowId = (id) =>{
                observer.observe(document.getElementById(id),{ attributes: true})
            }
			const resetStatus = () =>{
				loading.value = true;
				camera = null;
				scene = null;
				renderer = null;
				// 定义方向键状态
				controls = {
					moveForward: false,
					moveBackward: false,
					moveLeft: false,
					moveRight: false
				};
				// 第三人称
				thirdPerson;
				thirdPersonStatus = false;
				characters = [];
				nCharacters = 0;
				light;
				clock = new THREE.Clock();
			}
            
            const init = () =>{
				resetStatus();
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
				// 添加第一人称
                addLockControls()
                scene.add( thirdPerson.getObject() );
                // 添加键盘事件
                addEvents()
                // 创建管家
                addButler()
				// addGf()
				addGLF()

				
            }
			const addGf = () =>{
				FBXloader.load( 'https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/threeJS/models/fbx/house/tree.fbx',function( object ) {
					object.scale.set(.1,.1, .1)
					scene.add(object);
					console.log(object)
				})
			}
			
			const loaderGLF = new GLTFLoader();

			const addGLF = ()=>{
				loaderGLF.load( 'https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/threeJS/models/fbx/house/small_buildingA.glb', function ( gltf ) {
					const boomBox = gltf.scene;
					// 给模型添加光
					// boomBox.traverse( function ( child ) {
					// 	if ( child.isMesh ) {
					// 		child.material.emissive =  child.material.color;
					// 		child.material.emissiveMap = child.material.map ;
					// 	}
					// });
					// 设置模型倍数
					boomBox.scale.set( 300, 300, 300 );
					scene.add( boomBox );
				} , undefined, function ( error ) {
					console.error('模型加载错误', error );
				} );
			}
            // 事件的绑定
            const addEvents = () =>{
				document.addEventListener( 'keydown', onKeyDown );
				document.addEventListener( 'keyup', onKeyUp );
            }
            const onWindowResize = () => {
				if( windowRefs.value ) return ;
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


            // 添加第一人称
            const addLockControls = () =>{
                thirdPerson = new PointerLockControls( camera, document.body );
            }
			// 添加鼠标拖拽相机功能
			const addCameraControls = () =>{
				cameraControls = new OrbitControls( camera, renderer.domElement );
				cameraControls.target.set( 0, 50, 0 );
				cameraControls.update();
			}
            // 创建管家
            const addButler = () =>{
				const configOgro = {
					// baseUrl: "/src/lib/threeJS/models/md2/ogro/",
					baseUrl: "",
					// body: "ogro.md2",
					body: "https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/threeJS/models/md2/ogro/ogro.md2",
					// skins: [ "darkam.png"],
					skins: [ "https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/threeJS/models/md2/ogro/skins/darkam.png"],
					// weapons: [[ "weapon.md2", "weapon.jpg" ]],
					weapons: [
						[ 
							"https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/threeJS/models/md2/ogro/weapon.md2", 
							"https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/threeJS/models/md2/ogro/skins/weapon.jpg" 
						]
					],
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
				// 克隆光、让光随着相机走
				let vector = camera.position.clone();
				light.position.set(vector.x,vector.y,vector.z);
				// 执行渲染
                renderer.render( scene, camera );
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
