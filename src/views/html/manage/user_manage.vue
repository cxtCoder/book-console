<template>
    <div>
        <div class="m-main-header">用户管理</div>
        <div style="padding: 10px 0"></div>
        <el-form ref="selectForm" :model="selectForm" label-width="70px">
            <el-row>
                <el-col :span="5">
                    <el-form-item label="用户名">
                        <el-input v-model="selectForm.userId" placeholder="用户名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="姓名">
                        <el-input v-model="selectForm.userName" placeholder="姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="类型">
                        <el-select v-model="selectForm.typeId" filterable clearable placeholder="类型">
                            <el-option v-for="item in userOptions"
                                :key="item.id" :value="item.id" :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-form-item label-width="30px">
                        <el-button icon="search" type="primary" @click="searchUserInfoButton">搜索</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div style="padding-bottom: 10px" v-if="userType == '1'">
            <el-button type="primary" icon="plus" v-on:click="addNewUser">新增</el-button>
        </div>
        <el-table :data="userData" stripe border tooltip-effect="dark" v-loading="loading" element-loading-text="拼命加载中">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="userId" align="center" label="用户名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userName" align="center" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="typeName" align="center" label="类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateTime" align="center" label="更新时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" width="150" v-if="userType == '1'">
                <template scope="scope">
                    <el-button @click="editUserInfo(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="manageUserAuth(scope.row)" type="text" size="small">权限</el-button>
                    <el-button @click="deleteUserInfoButton(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="float:right; padding: 10px 0">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 15, 20]"
                :page-size="pageSize"
                layout="total, prev, pager, next, sizes, jumper"
                :total="totalNum">
            </el-pagination>
        </div>
        <el-dialog :title="userTitle" :visible.sync="userVisible" class="userDialog">
            <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="100px">
                <el-form-item prop="userId" label="用户名">
                    <el-input v-model="userForm.userId" placeholder="用户名" :disabled="disabled" style="width: 350px"></el-input>
                </el-form-item>
                <el-form-item prop="userName" label="姓名">
                    <el-input v-model="userForm.userName" placeholder="姓名" style="width: 350px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUserInfo">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="权限管理" :visible.sync="userAuthVisible" class="userDialog">
            <el-form label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="userId" placeholder="用户名" :disabled="true" style="width: 350px"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="userAuth" filterable placeholder="类型" style="width: 350px">
                        <el-option v-for="item in userOptions"
                            :key="item.id" :value="item.id" :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userAuthVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUserAuth">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../../constant/api'
    import qs from 'querystring'
    import Vue from 'vue'
    import Moment from 'moment'
    Vue.prototype.moment = Moment

    export default {
        name: 'user_manage',
        data () {
            return {
                userType: '-1',
                userOptions: {},
                selectForm: {
                    userId: '',
                    userName: '',
                    typeId: ''
                },
                loading: false,
                userData: [],
                pageNum: 1,
                pageSize: 10,
                totalNum: 0,
                userTitle: '',
                userVisible: false,
                userForm: {
                    userId: '',
                    userName: '',
                    typeId: ''
                },
                userRules: {
                    userId: [
                        { required: true, message: '请填写用户名', trigger: 'blur' },
                        { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
                    ]
                },
                disabled: false,
                userAuthVisible: false,
                userId: '',
                userAuth: ''
            }
        },
        created() {
            this.getUserType();
            this.getUserTypeList();
            this.searchUserInfo();
        },
        methods: {
            getUserType() {
                var _this = this;
                this.axios.post(api.baseUrl + "/user/getUserTypeById", qs.stringify({userId : this.$cookieStore.getCookie('username')}))
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.userType = response.value;
                        } else {
                            _this.$router.push({
                                path: '/login'
                            })
                        }
                    }
                );
            },
            getUserTypeList() {
                var _this = this;
                this.axios.post(api.baseUrl + "/user/getUserTypeList")
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.userOptions = response.value;
                        }
                    }
                );
            },
            initUserData() {
                this.pageNum = 1;
                this.pageSize = 10;
                this.totalNum = 0;
                this.userData = [];
            },
            handleCurrentChange(num) {
                this.pageNum = num;
                this.searchUserInfo();
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.pageNum = 1;
            },
            searchUserInfoButton() {
                this.initUserData();
                this.searchUserInfo();
            },
            searchUserInfo() {
                var _this = this;
                _this.loading = true;
                var data = {
                    userId: _this.selectForm.userId,
                    userName: _this.selectForm.userName,
                    typeId: _this.selectForm.typeId,
                    pageNum: _this.pageNum,
                    pageSize: _this.pageSize
                };
                _this.axios.post(api.baseUrl + "/user/getUserList", data)
                    .then(function (result) {
                        var response = result.data;
                        _this.loading = false;
                        if (response.suc) {
                            _this.userData = response.value;
                        } else {
                            _this.$message.error("获取用户失败");
                        }
                    }
                );
                _this.axios.post(api.baseUrl + "/user/getUserCount", data)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.totalNum = response.value;
                        }
                    }
                );
            },
            addNewUser() {
                var _this = this;
                _this.userForm = {
                    userId: '',
                    userName: '',
                    typeId: ''
                };
                _this.disabled = false;
                _this.userTitle = "新增";
                _this.userVisible = true;
                if (_this.$refs['userForm']) {
                    _this.$refs['userForm'].resetFields();
                }
            },
            editUserInfo(row) {
                var _this = this;
                _this.userForm = {
                    userId: row.userId,
                    userName: row.userName,
                    typeId: '1'
                };
                _this.disabled = true;
                _this.userTitle = "编辑";
                _this.userVisible = true;
            },
            submitUserInfo() {
                var _this = this;
                _this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        if (_this.userForm.typeId == '') {
                            _this.checkUserId();
                        } else {
                            _this.manageUserInfo();
                        }
                    }
                });
            },
            checkUserId() {
                var _this = this;
                _this.axios.get(api.baseUrl + "/user/checkUserId?userId=" + _this.userForm.userId)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            if (response.value) {
                                _this.manageUserInfo();
                            } else {
                                _this.$message.warning('该用户名已存在');
                            }
                        } else {
                            _this.$message.error("校验失败");
                        }
                    }
                );
            },
            manageUserInfo() {
                var _this = this;
                _this.axios.post(api.baseUrl + "/user/manageUserInfo", _this.userForm)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            if (_this.userTitle == "新增") {
                                _this.$alert('初始密码：111111', '温馨提示', {
                                    confirmButtonText: '确定',
                                });
                            }
                            _this.$message.success(_this.userTitle + "成功");
                            _this.searchUserInfoButton();
                        } else {
                            _this.$message.error(_this.userTitle + "失败");
                        }
                        _this.userVisible = false;
                    }
                );
            },
            deleteUserInfoButton(row) {
                var _this = this;
                _this.$confirm(`确定删除该用户数据？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(action => {
                    _this.axios.get(api.baseUrl + "/user/checkUser?userId=" + row.userId)
                        .then(function (result) {
                            var response = result.data;
                            if (response.suc) {
                                if (response.value) {
                                    _this.deleteUserInfo(row.userId);
                                } else {
                                    _this.$message.warning("该用户已被使用，暂不支持删除");
                                }
                            } else {
                                _this.$message.error("校验失败");
                            }
                        }
                    );
                }).catch(() => {
                });
            },
            deleteUserInfo(userId) {
                var _this = this;
                _this.axios.get(api.baseUrl + "/user/deleteUserById?userId=" + userId).then(function (result) {
                    var response = result.data;
                    if (response.suc) {
                        _this.$message.success("删除成功");
                        _this.searchUserInfoButton();
                    } else {
                        _this.$message.error("删除失败");
                    }
                });
            },
            manageUserAuth(row) {
                var _this = this;
                _this.userId = row.userId;
                _this.userAuth = row.typeId;
                _this.userAuthVisible = true;
            },
            submitUserAuth() {
                var _this = this;
                var data = {
                    userId: _this.userId,
                    typeId: _this.userAuth
                };
                _this.axios.post(api.baseUrl + "/user/manageUserAuth", data)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.$message.success("权限设置成功");
                            _this.searchUserInfoButton();
                        } else {
                            _this.$message.error("权限设置失败");
                        }
                        _this.userAuthVisible = false;
                    }
                );
            }
        }
    }
</script>

<style lang="scss">
    .m-main-header {
        font-size: 14px;
        color: #333;
        font-weight: 700;
        padding-left: 23px;
        position: relative;
        height: 30px;
        border-bottom: 1px #ddd solid;
        line-height: 30px;
        &:before {
            content: "";
            width: 5px;
            height: 14px;
            position: absolute;
            left: 8px;
            top: 8px;
            background: #037DF3;
        }
    }
    .userDialog .el-dialog--small {
        width: 40% !important;
    }
</style>