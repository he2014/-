import Vue from 'vue'
import axios from 'axios'
// 上传文件修改axios默认的提交方式Request payload为：可以识别formData的格式
import Qs from 'qs';
import { Message } from 'element-ui'
// 响应时间
axios.defaults.timeout = 5 * 1000

Vue.prototype.sources = []
// 正式环境
// Vue.prototype.$baseUrl1 = 'http://39.106.43.93:9000' 
// Vue.prototype.$baseUrl2 = 'http://39.106.43.93:9010/' //新的模块接口

// 张岩环境
// Vue.prototype.$baseUrl1 = '//10.10.26.95:6071'
// upload baseurl 
Vue.prototype.$baseUrlUpload = '//124.42.103.167:8888/'
// Vue.prototype.$baseUrlUpload = 'http://10.10.32.164:6071/'
// Vue.prototype.$baseUrlUpload = '//10.10.26.118:6071'
// Vue.prototype.$baseUrl1 = '//10.10.26.118:6071'
// Vue.prototype.$baseUrl2 = 'http://47.94.143.244:9010'

// 测试：
Vue.prototype.$baseUrl1 = 'http://10.10.32.164:6071/'

// 开发环境
// Vue.prototype.$baseUrl1 = 'http://47.93.230.5:9000'
// Vue.prototype.$baseUrl2 = 'http://47.93.230.5:9010'

// var loadingInstance
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
    config => {
        // 统一封装每次进行请求数据时，执行element-ui的loading组件
        // loadingInstance = Loading.service({
        //     lock: true,
        //     text: '数据加载中，请稍后...',
        //     spinner: 'el-icon-loading',
        //     background: 'rgba(0, 0, 0, 0.7)'
        // })

        // 每次进入路由前清除之前的所有请求
        // config.cancelToken= new axios.CancelToken (function executor(c) {
        //   global.Cancel.push(c);
        // });
        return config
    },
    err => {
        // loadingInstance.close()
        Message.error('请求参数错误')
        return Promise.reject(err)
    }
)
// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
    res => {
        // console.log('res')
        return res
        // if (res.data.code === 0) {
        //     // 如果code码为0，代表成功，loading组件关闭
        //     // loadingInstance.close()
        //     return res
        // } else {
        //     // loadingInstance.close()
        //     Message.error(res.data.msg)
        // }
    },
    err => {
        // loadingInstance.close()
        Message.error('请求失败，请稍后再试')
        return Promise.reject(err)
    }
)
// 发送请求
export function fetchPost(url, params, port) {
    let token = sessionStorage.getItem('token')
    // 取消上一个页面的请求
    var CancelToken = axios.CancelToken;
    if (port == "port") {
        axios.defaults.baseURL = this.$baseUrl2
    } else {
        axios.defaults.baseURL = this.$baseUrl1
    }
    var token_ = new CancelToken(function executor(c) {
        // cancelToken
        Vue.prototype.sources.push(c)
        // source.push(c)
    })
    return new Promise((resolve, reject) => {
        axios
            .post(url, JSON.stringify(params), {
                headers: {
                    'Content-Type': 'application/json',
                    // 调用每个post接口时，向 header头添加 token
                    'X-Token': token
                }
            })
            .then(
                res => {
                    resolve(res.data)
                },
                err => {
                    reject(err.data)
                }
            )
            .catch(err => {
                reject(err.data)
            })
    }, {
            cancelToken: token_,
        })
}
// 发送请求-上传文件-post表单格式
export function fetchPostUpload(url, params, port) {
    let token = sessionStorage.getItem('token')
    // 取消上一个页面的请求
    var CancelToken = axios.CancelToken;
    if (port == "port") {
        axios.defaults.baseURL = this.$baseUrl2
    } else {
        axios.defaults.baseURL = this.$baseUrl1
    }
    var token_ = new CancelToken(function executor(c) {
        // cancelToken
        Vue.prototype.sources.push(c)
        // source.push(c)
    })
    return new Promise((resolve, reject) => {
        axios
            .post(url, Qs.stringify(params), {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 调用每个post接口时，向 header头添加 token
                    'X-Token': token
                }
            })
            .then(
                res => {
                    resolve(res.data)
                },
                err => {
                    reject(err.data)
                }
            )
            .catch(err => {
                reject(err.data)
            })
    }, {
            cancelToken: token_,
        })
}
// export function fetchPostJson(url, params) {
//     return new Promise((resolve, reject) => {
//         axios
//             .post(url, params)
//             .then(
//                 res => {
//                     resolve(res.data)
//                 },
//                 err => {
//                     reject(err.data)
//                 }
//             )
//             .catch(err => {
//                 reject(err.data)
//             })
//     })
// }


export function fetchGet(url, params, port) {
    let token = sessionStorage.getItem('token')
    if (port == "port") {
        axios.defaults.baseURL = this.$baseUrl2
    } else {
        axios.defaults.baseURL = this.$baseUrl1
    }
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    // 调用每个post接口时，向 header头添加 token
                    'X-Token': token
                }
            })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}