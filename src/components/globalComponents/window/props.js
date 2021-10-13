export const props = {
    show: {
        type:Boolean,
        default:true
    },
    title:{
        type:String,
        default:'bar'
    },
    width:{
        type:[Number,String],
        default:635,
    },
    height:{
        type:[Number,String],
        default:400,
    },
    appInfo:{
        type:Object,
        default:{}
    }
}