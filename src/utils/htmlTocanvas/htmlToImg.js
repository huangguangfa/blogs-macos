
export default function (el){
    return new Promise( resove =>{
        html2canvas(el,{
            scale:1,
            useCORS: true,
            allowTaint:false,
        }).then( async canvas => {
            let dataURL = canvas.toDataURL("image/png",1);
            resove({
                base64:dataURL
            })
        });
    })
    
}