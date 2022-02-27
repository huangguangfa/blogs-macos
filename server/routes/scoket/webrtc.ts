const express = require('express');
const expressWs = require("express-ws");

const router = express.Router();
expressWs(router);

const active_user = {};
router.ws('/webrtc/user', function( ws, req ){
    const { uId, uName, uAvatar, isStartCamera } = req.query;
    console.log('连接',req.query);
    if(uId && uName){
        active_user[uId] = { ws, uId, uName, uAvatar, isStartCamera }
        updateActiveUser()
    };
    //接收消息、【保存用户信息】
    ws.on("message", function(mes){
        if(mes === "ping") return;
        try{
            const { uId, data } = JSON.parse(mes);
            const { ws } = active_user[uId];
            ws && dispatchMessage(ws, getSendData('exc',data));
        }catch(e){
            console.log(e)
        }
    });
    //监听关闭、【删除内存中用户】
    ws.on("close", function(w) {
        console.log('断开',uName)
        delete active_user[uId];
        updateActiveUser()
    });
})


//查询当前服务活跃用户
router.get('/getActiveUserList',(req,res)=>{
    res.send({ status:true,result:Object.values(active_user) })
})

//通知最新活跃用户
function updateActiveUser(){
    let activeUser = getSendData('system',getActiveUserList() );
    dispatchAllUserMessage( activeUser )
}

//发送数据
function dispatchMessage(ws,data){
    let datas = JSON.stringify(data)
    ws.send(datas)
}

//获取当前活跃人数
function getActiveUserList(){
    let userList = Object.values(active_user).map( item => {
        const { uId, uName, uAvatar, isStartCamera } = item;
        return { uId, uName, uAvatar, isStartCamera }
    })
    return userList;
}

//发送的数据
function getSendData(type,data){
    return { sender:type, data }
}
function dispatchAllUserMessage(data){
    for(let key in active_user){
        let { ws } = active_user[key];
        ws && dispatchMessage(ws, data);
    }
}
module.exports = router;