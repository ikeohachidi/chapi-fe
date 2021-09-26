import Vue from 'vue'
import Vuex from 'vuex'

import project from './modules/project';
import route from './modules/route';
import user from './modules/user';
import StoreState from './storeState';

Vue.use(Vuex)

export default new Vuex.Store<StoreState>({
  modules: {
    user,
    project,
    route
  }
})
