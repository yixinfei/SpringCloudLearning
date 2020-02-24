// 在http.js中引入axios
import Vue from 'vue'
import axios from 'axios'; // 引入axios
import Qs from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
import { Message } from 'element-ui';

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
       
        if (
            config.method.toLocaleUpperCase() === 'POST' ||
            config.method.toLocaleUpperCase() === 'PUT' ||
            config.method.toLocaleUpperCase() === 'DELETE' ||
            config.method.toLocaleUpperCase() === 'OPTIONS' 
           
        ) {
            console.log(config.data)
            console.log(config)
            for(var key in config.data){
                if(config.data[key] instanceof File){
                      let formdata = new FormData();
                      for(var key1 in config.data){
                        formdata.append(key1, config.data[key1]);
                      }
                      config.data =formdata;
                   //   config.headers['Content-Type']="multipart/form-data";
                    break;
                }
                if(config.data[key] instanceof Array){
                        console.log("是数组")
                      let formdata = new URLSearchParams();
                      for(var key2 in config.data){
                        formdata.append(key2, config.data[key2]);
                      }
                      config.data =formdata;
                    break;
                }
               
            }
            if(!(config.data instanceof URLSearchParams) && !(config.data instanceof FormData)){
                config.data = Qs.stringify(config.data)
            }
        }
        // 手动为 axios 的请求，追加 Authorization 请求头
        if (null !== window.sessionStorage.getItem('token')) {
            config.headers.token = window.sessionStorage.getItem('token')
        }
        console.log(config)
        return config;
    },
    error => {
        console.log("出错");
        return Promise.error(error);
    })
//响应拦截器
axios.interceptors.response.use(config => {
    console.log(config.data)
    return config.data
}, error => {
    if (error && error.response) {
        return error.response.data;
    }
    const data = { meta: { msg: '连接服务器失败', status: 503 }, data: {} }
  //  Message.error(data.meta.msg)
    return data;
})
//添加全局引用this.$http
Vue.prototype.$http = axios