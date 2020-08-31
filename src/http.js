/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios'
import store from './store/store'
import * as types from './store/types'
import router from './router'
import api from './constant/api'

// axios 配置
axios.defaults.timeout = 300000;
// axios.defaults.baseURL = api.baseUrl;
axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Authorization'] = "123";
 axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=UTF-8';

// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (store.state.token) {
            // config.headers.Authorization = `token ${store.state.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                    store.commit(types.LOGOUT);
                    router.replace({
                        path: '/login',
                        query: {redirect: router.currentRoute.fullPath}
                    });
                case 500:

            }
        }
        if(error.response){
            return Promise.reject(error.response.data);
        } else {
            return Promise.reject(error.message);
        }
    });

export default axios;
