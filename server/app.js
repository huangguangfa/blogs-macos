const express = require("express");
const expressWs = require('express-ws');
//注册路由
const indexRouter = require("./routes/index");
const wbrtcRouter = require("./routes/scoket/webrtc");

const app = express();
expressWs(app);

app.use('/', indexRouter);
app.use('/webrtc', wbrtcRouter);

app.listen(4000);