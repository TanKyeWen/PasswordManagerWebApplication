import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:'/vault',
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
    {
      path: '/vault',
      name: 'vault',
      component: () => import('../views/VaultView.vue'),
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: () => import('../views/SignInView.vue'),
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: () => import('../views/SignUpView.vue'),
    },
    {
      path: '/gen',
      name: 'passwordGen',
      component: () => import('../views/PasswordGenView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/passwordHealth',
      name: 'passwordHealth',
      component: () => import('../views/PasswordHealthView.vue'),
    },
    {
      path: '/auditTrail',
      name: 'auditTrail',
      component: () => import('../views/AuditTrailView.vue'),
    },
    {
      path: '/addCredential',
      name: 'addCredential',
      component: () => import('../views/AddCredentialView.vue'),
    },
    {
      path: '/credential/:id',
      name: 'credentialDetail',
      component: () => import('../views/CredentialDetailView.vue'),
    },
    {
      path: '/editCredential',
      name: 'editCredential',
      component: () => import('../views/EditCredentialView.vue'),
    },
  ],
})

export default router
