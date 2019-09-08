import axios from 'axios';
import { Loading,Message } from 'element-ui';
import router from './router'

var loading;
// 开始转圈
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '拼命加载中',
        background: 'rgba(0,0,0,.7)'
    });
}
// 停止转圈
function endLoading() {
    loading.close();
}
// 请求拦截
axios.interceptors.request.use(config => {
    // 加载转圈动画
    startLoading();
    // 
    if(localStorage.eleToken){
        // 设置统一的请求头
        config.headers.Authorization = localStorage.eleToken;
    }
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
})
// 相应拦截
axios.interceptors.response.use(response => {
    // 结束动画
    endLoading();
    return response;
}, error => {
    // 错误提醒
    endLoading();
    Message.error(error.response.data);
    // 获取错误状态码
    const { status } = error.response;
    if(status == 401 ){
        Message.error("登录过期了，请重新登录");
        localStorage.removeItem('eleToken');
        router.push('login');
    }
    return Promise.reject(error);
});

export default axios;