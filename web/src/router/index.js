import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "reset",
      path: "/reset-password",
      props: route => ({
        token: route.query.token,
        id: route.query.id
      }),
      component: () => import("./../views/ResetView.vue")
    }
  ],
})

export default router
