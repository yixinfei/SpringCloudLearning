// 在http.js中引入axios
import Vue from 'vue'
import axios from 'axios'; // 引入axios
import Qs from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
import { Message } from 'element-ui';

//前置路径
const devlUrl = 'http://localhost/';
const testUrl = 'https://www.baidu.com';
const localUrl = 'https://www.baidu.com';

// 环境的切换
if (process.env.NODE_ENV == 'production') {
    if (process.env.VUE_APP_FLAG == 'pro') {
        //生产环境
        axios.defaults.baseURL = localUrl;
    } else {
        //测试环境
        axios.defaults.baseURL = testUrl;
    }
} else {
    //开发环境
    axios.defaults.baseURL = devlUrl;
}
//请求超时时间
axios.defaults.timeout = 10000;



// 请求拦截器
axios.interceptors.request.use(
    config => {
        console.log(config);
        if (
            config.method.toLocaleUpperCase() === 'POST' ||
            config.method.toLocaleUpperCase() === 'PUT' ||
            config.method.toLocaleUpperCase() === 'DELETE' ||
            config.method.toLocaleUpperCase() === 'OPTIONS'
        ) {
            config.data = Qs.stringify(config.data)
        }
        // 手动为 axios 的请求，追加 Authorization 请求头
        if (null !== window.sessionStorage.getItem('token')) {
            config.headers.token = window.sessionStorage.getItem('token')
        }
        return config;
    },
    error => {
        console.log("出错");
        return Promise.error(error);
    })
//响应拦截器
axios.interceptors.response.use(config => {
    return config.data
}, error => {
    if (error && error.response) {
        return error.response;
    }
    const data = { meta: { msg: '连接服务器失败', status: 503 }, data: {} }
    return data;
})
//添加全局引用this.$http
Vue.prototype.$http = axios