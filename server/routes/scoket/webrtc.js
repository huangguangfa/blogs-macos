const express = require('express');
const expressWs = require("express-ws");

const router = express.Router();
expressWs(router);

const active_user = {};
router.ws('/webrtc/user', function( ws, req ){
    ws.send('连接成功！')
    const { uid } = req.query;
    uid && (active_user[uid] = ws);
    //接收消息、【保存用户信息】
    ws.on("message", function(data){
        const { uid, mes } = JSON.parse(data);
        const ws = active_user[uid];
        ws && ws.send(mes)
    });
    //监听关闭、【删除内存中用户】
    ws.on("close", function(w) {
        delete active_user[uid];
        console.log(JSON.stringify(Object.keys(active_user) ))
    });
})

//查询当前服务活跃用户
router.get('/getActiveUserList',(req,res)=>{
    res.send({ status:true,result:Object.keys(active_user) })
})

module.exports = router;