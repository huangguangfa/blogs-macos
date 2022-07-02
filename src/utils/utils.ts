import { DATA_REGEX_PATTERN } from "@/config";

//获取随机手机号
export function getRandomMoble(): string {
  let prefixArray = new Array(
    "130",
    "131",
    "132",
    "133",
    "135",
    "137",
    "138",
    "170",
    "187",
    "189"
  );
  let i = Math.floor(10 * Math.random());
  let prefix = prefixArray[i];
  for (let j = 0; j < 8; j++) {
    prefix = prefix + Math.floor(Math.random() * 10);
  }
  return prefix;
}

/*
 *@param Number NameLength 随机获取名字
 */
export function getRandomName(): string {
  let index: number = Math.floor(Math.random() * (136 - 0)) + 0;
  let names: string[] = [
    "宋江",
    "卢俊义",
    "吴用",
    "公孙胜",
    "关胜",
    "林冲",
    "秦明",
    "呼延灼",
    "花荣",
    "柴进",
    "李应",
    "朱仝",
    "鲁智深",
    "武松",
    "董平",
    "张清",
    "杨志",
    "徐宁",
    "索超",
    "戴宗",
    "刘唐",
    "李逵",
    "史进",
    "穆弘",
    "雷横",
    "李俊",
    "阮小二",
    "张横",
    "阮小五",
    "张顺",
    "阮小七",
    "杨雄",
    "石秀",
    "解珍",
    "解宝",
    "燕青",
    "朱武",
    "黄信",
    "孙立",
    "宣赞",
    "郝思文",
    "韩滔",
    "彭玘",
    "单廷圭",
    "魏定国",
    "萧让",
    "裴宣",
    "欧鹏",
    "邓飞",
    "燕顺",
    "杨林",
    "凌振",
    "蒋敬",
    "吕方",
    "郭盛",
    "安道全",
    "皇甫端",
    "王英",
    "扈三娘",
    "鲍旭",
    "樊瑞",
    "孔明",
    "孔亮",
    "项充",
    "李衮",
    "金大坚",
    "马麟",
    "童威",
    "童猛",
    "孟康",
    "侯健",
    "陈达",
    "杨春",
    "郑天寿",
    "陶宗旺",
    "宋清",
    "乐和",
    "龚旺",
    "丁得孙",
    "穆春",
    "曹正",
    "宋万",
    "杜迁",
    "薛永",
    "李忠",
    "周通",
    "汤隆",
    "杜兴",
    "邹渊",
    "邹润",
    "朱贵",
    "朱富",
    "施恩",
    "蔡福",
    "蔡庆",
    "李立",
    "李云",
    "焦挺",
    "石勇",
    "孙新",
    "顾大嫂",
    "张青",
    "孙二娘",
    "王定六",
    "郁保四",
    "白胜",
    "时迁",
    "段景住",
    "奥特之父",
    "奥特之母",
    "奥特之王",
    "佐菲",
    "初代",
    "赛文",
    "杰克",
    "艾斯",
    "泰罗",
    "雷欧",
    "阿斯特拉",
    "爱迪",
    "尤利安",
    "葛雷",
    "帕瓦特",
    "斯科特",
    "乔尼亚斯",
    "迪迦",
    "盖亚",
    "戴拿",
    "奈克瑟斯",
    "雷杰多",
    "哉阿斯",
    "高斯",
    "麦克斯",
    "诺亚",
    "杰斯提斯",
    "奈欧斯",
  ];
  return names[index];
}

/*
 *@param Number NameLength 随机获取头像
 */
export function getRandomuAvatar() {
  let index = Math.floor(Math.random() * (20 - 0)) + 0;
  return `https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/generateAvatar/${index}.png`;
}

/*
 * methods 深拷贝
 *@param source 拷贝对象
 */
type _typeObj = { [anyKey: string]: any };
export function deepClone(source: _typeObj): _typeObj {
  const targetObj: _typeObj = source.constructor === Array ? [] : {};
  for (let keys in source) {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  }
  return targetObj;
}

// 生成随机数
export const randomNum = function (minNum: number, maxNum: number): number {
  switch (arguments.length) {
    case 1:
      return Math.floor(Math.random() * minNum + 1);
      break;
    case 2:
      return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
      break;
    default:
      return 0;
      break;
  }
};

/**
 * @method 高亮显示文本(常用于关键字搜索)
 * @param {String} str 需要进行高亮处理的文本
 * @param {String} keyword 高亮的关键字
 */
export const highlight = (str: string, keyword: string, color = "#5cc24c") => {
  const transform = keyword.replace(DATA_REGEX_PATTERN.highlight, "\\$&");
  const reg = new RegExp(transform, "gi");
  if (str) {
    return str.replace(
      reg,
      (text) => `<span style="color:${color}">${text}</span>`
    );
  }
};
