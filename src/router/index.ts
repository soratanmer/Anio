import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { isLoggedIn } from '@/utils/cookie'

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
        meta: {
            requireLogin: true,
        },
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@/view/Login.vue'),
        meta: {
            isLoggedIn: true,
        },
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

router.beforeEach((to, from, next) => {
    if (to.meta.requireLogin) {
        if (isLoggedIn()) {
            next()
        } else {
            next({
                path: '/login',
            })
        }
    } else {
        next()
    }
})

export default router
