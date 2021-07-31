import { createStore } from 'vuex';

export default createStore({
    state () {
        return {
            WINDOWID:null
        }
    },
    mutations: {
        SET_WINDOWID(state,id) {
            state.WINDOWID = id;
        }
    },
    getters: {
        windowId: (state) => state.windowId
    }
})
  