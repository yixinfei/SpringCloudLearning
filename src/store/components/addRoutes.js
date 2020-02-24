import ConvertRoutes from './convertRoutes'
import router from '../../router'

/**
 * 动态添加路由
 * author:qlx
 */
const addRoutes = {
  state: {
    rootRoute: [],
    routeParam: []//这里必须持久化参数,重新生成路由,因为里边的require方法没法持久化
  },
  getters: {
    rootRoute: state => {
      return state.rootRoute;
    }
  },
  mutations: {
    add_Routes(state, routeParam) {
      let routeList = [];
      //添加默认路由,新用户登陆可以显示首页
      routeList.push({
        name: 'index',
        path: '/index',
        component: () => import('@/components/index.vue'),
        meta: {
          title: '系统首页'
        }
      });


      let routeHideList = [];
      ConvertRoutes(routeList, routeHideList, routeParam); // 将后台的路由数据components转化成组件
      var rootRoute = [{
        path: '/',
        component: () => import('@/components/common/Home.vue'),
        meta: { title: 'home' },
        children: routeList
      }];
      //添加新窗口打开的页面
      if (routeHideList && routeHideList.length > 0) {
        rootRoute = rootRoute.concat(routeHideList);
      }
      //保存路由参数到store中
      //原数据
      state.routeParam = routeParam;
      //改后数据
      state.rootRoute = rootRoute;
      //动态添加路由
      router.addRoutes(rootRoute)
    },
    add_Routes_Fresh(state) {
      this.commit('add_Routes', state.routeParam)
    },
  },
  actions: {
    add_Routes({ commit }, routeParam) {
      commit('add_Routes', routeParam)
    },
    add_Routes_Fresh({ commit }) {
      commit('add_Routes_Fresh')
    }
  }
}
export default addRoutes