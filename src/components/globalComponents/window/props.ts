// function getDefaultHeight() {
//   const screenHeight =
//     window.innerHeight ||
//     document.documentElement.clientHeight ||
//     document.body.clientHeight;
//   return screenHeight - 300;
// }

export const propsOption = {
  show: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "bar",
  },
  width: {
    type: [Number, String],
    default: 635,
  },
  height: {
    type: [Number, String],
    default: 400,
  },
  appInfo: {
    type: Object,
    default: {},
  },
};
