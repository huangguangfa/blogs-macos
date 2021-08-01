
//八点拖拽点计算规则
export const sticksRule = {
    //left
    'tl':{
        dir:'X',
        computedX:( value ) => -1 * value
    },
    //top
    'tm':{
        dir:'Y',
        computedY:( value ) => -1 * value
    },
    //right
    'tr':{
        dir:'X',
        computedX:( value ) => 1 * value
    },
    //bottom
    'mr':{
        dir:'Y',
        computedY:( value ) => 1 * value
    },
    // top + left
    'br':{
        dir:'XY',
        computedX:( value ) => -1 * value,
        computedY:( value ) => -1 * value,
        isChangePositionX:true,
        isChangePositionY:true
    },
    // top + right
    'bm':{
        dir:'XY',
        computedY:( value ) => -1 * value,
        computedX:( value ) => 1 * value,
        isChangePositionY:true
    },
    // left + bottom
    'bl':{
        dir:'XY',
        computedX:( value ) => -1 * value,
        computedY:( value ) => 1 * value,
        isChangePositionX:true
    },
    //right/bottom
    'ml':{
        dir:'XY',
        computedX:( value ) => 1 * value,
        computedY:( value ) => 1 * value,
    },
}

export const statusList = [
    { icon:'macos-shanchu', className:'' },
    { icon:'macos-jian', className:'remove-round' },
    { icon:'macos-quanping', className:'fullscreen-round' },
]

//初始化Window
export function initWindowStaus(dom){
    let web_width = window.screen.width;
    let web_height = window.screen.height;
    let domW = dom.offsetWidth
    let domH = dom.offsetHeight
    if( !(domW && domH )) return;
    //初始化元素居中
    dom.style.left = (web_width - domW) / 2 + 'px';
    dom.style.top = (web_height - domH) / 2 + 'px';
}
//鼠标松开、清除状态
export function mouseups(pageConfig){
    let iframe = document.querySelector('iframe')
    iframe && (iframe.style['pointer-events'] = 'auto')
    pageConfig.winBarConfig.winBarStart = false;
    pageConfig.sticksConfig.sticksStart = false;
}
export function documentMoves(windom,ev,pageConfig){
    const { clientY, clientX, pageX, pageY  } = ev;
    let web_width =  document.body.offsetWidth;
    const { winBarStart, disX, disY } = pageConfig.winBarConfig;
    const { sticksStart, pointerX,pointerY, sticksType } = pageConfig.sticksConfig;
    //窗口移动
    if( winBarStart ){
        let dom_width = windom.offsetWidth;
        let currenrLeft = parseInt(windom.style.left);
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = clientX - disX;
        let top = clientY - disY;
        top = top < 0 ? 0 : top;
        let letf_boundary =  parseInt((dom_width / 5) * 4);
        //不可移动的距离、左右不可超5/4
        if( (-letf_boundary) > left || ( left + dom_width ) > (web_width + letf_boundary ) ){  left = currenrLeft; }
        windom.style.left = left + "px";
        windom.style.top = top + "px";
    }
    //边框拖动
    if( sticksStart ){
        const { dir,computedX, computedY, isChangePositionX, isChangePositionY } = sticksRule[sticksType];
        const { defaultWidth, defaultHeight } = pageConfig;
        const winLeft = parseInt(windom.style.left);
        const winTop = parseInt(windom.style.top);
        // left/right
        if( ['X','XY'].includes(dir) ){
            const computedChangeValue = computedX(parseInt( pageX - pointerX ));
            let widthX = computedChangeValue + windom.offsetWidth;
            windom.style.width = ( widthX < defaultWidth ? defaultWidth : widthX ) + "px";
            if( (widthX > defaultWidth) && (sticksType === 'tl' || isChangePositionX ) ){
                windom.style.left = (winLeft - computedChangeValue) + 'px'
            }
            pageConfig.sticksConfig.pointerX = pageX;
        }
        // top/bottom
        if( ['Y','XY'].includes(dir) ){
            const computedChangeValue = computedY(parseInt( pageY - pointerY ));
            let heightY = computedChangeValue + windom.offsetHeight;
            windom.style.height = ( heightY < defaultHeight ? defaultHeight : heightY ) + "px";
            pageConfig.sticksConfig.pointerY = pageY;
            if( (heightY > defaultHeight) && (sticksType === 'tm' || isChangePositionY ) ){
                windom.style.top = (winTop - computedChangeValue) + 'px'
            }
        }
    }
}