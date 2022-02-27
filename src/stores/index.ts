import { createStore } from 'vuex';
import * as getters from './getters.js'
import state from './state.js'
import mutations from "./mutations.js"

export default createStore({
    state,
    mutations,
    getters
})
