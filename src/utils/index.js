export function handleFullScreen( status = false ) {
    return new Promise( resolve =>{
        if(!status){
            let de = document.documentElement;
            de.requestFullscreen && de.requestFullscreen();
            de.mozRequestFullScreen && de.mozRequestFullScreen();
            de.webkitRequestFullScreen && de.webkitRequestFullScreen();
        }else{
            let d = document;
            if( d.fullscreenElement ){
                d.exitFullscreen && d.exitFullscreen();
                d.mozCancelFullScreen && d.mozCancelFullScreen();
                d.webkitCancelFullScreen && d.webkitCancelFullScreen();
            } 
        }
        resolve(status)
    })
}