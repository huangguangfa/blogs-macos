const express = require("express");
const expressWs = require('express-ws');
const cors = require('./config/cors');
//注册路由
const indexRouter = require("./routes/index");
const wbrtcRouter = require("./routes/scoket/webrtc");


const app = express();
app.all("*",cors);
expressWs(app);

app.use('/', indexRouter);
app.use('/scoket', wbrtcRouter);

app.listen(4000);