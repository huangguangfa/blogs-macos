const express = require('express');
const expressWs = require("express-ws");

const router = express.Router();
expressWs(router);

const pty = require('node-pty');
const os = require('os');
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const termMap = new Map(); //保存不同机器上的实例
function createTerm(){
    let term = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    })
    termMap.set(term.pid, term);
    return term;
}

router.post("/id", (req, res) => {
    const term = createTerm();
    res.send(term.pid.toString());
    res.end();
});

router.ws('/app/:pid', function( ws, req ){
    const { params } = req;
    console.log('pid',req.params)
    const pid = parseInt(params.pid);
    const term = termMap.get(pid);
    term.on('data', function (data) {
        // console.log('服务端发送指令',data)
        ws.send(data)
    });
    ws.on("message", function(res){
        // console.log('前端指令',res)
        term.write(res)
    });
    ws.on("close", function () {
        term.kill();
        termMap.delete(pid);
    });
})



module.exports = router;