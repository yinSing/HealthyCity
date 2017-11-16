import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
  	// 登录-login
    {
      path: '/',
      name: 'login',
      component: resolve => require(['@/spaPages/login/login.vue'], resolve)
    },

    // 平台--mainPlatform
    {
    	path: '/main',
    	name: 'mainPat',
    	component: resolve => require(['@/spaPages/main-page/main-platform.vue'], resolve)
    }
  ]//Routes
})
