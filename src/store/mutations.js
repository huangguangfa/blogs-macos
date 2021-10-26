import {
    SET_WINDOW_ID,
    SET_FULL_SCREENBAR,
    SET_START_GLOBAL_SEARCH,
    SET_TABABR_NAVIGATION,
    SET_SYSTEM_CONFIG,
    SET_TABABR_MINIMIZE
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
    [SET_TABABR_MINIMIZE](state, list){
        state.TABABR_MINIMIZE = list;
    },
    [SET_TABABR_NAVIGATION](state, { _index, dockData }){
        for(let key in dockData){
            let value = dockData[key]
            state.TABABR_NAVIGATION[_index][key] = value;
        }
    },
    [SET_SYSTEM_CONFIG](state, data){
        state.SYSTEM_CONFIG = data;
    }
}

export default mutations;