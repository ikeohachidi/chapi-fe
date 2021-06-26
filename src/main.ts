import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Route, NavigationGuardNext } from 'vue-router'

import './index.css';
import '@/scss/gg.scss';

Vue.config.productionTip = false

router.beforeEach(async (to: Route, from: Route, next: NavigationGuardNext) => {
  if (to.meta.requiresAuth) {
    if (store.state.user.user) {
      next();
      return
    }

    try {
      const response = await store.dispatch('user/fetchAuthUser')
      if (response) {
        next()
        return
      }
    } catch(err) {
      // TODO: do something with this
    }

    next({ path: from.path || '/' })
    return
  }

  next();
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
