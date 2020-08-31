<template>
    <div>
        <el-row>
            <el-col :span="12">
                <el-button @click="addSubClassify" type="primary" icon="plus" size="small">新增</el-button>
            </el-col>
            <el-col :span="10">
                <el-input v-model="subClassify" size="small" placeholder="请输入二级分类名称"></el-input>
            </el-col>
            <el-col :span="2" style="float: right">
                <el-button @click="searchClassifyButton" type="primary" icon="search" size="small"></el-button>
            </el-col>
        </el-row>
        <div style="margin-top: 10px"></div>
        <el-table :data="classifyData" stripe border tooltip-effect="dark" height="300" v-loading="loading" element-loading-text="拼命加载中">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="classify" align="center" label="一级分类" show-overflow-tooltip></el-table-column>
            <el-table-column prop="subClassify" align="center" label="二级分类" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" width="120">
                <template scope="scope">
                    <el-button @click="editSubClassify(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteSubClassifyButton(scope.row)" type="text" size="small">删除</el-button>
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
    </div>
</template>

<script>
    import api from '../../../../constant/api'
    import Vue from 'vue'
    import Moment from 'moment'
    Vue.prototype.moment = Moment

    export default {
        name: 'relicClassify',
        props: ['classify'],
        data () {
            return {
                loading: false,
                id: '',
                subClassify: '',
                newSubClassify: '',
                classifyTitle: '',
                classifyData: [],
                pageNum: 1,
                pageSize: 10,
                totalNum: 0
            }
        },
        created() {
            this.searchClassify();
        },
        methods: {
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
                    classify: _this.classify,
                    subClassify: _this.subClassify,
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
            addSubClassify() {
                var _this = this;
                _this.id = "";
                _this.newSubClassify = null;
                _this.classifyTitle = "新增";
                _this.submitClassify();
            },
            editSubClassify(row) {
                var _this = this;
                _this.id = row.id;
                _this.newSubClassify = row.subClassify;
                _this.classifyTitle = "编辑";
                _this.submitClassify();
            },
            submitClassify() {
                var _this = this;
                _this.$prompt('请填写二级分类名称', _this.classifyTitle, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: _this.newSubClassify,
                    inputValidator: (value) => {
                        if (!value) {
                            return '名称不能为空';
                        }
                        if (value.length > 25) {
                            return '长度不能超过25个字符';
                        }
                    }
                }).then(({ value }) => {
                    _this.newSubClassify = value;
                    _this.checkSubClassify();
                }).catch(() => {
                });
            },
            checkSubClassify() {
                var _this = this;
                var data = {
                    id: _this.id,
                    classify: _this.classify,
                    subClassify: _this.newSubClassify
                };
                _this.axios.post(api.baseUrl + "/classify/checkSubClassify", data)
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
                var data = {
                    id: _this.id,
                    classify: _this.classify,
                    subClassify: _this.newSubClassify
                };
                _this.axios.post(api.baseUrl + "/classify/manageSubClassify", data)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.$message.success(_this.classifyTitle + "成功");
                            _this.searchClassifyButton();
                        } else {
                            _this.$message.error(_this.classifyTitle + "失败");
                        }
                        _this.subClassifyVisible = false;
                    }
                );
            },
            deleteSubClassifyButton(row) {
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

<style>

</style>