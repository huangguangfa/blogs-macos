export default class ContinuousEvent {
  flagNameList: {
    [key: string]: any;
  };
  constructor() {
    this.flagNameList = {};
  }
  checkDouble(flagName: string, fn: Function, time: number = 200) {
    if (this.flagNameList[flagName]) {
      fn();
      this.clearFlagTimer(flagName);
      this.deleteFlag(flagName);
    } else {
      this.flagNameList[flagName] = setTimeout(() => {
        this.deleteFlag(flagName);
      }, time);
    }
  }
  deleteFlag(flagName: string) {
    this.flagNameList[flagName] && delete this.flagNameList[flagName];
  }
  clearFlagTimer(flagName: string) {
    this.flagNameList[flagName] && clearTimeout(this.flagNameList[flagName]);
  }
}
