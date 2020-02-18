import Vue from 'vue'
import App from './App.vue'
//路由
import router from './router'
//针对内核版本低于es6的浏览器
import 'babel-polyfill'
//vuex
import Vuex from 'vuex'
//axios配置
import  './request/api'
//引入elementUI样式框架
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//是否是生产环境  开发环境会多数出内容
//Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(Vuex);



new Vue({
  el: '#app',
  router,
  //  store,
  render: h => h(App)
})
