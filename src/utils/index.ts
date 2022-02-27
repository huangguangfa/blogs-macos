
export function handleFullScreen( status = false ): Promise<boolean> {
    return new Promise( resolve =>{
        if(!status){
            let de: any = document.documentElement;
            de.requestFullscreen && de.requestFullscreen();
            de.mozRequestFullScreen && de.mozRequestFullScreen();
            de.webkitRequestFullScreen && de.webkitRequestFullScreen();
        }else{
            let d : any = document;
            if( d.fullscreenElement ){
                d.exitFullscreen && d.exitFullscreen();
                d.mozCancelFullScreen && d.mozCancelFullScreen();
                d.webkitCancelFullScreen && d.webkitCancelFullScreen();
            } 
        }
        resolve(status)
    })
}