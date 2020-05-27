import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import openLoginWindow from '../helpers/login';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: require('@/pages/Login').default,
      meta: {
        layout: 'minimal'
      }
    },
    {
      path: '/',
      name: 'landing-page',
      component: require('@/pages/LandingPage').default
    },
    {
      path: '/wiki',
      name: 'wiki',
      component: require('@/pages/wiki').default
    },
    {
      path: '/articles/:title',
      name: 'show-article',
      component: require('@/pages/wiki').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

// Auth guard
router.beforeEach((to, from, next) => {
  // if not logged in
  if (to.name !== 'login' && !store.state.App.auth.user) {
    openLoginWindow()
  } else {
    next()
  }
})

export default router;
