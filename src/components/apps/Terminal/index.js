import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach'
import axios from "axios";
const socketURL = "ws://106.54.70.48:4000/socket/";
const xtermConfig = {
    cols: 92,
    rows: 22,
    cursorBlink: true, // 光标闪烁
    cursorStyle: "bar", // 光标样式  null | 'block' | 'underline' | 'bar'
    scrollback: 800, //回滚
    tabStopWidth: 8, //制表宽度
    screenKeys: true//
}
let xterms = null;
const getSysId = async () => await axios .post("http://106.54.70.48:4000/terminal").then((res) => res.data) .catch((err) => { throw new Error(err); });
export async function initXterm(){
    xterms = new Terminal(xtermConfig);
    let terminalContainer = document.getElementById('xterm');
    xterms.open(terminalContainer,true);
    xterms.writeln('\x1b[32m Welcome to gf cloud!!!\x1b[0m');
    xterms.writeln('');
    xterms.writeln('\x1B[1;3;31m个人五毛钱服务器、我相信你不会乱搞!!!\x1B[0m');
    xterms.writeln('');
    const pid = await getSysId(),
          ws = new WebSocket(socketURL + pid),
          attachAddon = new AttachAddon(ws);
    xterms.loadAddon(attachAddon);
}   