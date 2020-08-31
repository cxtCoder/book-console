/**
 * Created by superman on 17/2/16.
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/store'
import * as types from './store/types'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: '/',
        component: require( './login.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: require('./login.vue')
    },
    {
        path: '/html/report',
        meta: {
            requireAuth: true,
        },
        component: require( './index.vue'),
        children: [{
            path: 'dashboard',
            meta: {
                requireAuth: true,
            },
            component: require('./views/html/report/dashboard.vue')
        }]
    },
    {
        path: '/html/book',
        meta: {
            requireAuth: true,
        },
        component: require( './index.vue'),
        children: [{
            path: 'books-ws',
            meta: {
                requireAuth: true,
            },
            component: require('./views/html/book/books-ws.vue')
        },{
            path: 'books-zs',
            meta: {
                requireAuth: true,
            },
            component: require('./views/html/book/books-zs.vue')
        },{
            path: 'books-wx',
            meta: {
                requireAuth: true,
            },
            component: require('./views/html/book/books-wx.vue')
        }, {
            path: 'books-ls',
            meta: {
                requireAuth: true,
            },
            component: require('./views/html/book/books-ls.vue')
        }, {
            path:'books-gj',
            meta: {
                requireAuth: true,
            },
            component: require('./views/html/book/books-gj.vue')
        },{
            path:'books-qt',
            meta: {
                requireAuth: true,
            },
            component: require('./views/html/book/books-qt.vue')
        }]
    },
    {
        path: '/html/painting',
        meta: {
            requireAuth: true,
        },
        component: require( './index.vue'),
        children: [{
            path:'celebrity_painting',
            meta: {
                requireAuth: true,
            },
            component: require('./views/html/painting/celebrity_painting.vue')
        }]
    },
    {
        path: '/html/relic',
        meta: {
            requireAuth: true,
        },
        component: require( './index.vue'),
        children: [{
            path:'historical_relic',
            meta: {
                requireAuth: true,
            },
            component: require('./views/html/relic/historical_relic.vue')
        }]
    },
    {
        path: '/html/manage',
        meta: {
            requireAuth: true,
        },
        component: require( './index.vue'),
        children: [{
            path:'user_manage',
            meta: {
                requireAuth: true,
            },
            component: require('./views/html/manage/user_manage.vue')
        },{
            path:'classify_manage',
            meta: {
                requireAuth: true,
            },
            component: require('./views/html/manage/classify_manage.vue')
        }]
    }
];

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
    store.commit(types.LOGIN, window.localStorage.getItem('token'))
}

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (window.localStorage.getItem('token')) {
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }
    }
    else {
        next();
    }
});

export default router;