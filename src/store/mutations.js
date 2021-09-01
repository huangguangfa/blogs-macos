import {
    SET_WINDOW_ID,
    SET_FULL_SCREENBAR,
    SET_START_GLOBAL_SEARCH,
    SET_SYSTEM_MINIMIZE_LIST,
    SET_TABABR_NAVIGATION
} from "@/config/store.config.js";

const mutations = {
    [SET_WINDOW_ID](state,id) {
        state.WINDOWID = id;
    },
    [SET_FULL_SCREENBAR](state, status){
        state.FULLSCREENBAR = status;
    },
    [SET_START_GLOBAL_SEARCH](state, status){
        state.STARTGLOBALSEARCH = status;
    },
    [SET_SYSTEM_MINIMIZE_LIST](state, list){
        state.SYSTEMMINIMIZELIST = list;
    },
    [SET_TABABR_NAVIGATION](state, list){
        state.TABABR_NAVIGATION = list;
    }
}

export default mutations;