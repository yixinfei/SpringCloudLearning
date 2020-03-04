// 在http.js中引入axios
import Vue from 'vue'
import axios from 'axios'; // 引入axios
import Qs from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到

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
        if (config.method.toLocaleUpperCase() === 'GET') {
            for (var key4 in config.params) {
                //如果有文件的处理
                if (config.params[key4] instanceof Array) {
                    let formdata = new URLSearchParams();
                    for (var key3 in config.params) {
                        formdata.append(key3, config.params[key3]);
                    }
                    config.params = formdata;
                    break;
                }
            }
        }
        if (
            config.method.toLocaleUpperCase() === 'POST' ||
            config.method.toLocaleUpperCase() === 'PUT' ||
            config.method.toLocaleUpperCase() === 'DELETE' ||
            config.method.toLocaleUpperCase() === 'OPTIONS'
        ) {
            for (var key in config.data) {
                //如果有文件的处理
                if (config.data[key] instanceof File) {
                    let formdata = new FormData();
                    for (var key1 in config.data) {
                        formdata.append(key1, config.data[key1]);
                    }
                    config.data = formdata;
                    break;
                }
                //如果有数组的处理
                if (config.data[key] instanceof Array) {
                    let formdata = new URLSearchParams();
                    for (var key2 in config.data) {
                        formdata.append(key2, config.data[key2]);
                    }
                    config.data = formdata;
                    break;
                }
            }
            //之外的处理
            if (!(config.data instanceof URLSearchParams) && !(config.data instanceof FormData)) {
                config.data = Qs.stringify(config.data)
            }
        }
        // 手动为 axios 的请求，追加 token 请求头
        if (null !== window.sessionStorage.getItem('token')) {
            config.headers.token = window.sessionStorage.getItem('token')
        }
        console.log("config", config)
        return config;
    },
    error => {
        return Promise.error(error);
    })

function refreshToken() {
    // instance是当前request.js中已创建的axios实例
    return axios.create({
        baseURL: axios.defaults.baseURL,
        timeout: 300000,
        headers: {
            'Content-Type': 'application/json',
            'token': window.sessionStorage.getItem("refreshToken")// headers塞token
        }
    }).post('login/refreshToken', { refreshToken: window.sessionStorage.getItem("refreshToken") }).then(res => res.data)
}

// 创建一个axios实例
let instance = axios.create({
    baseURL: axios.defaults.baseURL,
    timeout: 300000,
    headers: {
        'Content-Type': 'application/json',
        'token': window.sessionStorage.getItem('refreshToken')
    }
})

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []
//响应拦截器
axios.interceptors.response.use(response1 => {

    if (response1.data.meta.status === 401) {
        const config = response1.config
        if (!isRefreshing) {
            isRefreshing = true
            return refreshToken().then(res => {
                const { token, refreshToken } = res.data
                if (res.meta.status === 401) {
                    window.location.href = '/login'
                }
                window.sessionStorage.setItem("token", token)
                window.sessionStorage.setItem("refreshToken", refreshToken)
                requests.forEach(cb => cb(token))
                requests = []
                return new Promise((resolve) => {
                    config.headers['token'] = token
                    resolve(instance(config))
                }).then(res =>
                    res.data)
            }).catch(res => {
                window.location.href = '/login'
            }).finally(() => {
                isRefreshing = false
            })
        } else {
            return new Promise((resolve) => {
                requests.push((token) => {
                    config.headers['token'] = token
                    resolve(instance(config))
                })
            }).then(res =>
                res.data)
        }
    }
    return response1.data
}, error => {
    if (error && error.response) {
        return error.response.data;
    }
    const data = { meta: { msg: '连接服务器失败', status: 503 }, data: {} }
    return data;
})
//添加全局引用this.$http
Vue.prototype.$http = axios