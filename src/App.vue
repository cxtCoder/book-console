<template>
    <div id="app" @mouseover="operatingWebsite">
        <router-view>
        </router-view>
    </div>
</template>

<script>
    import * as types from './store/types'
    import {mapState} from 'vuex'
    import api from './constant/api'
    const isOn = window.LOCAL_CONFIG.isloginTimeOut;
    const time = window.LOCAL_CONFIG.timeOut;

    export default {
        name: 'app',
        data (){
            return {
                lastTime: new Date().getTime(),  // 最后一次点击的时间
                currentTime: new Date().getTime(),  // 当前时间
                timeOut: time * 60 * 1000  // 超时时间
            } 
        },
        mounted () {
            if (isOn) {
                window.setInterval(this.checkStatus, 1000);
            }
        },
        computed: mapState({
            title: state => state.title,
            token: state => state.token
        }),
        methods: {
            operatingWebsite() {
                this.lastTime = new Date().getTime();
            },
            checkStatus() {
                this.currentTime = new Date().getTime();
                if (this.currentTime - this.lastTime > this.timeOut) {
                    if (sessionStorage.getItem('userName')) {
                        this.logout();
                        this.$alert('登录超时，请重新登录', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.$router.push({
                                    path: '/login'
                                })
                            }
                        });
                    }
                }
            },
            logout() {
                this.$store.commit(types.LOGOUT);
                sessionStorage.setItem("userName","");
                sessionStorage.setItem("token","");
                this.$store.commit("userName","");
                this.$cookieStore.delCookie('username');
            }
        }
    }
</script>