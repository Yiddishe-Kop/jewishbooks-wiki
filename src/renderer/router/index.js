import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import openLoginWindow from '../helpers/login';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: require('@/pages/Login').default,
      meta: {
        layout: 'minimal',
      },
    },
    {
      path: '/',
      name: 'home',
      component: require('@/pages/Home').default,
    },
    {
      path: '/articles/:title/:id',
      name: 'show-article',
      component: require('@/pages/Show').default,
    },
    {
      path: '/articles/:title/:id/edit',
      name: 'edit-article',
      component: require('@/pages/Edit').default,
    },
    {
      path: '/changes',
      name: 'changes',
      component: require('@/pages/Changes').default,
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/pages/Settings').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

// Auth guard
router.beforeEach((to, from, next) => {
  // if not logged in
  if (to.name !== 'login' && !store.state.App.auth.user) {
    openLoginWindow();
  } else {
    next();
  }
});

export default router;
