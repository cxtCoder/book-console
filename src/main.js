import Vue from 'vue'
import axios from './http'
import store from './store/store'
import router from './router'
import App from './App.vue'
import VueMaterial from 'vue-material'
import './assets/js/jquery-1.9.1.min'
import ElementUI from 'element-ui'
import {setCookie,getCookie,delCookie} from './assets/js/cookie.js'
import echarts from 'echarts'
import VDistpicker from 'v-distpicker'
import {imageIsExist} from './utils/imgutil'
import {hex_md5} from './assets/js/md5.js'

Vue.prototype.$echarts = echarts

Vue.use(VueMaterial);
Vue.use(ElementUI);
Vue.prototype.$cookieStore = {
    setCookie,
    getCookie,
    delCookie
};
Vue.prototype.$md5 = {
    hex_md5
};

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios;

// 增加日期格式化方法
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

//全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
Vue.directive('real-img', async function (el, binding) {//指令名称为：real-img
    let imgURL = binding.value;//获取图片地址
    if (imgURL) {
        let exist = await imageIsExist(imgURL);
        if (exist) {
            el.setAttribute('src', imgURL);
        } 
    }
});

new Vue({
    el: '#app',
    axios,
    router,
    store,
    VDistpicker,
    render: h => h(App)
}).$mount('#app');
