
export const createFloor = function(){
    return new Promise( resolve =>{
        let loader = new THREE.TextureLoader;
        loader.load('http://blogs-macos.oss-cn-shenzhen.aliyuncs.com/tabbar-navigation/blogs.png', function (texture) {
            //x和y超过图片像素之后重复绘制图片
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            //设置地板重复绘制的密度是1 * 1
            texture.repeat.set(1, 1);
            //设置材质是双面材质
            var material = new THREE.MeshLambertMaterial({
                map : texture,
                side : THREE.DoubleSide
            });
            //创建普通的平面几何体
            var gemotery = new THREE.PlaneGeometry(40,40);

            //创建网格对象
            var mesh = new THREE.Mesh(gemotery,material);
            mesh.position.y = 0;
            mesh.rotation.x = Math.PI/2;
            resolve(mesh);
        });
    })
    
}