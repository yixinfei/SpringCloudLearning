import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/login',
            component: () => import('@/components/login'),
            meta: {
                title: '登陆'
            }
        },
        {
            path: '/404',
            component: () => import('@/components/common/404'),

        },
        {
            path: '/403',
            component: () => import('@/components/common/403'),

        },
        {
            path: '*',
            redirect: '/404'
        }
    ],
    mode: 'history'
});





//全局路由守卫
router.beforeEach((to, from, next) => {
    
    //debugger
    console.log('跳转到:', to.fullPath);
    var token = sessionStorage.getItem('token');
    //如果没登录,都导向登录页
    if (!token) {
        if (to.path !== '/login') {
            next('/login')
        }
        else {
            next();
        }
    }
    else {
        next();
    }

})

export default router