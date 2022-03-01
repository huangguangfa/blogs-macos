
type MapType<T> = {
    [Key in keyof T]: [T[Key], T[Key], T[Key]]
}

type objs = {
    name:string,
    age:number
}


function test(params:objs):MapType<objs> {
    let obj:objs = {
        name:'',
        age:0
    }
    for(let key in params){
        obj[key] = Array(3).fill(params[key]);
    }
    
    return {
        name:['张三','张三','张三'],
        age:[1,1,1]
    }
}