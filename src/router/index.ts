import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { isLoggedIn } from '@/utils/user'

const routes: RouteRecordRaw[] = [
    {
        name: 'home',
        path: '/',
        component: () => import('@/view/Home.vue'),
        meta: {
            keepAlive: true,
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
        name: 'explore',
        path: '/explore',
        component: () => import('@/view/Explore.vue'),
        meta: {
            keepAlive: true,
        },
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
        name: 'album',
        path: '/album/:id',
        component: () => import('@/view/Album.vue'),
    },
    {
        name: 'artist',
        path: '/artist/:id',
        component: () => import('@/view/Artist.vue'),
    },
    {
        name: 'playlist',
        path: '/playlist/:id',
        component: () => import('@/view/Playlist.vue'),
    },
    {
        name: 'search',
        path: '/search',
        component: () => import('@/view/Search.vue'),
    },
    {
        name: 'history',
        path: '/history',
        component: () => import('@/view/History.vue'),
        meta: {
            keepAlive: true,
        },
    },
    {
        name: 'dailyTrack',
        path: '/dailyTrack',
        component: () => import('@/view/DailyTracks.vue'),
        meta: {
            keepAlive: true,
        },
    },
    {
        name: 'newSongs',
        path: '/newSongs',
        component: () => import('@/view/NewSongs.vue'),
        meta: {
            keepAlive: true,
        },
    },
    {
        name: 'nextSongs',
        path: '/nextSongs',
        component: () => import('@/view/NextSongs.vue'),
    },
    {
        name: 'settings',
        path: '/settings',
        component: () => import('@/view/Settings.vue'),
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
        if (to.path === '/login' && isLoggedIn()) {
            next({
                path: '/library',
            })
        } else {
            next()
        }
    }
})

export default router
