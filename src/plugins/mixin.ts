export function disableDevTool() {
  document.oncontextmenu = function () {
    return false;
  };
  document.onkeydown = function (event) {
    const { code } = event;
    if (["F12"].includes(code)) {
      event.preventDefault();
    }
  };
}

export function gflogs() {
  const style = `background:red; color:yellow;font-family:"楷体";font-size:20px;`;
  const style2 = `color:yellow`;
  const title_style = `background:red; color:yellow;font-family:"楷体";font-size:24px;font-weight:900;`;
  console.log("%c     立     马      上      线        ", title_style);
  console.log(
    "%c 这 %c                              %c 原 ",
    style,
    style2,
    style
  );
  console.log(
    "%c 个 %c                              %c 理 ",
    style,
    style2,
    style
  );
  console.log(
    "%c 其 %c                              %c 细 ",
    style,
    style2,
    style
  );
  console.log(
    "%c 实 %c                              %c 节 ",
    style,
    style2,
    style
  );
  console.log(
    "%c 很 %c                              %c 我 ",
    style,
    style2,
    style
  );
  console.log(
    "%c 简 %c                              %c 不 ",
    style,
    style2,
    style
  );
  console.log(
    "%c 单 %c                              %c 管 ",
    style,
    style2,
    style
  );
  console.log("个人学习网站、作者很喜欢coding、欢迎技术交流！");
}
