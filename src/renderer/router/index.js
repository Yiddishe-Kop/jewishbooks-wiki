import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
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
