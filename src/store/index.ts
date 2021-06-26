import Vue from 'vue'
import Vuex from 'vuex'

import project from './modules/project';
import proxy from './modules/proxy';
import user from './modules/user';
import StoreState from './storeState';

Vue.use(Vuex)

export default new Vuex.Store<StoreState>({
  modules: {
    user,
    project,
    proxy
  }
})
