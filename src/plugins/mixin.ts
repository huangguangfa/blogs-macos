export function disableDevTool() {
  document.oncontextmenu = function () {
    return false;
  };
  document.onkeydown = function (event) {
    event.preventDefault();
  };
}
