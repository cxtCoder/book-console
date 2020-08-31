<template>
    <div>
        <div class="login-bg"></div>
        <div class="login">
            <div class="hd">
                <h1>文史资料管理系统</h1>
            </div>
            <div class="bd" v-show="loginShow">
                <div>
                    <div class="line">
                        <input class="form-control" type="text" v-model="username" placeholder="用户名"/>
                    </div>
                    <div class="line">
                        <input class="form-control" type="password" v-model="password" placeholder="密码" @keyup.enter="login"/>
                    </div>
                    <div class="line" v-on:mouseenter="onMouseOver" v-on:mouseleave="onMouseOut">
                        <div class="alert alert-danger error" v-show="msgShow">
                            <span class="glyphicon glyphicon-info-sign">{{errMsg}}</span>
                        </div>
                        <button class="btn btn-primary" style="width:54px;" v-on:click="login">登录</button>
                        <a class="link-register" v-on:click="registerPage">注册</a>
                        <a class="link-register" v-show="editPasswordShow" v-on:click="updatePasswordPage">修改密码</a>
                    </div>
                </div>
            </div>
            <div class="bd" v-show="registerShow">
                <div>
                    <div class="line">
                        <input class="form-control" type="text" v-model="username" placeholder="用户名"/>
                    </div>
                    <div class="line">
                        <input class="form-control" type="password" v-model="password" placeholder="密码"/>
                    </div>
                    <div class="line">
                        <input class="form-control" type="password" v-model="rePassword" placeholder="重新输入密码"/>
                    </div>
                    <div class="line">
                        <div class="alert alert-danger error" v-show="msgShow">
                            <span class="glyphicon glyphicon-info-sign">{{errMsg}}</span>
                        </div>
                        <button class="btn btn-primary" style="width:54px;" v-on:click="register">注册</button>
                        <a class="link-register" v-on:click="loginPage">返回</a>
                    </div>
                </div>
            </div>
            <div class="bd" v-show="updatePasswordShow">
                <div>
                    <div class="line">
                        <input class="form-control" type="text" v-model="username" placeholder="用户名"/>
                    </div>
                    <div class="line">
                        <input class="form-control" type="password" v-model="password" placeholder="原始密码"/>
                    </div>
                    <div class="line">
                        <input class="form-control" type="password" v-model="newPassword" placeholder="新密码"/>
                    </div>
                    <div class="line">
                        <input class="form-control" type="password" v-model="reNewPassword" placeholder="重新输入新密码"/>
                    </div>
                    <div class="line">
                        <div class="alert alert-danger error" v-show="msgShow">
                            <span class="glyphicon glyphicon-info-sign">{{errMsg}}</span>
                        </div>
                        <button class="btn btn-primary" style="width:54px;" v-on:click="updatePassword">修改</button>
                        <a class="link-register" v-on:click="loginPage">返回</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="application/ecmascript">
    import * as types from './store/types'
    import api from './constant/api'
    import qs from 'querystring'
    export default {
        name: 'login',
        data () {
            return {
                loginShow: true,
                registerShow: false,
                updatePasswordShow: false,
                editPasswordShow: false,
                username: "",
                password: "",
                rePassword: "",
                newPassword: "",
                reNewPassword: "",
                token: "",
                msgShow: false,
                errMsg: ""
            }
        },
        mounted(){
            this.$store.commit(types.TITLE, 'Login');
        },
        methods: {
            login(){
                var password = this.$md5.hex_md5(this.password);
                this.axios.post(api.baseUrl + '/user/login', qs.stringify({userName: this.username, password: password}))
                    .then(response => {
                        var result = response.data;
                        if (result.suc) {
                            this.token = result.value.token;
                            if (this.token) {
                                this.$store.commit(types.LOGIN, this.token);
                                this.$store.commit(types.USERNAME);
                                sessionStorage.setItem("userName",result.value.userName);
                                sessionStorage.setItem("token",result.value.token);
                                this.$store.commit("userName",sessionStorage.getItem("userName"));
                                this.$cookieStore.setCookie('username',result.value.userName,86400);
                                let redirect = decodeURIComponent((this.$route.query.redirect == "/"
                                    ? "/html/report/dashboard" : this.$route.query.redirect) || '/html/report/dashboard');
                                this.$router.push({
                                    path: redirect
                                })
                            }
                        } else {
                            var _this = this;
                            _this.msgShow = true;
                            _this.errMsg = result.msg;
                            var interval = setInterval(function () {
                                _this.msgShow = false;
                                _this.errMsg = "";
                                clearInterval(interval);
                            }, 3000);
                        }
                    });
            },
            register() {
                this.axios.post(api.baseUrl + '/user/register', qs.stringify({userName: this.username, password: this.password, rePassword: this.rePassword}))
                    .then(response => {
                        var result = response.data;
                        if (result.suc) {
                            this.loginShow = true;
                            this.registerShow = false;
                            this.$message.success("注册成功");
                        } else {
                            var _this = this;
                            _this.msgShow = true;
                            _this.errMsg = result.msg;
                            var interval = setInterval(function () {
                                _this.msgShow = false;
                                _this.errMsg = "";
                                clearInterval(interval);
                            }, 3000);
                        }
                    });
            },
            updatePassword() {
                var password = this.$md5.hex_md5(this.password);
                this.axios.post(api.baseUrl + '/user/updatePassword', qs.stringify({userName: this.username, password: password, newPassword: this.newPassword, reNewPassword: this.reNewPassword}))
                    .then(response => {
                        var result = response.data;
                        if (result.suc) {
                            this.loginShow = true;
                            this.updatePasswordShow = false;
                            this.$message.success("密码修改成功");
                        } else {
                            var _this = this;
                            _this.msgShow = true;
                            _this.errMsg = result.msg;
                            var interval = setInterval(function () {
                            _this.msgShow = false;
                            _this.errMsg = "";
                            clearInterval(interval);
                            }, 3000);
                        }
                    });
            },
            onMouseOver() {
                this.editPasswordShow = true;
            },
            onMouseOut() {
                this.editPasswordShow = false;
            },
            registerPage() {
                this.username = "";
                this.password = "";
                this.loginShow = false;
                this.registerShow = true;
            },
            updatePasswordPage() {
                this.username = "";
                this.password = "";
                this.loginShow = false;
                this.updatePasswordShow = true;
            },
            loginPage() {
                this.username = "";
                this.password = "";
                this.rePassword = "";
                this.newPassword = "";
                this.reNewPassword = "";
                this.loginShow = true;
                this.registerShow = false;
                this.updatePasswordShow = false;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss' rel="stylesheet/scss" type="text/css">
    @import "assets/plugins/bootstrap/css/bootstrap.min.css";
    @import "assets/css/log.min.css";
</style>
