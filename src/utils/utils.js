
//获取随机手机号
export function getRandomMoble() {
    let prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
    let i = parseInt(10 * Math.random());
    let prefix = prefixArray[i];
    for (let j = 0; j < 8; j++) {
        prefix = prefix + Math.floor(Math.random() * 10);
    }
    return prefix;
}


function randomAccess(min,max){
	return Math.floor(Math.random() * (min - max) + max)
}

// 解码
function decodeUnicode(str) {
   //Unicode显示方式是\u4e00
   str = "\\u"+str
   str = str.replace(/\\/g, "%");
    //转换中文
   str = unescape(str);
    //将其他受影响的转换回原来
   str = str.replace(/%/g, "\\");
   return str;
}

/*
*@param Number NameLength 要获取的名字长度
*/
export function getRandomName(NameLength = 2){
	let name = ""
	for(let i = 0;i<NameLength;i++){
		let unicodeNum  = ""
		unicodeNum = randomAccess(0x4e00,0x9fa5).toString(16)
		name += decodeUnicode(unicodeNum)
	}
	return name
}