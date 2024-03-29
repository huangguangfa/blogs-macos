import { Terminal } from "xterm";
import { getTtermId } from "@/services/api/xterm";
import { AttachAddon } from "./xterm-addon-attach";
const xtermConfig: any = {
  cols: 92,
  rows: 22,
  cursorBlink: true, // 光标闪烁
  cursorStyle: "bar", // 光标样式  null | 'block' | 'underline' | 'bar'
  scrollback: 800, //回滚
  tabStopWidth: 8, //制表宽度
  screenKeys: true, //
};
let xterms: any = null;
const getSysId = async () =>
  await getTtermId().catch((err) => {
    throw new Error(err);
  });
export async function initXterms(ws: WebSocket) {
  xterms = new Terminal(xtermConfig);
  let terminalContainer = document.getElementById("xterm");
  xterms.open(terminalContainer, true);
  const initXtermTextList = [
    "\x1b[32m Welcome to gf cloud!!!\x1b[0m",
    "\x1B[1;3;31m个人五毛钱服务器、我相信你不会乱搞!!!\x1B[0m",
    "",
    "[root@VM-0-8-centos ~]# ",
    "",
  ];
  initXtermTextList.forEach((text) => xterms.writeln(text));

  let attachAddon = new AttachAddon(ws);
  xterms.loadAddon(attachAddon);
}
