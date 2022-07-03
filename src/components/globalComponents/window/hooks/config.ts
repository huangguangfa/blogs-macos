//八点拖拽点计算规则
export const sticksRule = {
  //left
  tl: {
    dir: "X",
    computedX: (value: number) => -1 * value,
  },
  //top
  tm: {
    dir: "Y",
    computedY: (value: number) => -1 * value,
  },
  //right
  tr: {
    dir: "X",
    computedX: (value: number) => 1 * value,
  },
  //bottom
  mr: {
    dir: "Y",
    computedY: (value: number) => 1 * value,
  },
  // top + left
  br: {
    dir: "XY",
    computedX: (value: number) => -1 * value,
    computedY: (value: number) => -1 * value,
    isChangePositionX: true,
    isChangePositionY: true,
  },
  // top + right
  bm: {
    dir: "XY",
    computedY: (value: number) => -1 * value,
    computedX: (value: number) => 1 * value,
    isChangePositionY: true,
  },
  // left + bottom
  bl: {
    dir: "XY",
    computedX: (value: number) => -1 * value,
    computedY: (value: number) => 1 * value,
    isChangePositionX: true,
  },
  //right/bottom
  ml: {
    dir: "XY",
    computedX: (value: number) => 1 * value,
    computedY: (value: number) => 1 * value,
  },
};

export const statusList = [
  { icon: "macos-shanchu", className: "" },
  { icon: "macos-jian", className: "remove-round" },
  { icon: "macos-quanping", className: "fullscreen-round" },
];

//初始化Window
export function initWindowStatus(dom: Element, width: number, height: number) {
  let web_width = window.screen.width;
  let web_height = window.screen.height;
  let domW = Number(width);
  let domH = Number(height);
  if (!(domW && domH)) return;
  let newStyle = `left:${(web_width - domW) / 2}px;top:${
    (web_height - domH) / 2 - 100
  }px;width:${domW}px;height:${domH}px;display: none;`;
  //初始化元素居中
  dom.setAttribute("style", newStyle);
}
//鼠标松开、清除状态
export function mouseups(pageConfig: any, iframeId: string) {
  let iframe = document.getElementById(iframeId) as any;
  iframe && (iframe.style["pointer-events"] = "auto");
  pageConfig.winBarConfig.winBarStart = false;
  pageConfig.sticksConfig.sticksStart = false;
}
export function documentMoves(windom: HTMLElement, ev: any, pageConfig: any) {
  const { clientY, clientX, pageX, pageY } = ev;
  let web_width = document.body.offsetWidth;
  const { winBarStart, disX, disY } = pageConfig.winBarConfig;
  const { sticksStart, pointerX, pointerY, sticksType } =
    pageConfig.sticksConfig;
  //窗口移动
  if (winBarStart) {
    let dom_width = windom.offsetWidth;
    let currenrLeft = parseInt(windom.style.left);
    //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    let left = clientX - disX;
    let top = clientY - disY;
    top = top < 0 ? 0 : top;
    let letf_boundary = parseInt(String((dom_width / 5) * 4));
    //不可移动的距离、左右不可超5/4
    if (-letf_boundary > left || left + dom_width > web_width + letf_boundary) {
      left = currenrLeft;
    }
    windom.style.left = left + "px";
    windom.style.top = top + "px";
  }
  //边框拖动
  if (sticksStart) {
    const {
      dir,
      computedX,
      computedY,
      isChangePositionX,
      isChangePositionY,
    }: any = sticksRule[sticksType as keyof typeof sticksRule];
    const { defaultWidth, defaultHeight } = pageConfig;
    const winLeft = parseInt(windom.style.left);
    const winTop = parseInt(windom.style.top);
    // left/right
    if (["X", "XY"].includes(dir)) {
      const computedChangeValue = computedX(parseInt(String(pageX - pointerX)));
      let widthX = computedChangeValue + windom.offsetWidth;
      windom.style.width =
        (widthX < defaultWidth ? defaultWidth : widthX) + "px";
      if (widthX > defaultWidth && (sticksType === "tl" || isChangePositionX)) {
        windom.style.left = winLeft - computedChangeValue + "px";
      }
      pageConfig.sticksConfig.pointerX = pageX;
    }
    // top/bottom
    if (["Y", "XY"].includes(dir)) {
      const computedChangeValue = computedY(parseInt(String(pageY - pointerY)));
      let heightY = computedChangeValue + windom.offsetHeight;
      windom.style.height =
        (heightY < defaultHeight ? defaultHeight : heightY) + "px";
      pageConfig.sticksConfig.pointerY = pageY;
      if (
        heightY > defaultHeight &&
        (sticksType === "tm" || isChangePositionY)
      ) {
        windom.style.top = winTop - computedChangeValue + "px";
      }
    }
  }
}

export const windowTbarConfig = {
  0: {
    type: "close",
    status: false,
  },
  1: {
    type: "activeClose",
    status: true,
  },
  2: {
    type: "fullScreen",
    status: true,
  },
};
