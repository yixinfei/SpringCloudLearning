import Vue from 'vue'
import App from './App.vue'
//路由
import router from './router'
//针对内核版本低于es6的浏览器
import 'babel-polyfill'
//vuex配置
import store from './store'
//axios配置
import  './request/api'
//引入elementUI样式框架
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/element-variables.scss'



Vue.use(ElementUI);
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
