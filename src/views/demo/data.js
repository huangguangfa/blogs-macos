export const pageConfig = {
    // sticks: ['tl', 'tm', 'tr', 'mr'],
    sticks: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
    winBarConfig:{
        winBarStart:false,
        disX:0,
        disY:0
    },
    sticksConfig:{
        sticksStart:false,
        pointerX:0,
        pointerY:0,
        sticksType:'X' // X关注X , XY关注XY
    },
    domEvents:new Map(),
    defaultWidth:300,
    defaultHeight:300
}