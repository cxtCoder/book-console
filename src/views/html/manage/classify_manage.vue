<template>
    <div>
        <div class="m-main-header">分类管理</div>
        <div style="padding: 10px 0"></div>
        <el-form ref="selectForm" :model="selectForm" label-width="80px">
            <el-row>
                <el-col :span="5">
                    <el-form-item label="一级分类">
                        <el-select v-model="selectForm.classify" filterable clearable placeholder="一级分类">
                            <el-option-group 
                                    v-for="group in classifyOptions" :key="group.label" :label="group.label">
                                <el-option
                                    v-for="item in group.options" :key="item.value" :label="item.value" :value="item.value">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="二级分类" label-width="100px">
                        <el-input v-model="selectForm.subClassify" placeholder="二级分类"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-form-item label-width="30px">
                        <el-button icon="search" type="primary" @click="searchClassifyButton">搜索</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div style="padding-bottom: 10px" v-if="userType == '1'">
            <el-button type="primary" icon="plus" v-on:click="addNewClassify">新增</el-button>
        </div>
        <el-table :data="classifyData" stripe border tooltip-effect="dark" v-loading="loading" element-loading-text="拼命加载中">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="classify" align="center" label="一级分类" show-overflow-tooltip></el-table-column>
            <el-table-column prop="subClassify" align="center" label="二级分类" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateTime" align="center" label="更新时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" width="150" v-if="userType == '1'">
                <template scope="scope">
                    <el-button @click="editClassify(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteClassifyButton(scope.row)" type="text" size="small">删除</el-button>
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
        <el-dialog :title="classifyTitle" :visible.sync="classifyVisible" class="classifyDialog">
            <el-form :model="classifyForm" :rules="classifyRules" ref="classifyForm" label-width="100px">
                <el-form-item prop="classify" label="一级分类">
                    <el-select v-model="classifyForm.classify" filterable placeholder="一级分类">
                        <el-option-group 
                                v-for="group in classifyOptions" :key="group.label" :label="group.label">
                            <el-option
                                v-for="item in group.options" :key="item.value" :label="item.value" :value="item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item prop="subClassify" label="二级分类">
                    <el-input v-model="classifyForm.subClassify" placeholder="二级分类" style="width: 350px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="classifyVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitClassify">确 定</el-button>
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
        name: 'classify_manage',
        data () {
            return {
                userType: '-1',
                classifyOptions: [
                    {
                        label: '馆藏图书',
                        options: [
                            {
                            value: '文史类'
                        }, {
                            value: '志书类',
                        }, {
                            value: '文学类',
                        }, {
                            value: '历史类',
                        }, {
                            value: '工具类',
                        }, {
                            value: '其他类',
                        }]
                    }, {
                        label: '名人书画',
                        options: [
                            {
                            value: '名人书画'
                        }]
                    },
                    {
                        label: '文物古迹',
                        options: [
                            {
                            value: '文物古迹'
                        }]
                    }
                ],
                selectForm: {
                    classify: '',
                    subClassify: ''
                },
                loading: false,
                classifyData: [],
                pageNum: 1,
                pageSize: 10,
                totalNum: 0,
                classifyTitle: '',
                classifyVisible: false,
                classifyForm: {
                    classify: '',
                    subClassify: ''
                },
                classifyRules: {
                    classify: [
                        { required: true, message: '请选择一级分类', trigger: 'blur' },
                    ],
                    subClassify: [
                        { required: true, message: '请填写二级分类', trigger: 'blur' },
                        { max: 25, message: '长度不能超过25个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.getUserType();
            this.searchClassify();
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
            initClassifyData() {
                this.pageNum = 1;
                this.pageSize = 10;
                this.totalNum = 0;
                this.classifyData = [];
            },
            handleCurrentChange(num) {
                this.pageNum = num;
                this.searchClassify();
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.pageNum = 1;
            },
            searchClassifyButton() {
                this.initClassifyData();
                this.searchClassify();
            },
            searchClassify() {
                var _this = this;
                _this.loading = true;
                var data = {
                    classify: _this.selectForm.classify,
                    subClassify: _this.selectForm.subClassify,
                    pageNum: _this.pageNum,
                    pageSize: _this.pageSize
                };
                _this.axios.post(api.baseUrl + "/classify/getClassifyList", data)
                    .then(function (result) {
                        var response = result.data;
                        _this.loading = false;
                        if (response.suc) {
                            _this.classifyData = response.value;
                        } else {
                            _this.$message.error("获取分类失败");
                        }
                    }
                );
                _this.axios.post(api.baseUrl + "/classify/getClassifyCount", data)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.totalNum = response.value;
                        }
                    }
                );
            },
            addNewClassify() {
                var _this = this;
                _this.classifyForm = {
                    id: '',
                    classify: '',
                    subClassify: ''
                };
                _this.classifyTitle = "新增";
                _this.classifyVisible = true;
                if (_this.$refs['classifyForm']) {
                    _this.$refs['classifyForm'].resetFields();
                }
            },
            editClassify(row) {
                var _this = this;
                _this.classifyForm = {
                    id: row.id,
                    classify: row.classify,
                    subClassify: row.subClassify
                };
                _this.classifyTitle = "编辑";
                _this.classifyVisible = true;
            },
            submitClassify() {
                var _this = this;
                _this.$refs['classifyForm'].validate((valid) => {
                    if (valid) {
                        _this.checkSubClassify();
                    }
                });
            },
            checkSubClassify() {
                var _this = this;
                _this.axios.post(api.baseUrl + "/classify/checkSubClassify", _this.classifyForm)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            if (response.value) {
                                _this.manageSubClassify();
                            } else {
                                _this.$message.warning('该分类已存在');
                            }
                        } else {
                            _this.$message.error("校验失败");
                        }
                    }
                );
            },
            manageSubClassify() {
                var _this = this;
                _this.axios.post(api.baseUrl + "/classify/manageSubClassify", _this.classifyForm)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.$message.success(_this.classifyTitle + "成功");
                            _this.searchClassifyButton();
                        } else {
                            _this.$message.error(_this.classifyTitle + "失败");
                        }
                        _this.classifyVisible = false;
                    }
                );
            },
            deleteClassifyButton(row) {
                var _this = this;
                _this.$confirm(`确定删除该分类数据？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(action => {
                    _this.axios.get(api.baseUrl + "/classify/checkClassify?id=" + row.id)
                        .then(function (result) {
                            var response = result.data;
                            if (response.suc) {
                                if (response.value) {
                                    _this.deleteSubClassify(row.id);
                                } else {
                                    _this.$message.warning("该分类已被使用，暂不支持删除");
                                }
                            } else {
                                _this.$message.error("校验失败");
                            }
                        }
                    );
                }).catch(() => {
                });
            },
            deleteSubClassify(id) {
                var _this = this;
                _this.axios.get(api.baseUrl + "/classify/deleteClassifyById?id=" + id).then(function (result) {
                    var response = result.data;
                    if (response.suc) {
                        _this.$message.success("删除成功");
                        _this.searchClassifyButton();
                    } else {
                        _this.$message.error("删除失败");
                    }
                });
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
    .classifyDialog .el-dialog--small {
        width: 40% !important;
    }
</style>