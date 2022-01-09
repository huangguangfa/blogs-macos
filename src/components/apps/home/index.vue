<template>
    <div class="home">
        <window v-model:show="appInfo.desktop" width="1000" height="700" title="MyHome" @windowId="getWindowId" :appInfo="appInfo">
			<vm-loading v-if="appInfo.desktop && loading"></vm-loading>
            <div v-if="appInfo.desktop" ref="windowRefs" class="home-content wh100"></div>
			<vm-controls></vm-controls>
			<vm-car-config @onCar="onCarEvent"></vm-car-config>
        </window>
    </div>
</template>

<script>
    import { nextTick, onMounted, ref, watch, onUnmounted, reactive } from "vue";
    import * as THREE from "@/lib/threeJS/three.module.js";
    import { OrbitControls } from '@/lib/threeJS/jsm/controls/OrbitControls.js';
    import { MD2CharacterComplex } from '@/lib/threeJS/jsm/misc/MD2CharacterComplex.js';
	import { FBXLoader } from "@/lib/threeJS/jsm/loaders/FBXLoader.js"
	import { GLTFLoader } from '@/lib/threeJS/jsm/loaders/GLTFLoader.js';
    import { Gyroscope } from "@/lib/threeJS/jsm/misc/Gyroscope.js";
    import { PointerLockControls } from '@/lib/threeJS/jsm/controls/PointerLockControls.js';
	// 模型选中发光 start-------
	import { EffectComposer } from '@/lib/threeJS/jsm/postprocessing/EffectComposer.js';
	import { RenderPass } from '@/lib/threeJS/jsm/postprocessing/RenderPass.js';
	import { OutlinePass } from '@/lib/threeJS/jsm/postprocessing/OutlinePass.js';
	import { ShaderPass } from '@/lib/threeJS/jsm/postprocessing/ShaderPass.js';
	import { FXAAShader } from "@/lib/threeJS/jsm/shaders/FXAAShader.js"
	// 模型选中发光 end -------
    import rasslightBig from "@/lib/threeJS/textures/grasslight-big.jpg";
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	import { randomNum } from "@/utils/utils";
	import Controls from "./Controls.vue";
	import CarConfig from "./CarConfig.vue";
    export default{
		components:{
			vmControls:Controls,
			vmCarConfig:CarConfig
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
			let composer;
			let outlinePass;
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
                scene.add( new THREE.AmbientLight(0xffffff));
                light = new THREE.DirectionalLight( 0xffffff, 2.23 );
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

				// 创建最终视觉效果合成器
				composer = new EffectComposer(renderer);
				let renderPass = new RenderPass(scene, camera);
				composer.addPass(renderPass);
				outlinePass = new OutlinePass(new THREE.Vector2(container.offsetWidth, container.offsetHeight), scene, camera);
				outlinePass.pulsePeriod = 2; //数值越大，律动越慢
				outlinePass.visibleEdgeColor.set('#130AF2'); // 选中颜色
				outlinePass.hiddenEdgeColor.set( 0x000000 );// 阴影颜色
				outlinePass.usePatternTexture = false; // 使用纹理覆盖？
				outlinePass.edgeStrength = 5; // 高光边缘强度
				outlinePass.edgeGlow = 1; // 边缘微光强度
				outlinePass.edgeThickness = 1; // 高光厚度
				let effectFXAA = new ShaderPass(FXAAShader);
				effectFXAA.uniforms.resolution.value.set(1 / container.offsetWidth, 1 / container.offsetHeight);
				effectFXAA.renderToScreen = true;
				composer.addPass(outlinePass);
				composer.addPass(effectFXAA);


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


				addGLF({
					url:'https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/threeJS/models/fbx/house/small_buildingA.glb',
					scale:{
						x:500,
						z:500,
						y:500
					},
					position:{ 
						x:400, 
						z:0, 
						y:0 
					}
				})

				addGLF({
					url:'https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/threeJS/models/fbx/house/suv.glb',
					scale:{
						x:100,
						z:100,
						y:100
					},
					position:{ 
						x:-400, 
						z:0, 
						y:0 
					},
					rotation:{ 
						x:0, 
						z:600, 
						y:0 
					},
					isSuv:true
				})
            }

			// fbx模型加载
			const addGf = () =>{
				FBXloader.load( 'https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/threeJS/models/fbx/house/tree.fbx',function( object ) {
					object.scale.set(.1,.1, .1)
					scene.add(object);
					console.log(object)
				})
			}

			
			let suvObj = null;
			// GLf和glb模型加载
			const loaderGLF = new GLTFLoader();
			const addGLF = ({
				url,
				scale = { x:1, z:1, y:1 }, 
				position = { x:0, z:0, y:0 },
				rotation = { x:0, z:0, y:0 },
				isSuv
				})=>{
					if( !url ) return;
					loaderGLF.load( url, function ( gltf ) {
						let gltfModule = gltf.scene;
						// 设置模型倍数
						gltfModule.scale.set( scale.x, scale.z, scale.y );
						// 设置模型位置
						gltfModule.position.set( position.x, position.z, position.y );
						// 设置模型旋转
						gltfModule.rotation.set( rotation.x, rotation.z, rotation.y )
						// 添加模型
						scene.add( gltfModule );

						// 用于测试的模型、拆分!
						if(isSuv){
							suvObj = gltfModule;
							let positionConfig = {
								"suv":[false, false, false],
								"body":[false, 0.3, false],
								"Mesh_body":[false, 1.2, false],
								"Mesh_body_1":[false, 1.1, false],
								"Mesh_body_2":[false, false, false],
								"Mesh_body_3":[false, false, false],
								"Mesh_body_4":[false, false, .2],
								"Mesh_body_5":[false, false, false],
								"wheel_back":[false, 1, 1.5],
								"Mesh_wheel_frontLeft":[false, false, false],
								"Mesh_wheel_frontLeft_1":[false, false, false],
								"wheel_backLeft":[-.7, .5, .7],
								"wheel_backRight":[.7, .5, .7],
								"wheel_frontLeft":[-.7, .5, -.7],
								"wheel_frontRight":[.7, .5, -.7]
							}
							suvObj.traverse(function (child) {
								const { name } = child;
								child.fromPosition = [child.position.x,child.position.y,child.position.z]
								const [x ,y, z] = positionConfig[name] || [child.position.x,child.position.y,child.position.z];
								child.toPosition = [ x ?? child.position.x, y ?? child.position.y , z ?? child.position.z ];
							})
						}
					} , undefined, function ( error ) {
						console.error('模型加载错误', error );
					});
			}

			/************* 模型车 ************************************************************************************************/
			let carModeConfig = reactive({
				opShow:false,
				selectModel:null
			})
			const onCarEvent = ({ type, color }) => {
				const { selectModel } = carModeConfig;
				if( type ){
					suvObj.traverse(function (child) {
						const [x,z,y] = type === 1 && child.toPosition || child.fromPosition
						child.position.set(x,z,y) 
					})
				}
				if( color && selectModel ){
					let newMaterial = selectModel.material.clone();
					newMaterial.color = new THREE.Color(color);
					selectModel.material = newMaterial;
					outlinePass.selectedObjects = [];
					carModeConfig.selectModel = null;
				}
			}

			/************* 模型车 ************************************************************************************************/
			// 选中模型事件
			const raycaster = new THREE.Raycaster();
			const mouse = new THREE.Vector2();
			const selectModelHandler = (ev) =>{
				const container = windowRefs.value;
				mouse.x = ( (ev.clientX - container.getBoundingClientRect().left) / container.offsetWidth ) * 2 - 1; 
            	mouse.y = - ( (ev.clientY - container.getBoundingClientRect().top) / container.offsetHeight ) * 2 + 1;
				raycaster.setFromCamera(mouse, camera);
				// 只检测模型的选中
				let intersects = raycaster.intersectObjects(suvObj.children, true);
				if (intersects.length > 0) {
					// 获取选中的模型 添加颜色
					let selectedObjects = intersects[0].object;
					// let newMaterial = selectedObjects.material.clone();
					// newMaterial.color = new THREE.Color("#ffffff"); //重新修改颜色
					// selectedObjects.material = newMaterial;
					// // 保存下当前选中的模型
					carModeConfig.selectModel = selectedObjects;
					outlinePass.selectedObjects = [selectedObjects]
				}else{
					outlinePass.selectedObjects = [];
					carModeConfig.selectModel = null;
				}
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
				light.position.set(vector.x,(vector.y + 500),vector.z);
				// 执行渲染
                renderer.render( scene, camera );
				// 模型选中光描边
				composer.render()
				
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
				windowRefs.value.addEventListener('click', selectModelHandler, false);

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
				loading,
				carModeConfig,
				onCarEvent
            }
        }
    }
</script>
