import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { 
    path: '/', 
    name: 'Home', 
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    children: [
      {
        path: 'proxy',
        name: 'Proxy',
        component: () => import(/* webpackChunkName: "proxy" */ '../views/Proxy.vue'),
      },
      {
        path: 'proxies-list',
        name: 'Proxies List',
        component: () => import(/* webpackChunkName: "proxies" */ '../views/ProxyList.vue'),
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
