<template>
	<!-- begin #page-container -->
	<div id="page-container" class="page-sidebar-fixed page-header-fixed">
		<!-- begin #header -->
		<div id="header" class="header navbar navbar-fixed-top">
			<!-- begin container-fluid -->
			<div class="container-fluid">
				<!-- begin mobile sidebar expand / collapse button -->
				<div class="navbar-header">
					<a href="javascript:void(0);" @click="changeView('/html/report/dashboard')" class="navbar-brand">
						<img src="./assets/images/logo-24.png">
						文史资料管理系统
					</a>
				</div>
				<!-- end mobile sidebar expand / collapse button -->
				<!-- begin header navigation right -->
				<ul class="nav navbar-nav navbar-right">
					<li class="dropdown navbar-user">
						<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">
							<svg class="icon" aria-hidden="true">
							  <use xlink:href="#icon-photo"></use>
							</svg>
							<span v-if="userName == ''">欢迎您</span>
                            <span v-else>{{userName}},欢迎您</span>
							<i class="fa fa-angle-down"></i>
						</a>
						<ul class="dropdown-menu">
							<li class="arrow"></li>
							<li><a v-on:click="editPassword" href="javascript:;">修改密码</a></li>
							<li><a v-on:click="logout" href="javascript:;">登出</a></li>
						</ul>
					</li>
				</ul>
				<!-- end header navigation right -->
			</div>
			<!-- end container-fluid -->
		</div>
		<!-- end #header -->
		
		<!-- begin #sidebar -->
		<div id="sidebar" class="sidebar">
			<!-- begin sidebar scrollbar -->
			<div data-scrollbar="true" data-height="100%">
				<!-- begin sidebar nav -->
				<ul class="nav">
					<!-- begin sidebar minify button -->
					<li>
						<a href="javascript:;" class="sidebar-minify-btn" data-click="sidebar-minify">
							<i class="fa fa-bars"></i>
						</a>
					</li>
					<!-- end sidebar minify button -->
					<li class="has-sub">
                        <a href="javascript:;">
                            <i class="glyphicon glyphicon-stats" style="top: -1px !important"></i>
                            <span>数据看板</span>
                        </a>
                        <ul class="sub-menu">
                            <li><a v-on:click="changeView('/html/report/dashboard',$event)" v-bind:class="'dashboard' == curTab ? 'activeTab' : ''">数据看板</a></li>
                        </ul>
						<a href="javascript:;">
						    <i class="glyphicon glyphicon-book"></i>
						    <span>馆藏图书</span>
						</a>
						<ul class="sub-menu">
							<li><a v-on:click="changeView('/html/book/books-ws',$event)" v-bind:class="'books-ws' == curTab ? 'activeTab' : ''">文史类图书</a></li>
							<li><a v-on:click="changeView('/html/book/books-zs',$event)" v-bind:class="'books-zs' == curTab ? 'activeTab' : ''">志书类图书</a></li>
							<li><a v-on:click="changeView('/html/book/books-wx',$event)" v-bind:class="'books-wx' == curTab ? 'activeTab' : ''">文学类图书</a></li>
							<li><a v-on:click="changeView('/html/book/books-ls',$event)" v-bind:class="'books-ls' == curTab ? 'activeTab' : ''">历史类图书</a></li>
							<li><a v-on:click="changeView('/html/book/books-gj',$event)" v-bind:class="'books-gj' == curTab ? 'activeTab' : ''">工具类图书</a></li>
							<li><a v-on:click="changeView('/html/book/books-qt',$event)" v-bind:class="'books-qt' == curTab ? 'activeTab' : ''">其他类图书</a></li>
						</ul>
						<a href="javascript:;">
                            <i class="iconfont icon-flow"></i>
                            <span>名人书画</span>
                        </a>
                        <ul class="sub-menu">
                            <li><a v-on:click="changeView('/html/painting/celebrity_painting',$event)" v-bind:class="'celebrity_painting' == curTab ? 'activeTab' : ''">名人书画</a></li>
                        </ul>
                        <a href="javascript:;">
                            <i class="glyphicon glyphicon-pawn"></i>
                            <span>文物古迹</span>
                        </a>
                        <ul class="sub-menu">
                            <li><a v-on:click="changeView('/html/relic/historical_relic',$event)" v-bind:class="'historical_relic' == curTab ? 'activeTab' : ''">文物古迹</a></li>
                        </ul>
                        <a href="javascript:;">
                            <i class="glyphicon glyphicon-cog"></i>
                            <span>系统管理</span>
                        </a>
                        <ul class="sub-menu">
                            <li><a v-on:click="changeView('/html/manage/user_manage',$event)" v-bind:class="'user_manage' == curTab ? 'activeTab' : ''">用户管理</a></li>
                            <li><a v-on:click="changeView('/html/manage/classify_manage',$event)" v-bind:class="'classify_manage' == curTab ? 'activeTab' : ''">分类管理</a></li>
                        </ul>
					</li>
				</ul>
				<!-- end sidebar nav -->
			</div>
			<!-- end sidebar scrollbar -->
		</div>
		<div class="sidebar-bg"></div>
		<!-- end #sidebar -->

		<div id="content" class="content">
			<router-view>
			</router-view>
			<el-dialog title="重置密码" :visible.sync="upPasswordVisible" :size="''" :before-close="cancelUpPassword">
                <el-form :label-position="'right'" label-width="120px">
                    <el-form-item label="当前密码">
                        <el-input v-model="password" type="password" style="width:300px" auto-complete="off" size="small" clearable="true" placeholder="请输入当前密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input v-model="newPassword" type="password" style="width:300px" auto-complete="off" size="small" clearable="true" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="重新输入">
                        <el-input v-model="reNewPassword" type="password" style="width:300px" auto-complete="off" size="small" clearable="true" placeholder="请重新输入新密码"></el-input>
                    </el-form-item>
                </el-form>
                <div class="ui-form-item clearfix" style="text-align: right">
                    <input class="ui-button btn btn-primary" type="submit" value="取消" @click="cancelUpPassword"/>
                    <input class="btn btn-success active" type="submit" value="确认" @click="submitUpPassword"/>
                </div>
            </el-dialog>
		</div>
	<!-- end page container -->
	</div>
</template>

<script type="application/ecmascript">
    import{ mapState } from 'vuex'
    import * as types from './store/types'
    import api from './constant/api'
    import jQuery from './assets/js/jquery-1.9.1.min'
    import searchableSelect from './assets/js/jquery.searchableSelect'
    // window.jQuery = jQuery;
    window.searchableSelect = searchableSelect;
    import './assets/plugins/jquery/jquery-migrate-1.1.0.min'
    import './assets/plugins/slimscroll/jquery.slimscroll'
	// import './assets/plugins/bootstrap/js/bootstrap'
    import './assets/plugins/iconfont/iconfont'
	import {AppCon} from './assets/js/apps.js'
	import qs from 'querystring'

    export default {
        name: 'index',
        data () {
            return {
                userName: '',
                password: "",
                newPassword: "",
                reNewPassword: "",
                upPasswordVisible: false
            }
        },
		mounted: function() {
            AppCon.init();
            this.userName = this.$cookieStore.getCookie('username');
        },
        computed:{
            curTab() {
                return this.$store.state.taskHeadNav;
            }
        },
        methods:{
            changeView(view, event) {
                this.$router.push({path: view});
            },
            editPassword() {
                this.password = "";
                this.newPassword = "";
                this.reNewPassword = "";
                this.upPasswordVisible = true;
            },
            cancelUpPassword() {
                this.password = "";
                this.newPassword = "";
                this.reNewPassword = "";
                this.upPasswordVisible = false;
            },
            submitUpPassword() {
                var _this = this;
                var password = _this.$md5.hex_md5(this.password);
                this.axios.post(api.baseUrl + '/user/updatePassword', qs.stringify({userName: this.userName, password: password, newPassword: this.newPassword, reNewPassword: this.reNewPassword}))
                    .then(response => {
                        var result = response.data;
                        if (result.suc) {
                            _this.upPasswordVisible = false;
                            _this.$message.success("密码修改成功");
                         }else {
                            _this.$alert(result.msg, '提示', {
                                type: 'error'
                            }).catch(function(reason) {
                            });
                        }
                    });
            },
            logout() {
                this.$store.commit(types.LOGOUT);
                sessionStorage.setItem("userName", "");
                sessionStorage.setItem("token", "");
                this.$store.commit("userName", "");
                this.$cookieStore.delCookie('username');
                this.$router.push({
                    path: '/login'
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss' rel="stylesheet/scss" type="text/css">
    @import "../node_modules/element-theme-default/lib/index.css";
	@import "assets/plugins/bootstrap/css/bootstrap.min.css";
	@import "assets/css/bootstrap-table.min.css";
	@import "assets/plugins/font-awesome/css/font-awesome.min.css";
    @import "assets/plugins/iconfont/iconfont.css";
	@import "assets/css/sweetalert.css";
	@import "assets/css/base.css";
	@import "assets/css/ui.css";
	@import "assets/css/theme.css";
	@import "assets/css/jquery.searchableSelect.css";
</style>
