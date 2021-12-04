<template>
    <div class="home">
        <window v-model:show="appInfo.desktop" title="home" :appInfo="appInfo">
            <div ref="windowRefs" class="home-content wh100" v-if="appInfo.desktop"></div>
        </window>
    </div>
</template>

<script>
    import { onMounted, ref } from "vue"
    export default{
        props:{
            appInfo:Object
        },
        setup(){
            const windowRefs = ref(null)
            function render(){
                setTimeout( () =>{
                    const win = windowRefs.value;
                    const scene = new THREE.Scene();
                    const camera = new THREE.PerspectiveCamera( 30, win.clientWidth / win.clientHeight, .3, 1000 );
                    const renderer = new THREE.WebGLRenderer();
                    renderer.setSize( win.clientWidth, win.clientHeight );
                    document.querySelectorAll(".home-content")[0].appendChild( renderer.domElement );
                    const geometry = new THREE.BoxGeometry();
                    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
                    const cube = new THREE.Mesh( geometry, material );
                    scene.add( cube );
                    camera.position.z = 5;
                    const animate = function () {
                        requestAnimationFrame( animate );
                        cube.rotation.x += 0.01;
                        cube.rotation.y += 0.01;
                        renderer.render( scene, camera );
                    };
                    animate();
                },100)
                
            }
            onMounted( () =>{
                render()
            })
            return {
                windowRefs
            }
        }
    }
</script>
