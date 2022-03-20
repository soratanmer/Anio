import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        name: 'home',
        path: '/',
        component: () => import('@/view/Home.vue'),
    },
    {
        name: 'explore',
        path: '/explore',
        component: () => import('@/view/Explore.vue'),
    },
    {
        name: 'library',
        path: '/library',
        component: () => import('@/view/Library.vue'),
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@/view/Login.vue'),
    },
    {
        name: '404',
        path: '/404',
        component: () => import('@/view/404.vue'),
    },
    {
        path: '/*',
        redirect: '/404',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
