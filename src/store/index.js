import { createStore } from 'vuex';

export default createStore({
    state () {
        return {
            count: 0
        }
    },
    mutations: {
        increment (state) {
            state.count++
        }
    },
    getters: {
        count: (state) => state.count
    }
})
  