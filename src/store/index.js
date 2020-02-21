import modules from './modules'
import VuexPersistence from 'vuex-persist'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


//数据持久化 存放在sessionStorage中
const vuexLocal = new VuexPersistence({
    storage: window.sessionStorage
}) 

const store = new Vuex.Store({
    modules,
    //持久化方法
    plugins: [vuexLocal.plugin],
})
//刷新加载的方法
const refresh=function(){
    //页面刷新重新加载路由
//    store.dispatch('add_Routes_Fresh');
}
//console.log("页面刷新,刷入路由");
//refresh();
export default store;