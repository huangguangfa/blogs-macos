import { createStore } from 'vuex';

export default createStore({
    state () {
        return {
            WINDOWID:null,   //当前窗口ID
            FULLSCREENBAR:false, //是否全屏以及显示bar和最顶部topbar
            STARTGLOBALSEARCH:false , //开启全局搜索
        }
    },
    mutations: {
        SET_WINDOWID(state,id) {
            state.WINDOWID = id;
        },
        SET_FULLSCREENBAR(state, status){
            state.FULLSCREENBAR = status;
        },
        SET_STARTGLOBALSEARCH(state, status){
            state.STARTGLOBALSEARCH = status;
        }
    },
    getters: {
        WINDOWID: state => state.windowId,
        FULLSCREENBAR: state => state.FULLSCREENBAR,
        STARTGLOBALSEARCH:state => state.STARTGLOBALSEARCH
    }
})
  