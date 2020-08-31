<template>
    <div>
        <el-form ref="selectForm" :model="selectForm" label-width="70px">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="查询模式">
                        <el-select v-model="selectForm.findMode" placeholder="查询模式">
                            <el-option :key="2" :value="2" label="模糊查询"></el-option>
                            <el-option :key="1" :value="1" label="精确查询"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="省份">
                        <el-input v-model="selectForm.province" placeholder="省份"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="城市">
                        <el-input v-model="selectForm.city" placeholder="城市"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="区/县">
                        <el-input v-model="selectForm.district" placeholder="区/县"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5" v-if="showMore">
                    <el-form-item label="作者">
                        <el-input v-model="selectForm.author" placeholder="作者"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2" v-if="!showMore">
                    <el-form-item>
                        <el-button icon="search" type="primary" @click="searchBooksButton">搜索</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="3" v-if="!showMore">
                    <el-form-item>
                        <el-button type="text" @click="showMoreSearch">高级<i class="glyphicon glyphicon-circle-arrow-down"></i></el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4" v-if="showMore">
                    <el-form-item label="分类">
                        <el-select v-model="selectForm.classifyId" filterable clearable placeholder="分类">
                            <el-option v-for="item in subClassifyOptions"
                                :key="item.id" :value="item.id" :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5" v-if="showMore">
                    <el-form-item label="书名">
                        <el-input v-model="selectForm.bookName" placeholder="书名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5" v-if="showMore">
                    <el-form-item label="副书名">
                        <el-input v-model="selectForm.bookSubName" placeholder="副书名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5" v-if="showMore">
                    <el-form-item label="出版社">
                        <el-input v-model="selectForm.publishing" placeholder="出版社"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5" v-if="showMore">
                    <el-form-item label="录入者">
                        <el-input v-model="selectForm.createUser" placeholder="录入者"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="7" v-if="showMore">
                    <el-form-item label="出版日期">
                        <el-date-picker v-model="selectForm.publishedDate" type="daterange" :picker-options="pickerOptions"
                            :editable="false" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择日期范围">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="7" v-if="showMore">
                    <el-form-item label="存放位置">
                        <el-input v-model="selectForm.position" placeholder="存放位置"></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="7" v-if="showMore">
                    <el-form-item label="录入时间">
                         <el-date-picker v-model="selectForm.createTime" type="daterange" :picker-options="pickerOptions"
                               :editable="false" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择时间范围">
                         </el-date-picker>
                    </el-form-item>
                </el-col> -->
                <!-- <el-col :span="5" v-if="showMore">
                   <el-form-item label="更新时间">
                         <el-date-picker v-model="selectForm.updateTime" type="daterange" :picker-options="pickerOptions"
                               :editable="false" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择时间范围">
                         </el-date-picker>
                    </el-form-item>
                </el-col> -->
                <el-col :span="2" v-if="showMore" :offset="3">
                    <el-form-item>
                        <el-button icon="search" type="primary" @click="searchBooksButton">搜索</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="2" v-if="showMore" class="book-repeat">
                    <el-form-item>
                        <el-button class="glyphicon glyphicon-repeat" type="success" @click="resetBooksButton">重置</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="3" v-if="showMore">
                    <el-form-item>
                        <el-button type="text" @click="showLessSearch">简单<i class="glyphicon glyphicon-circle-arrow-up"></i></el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div style="padding: 10px 0">
            <el-row class="book">
                <el-col v-if="userType === '1'" :span="22">
                    <el-button type="primary" icon="plus" v-on:click="addBook">新增</el-button>
                    <el-button type="danger" icon="delete" v-on:click="deleteBooks">删除</el-button>
                    <el-dropdown size="medium" style="padding-left: 10px" trigger="click">
                        <el-button class="glyphicon glyphicon-export" style="padding: 9px 10px">导出<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="outExcel">Excel文件</el-dropdown-item>
                            <el-dropdown-item @click.native="exportContent('pdf')">PDF文件</el-dropdown-item>
                            <el-dropdown-item @click.native="exportContent('word')">Word文件</el-dropdown-item>
                            <el-dropdown-item @click.native="outSql">SQL文件</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col v-if="userType === '0'" :span="22">
                    <el-dropdown size="medium" trigger="click">
                        <el-button type="primary" class="glyphicon glyphicon-export" style="padding: 9px 10px">导出<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="outExcel">Excel文件</el-dropdown-item>
                            <el-dropdown-item @click.native="exportContent('pdf')">PDF文件</el-dropdown-item>
                            <el-dropdown-item @click.native="exportContent('word')">Word文件</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :span="colSize">
                    <el-button-group style="float:right" v-if="showList">
                        <el-button type="info" class="glyphicon glyphicon-list" @click="showListType"></el-button>
                        <el-button class="glyphicon glyphicon-th" @click="showImgType"></el-button>
                    </el-button-group>
                    <el-button-group style="float:right" v-else>
                        <el-button class="glyphicon glyphicon-list" @click="showListType"></el-button>
                        <el-button type="info" class="glyphicon glyphicon-th" @click="showImgType"></el-button>
                    </el-button-group>
                </el-col>
            </el-row>
        </div>
        <div class="book-summary-single">
            <div style="font-size: 15px; margin-top: 3px">
                <label style="margin-right: 30px">馆藏图书总数：{{ totalNumber }}本</label>
                <label>{{ classify }}图书总数：{{ totalNumberForClassify }}本</label>
            </div>
        </div>
        <div v-if="showList">
            <el-table :data="bookDatas" stripe border tooltip-effect="dark" v-loading="loading" element-loading-text="拼命加载中" @selection-change="selectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="thumbPath" align="center" label="封面">
                    <template scope="scope">
                        <img 
                            :src="defaultImg" width="50" height="50" 
                            v-real-img="thumbUrl + scope.row.thumbPath"
                            @click="previewImg(oriUrl + scope.row.thumbPath.replace(thumbPrefix, ''))"
                            style="cursor: pointer"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="province" align="center" label="省份" show-overflow-tooltip></el-table-column>
                <el-table-column prop="city" align="center" label="城市" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="district" align="center" label="区/县" show-overflow-tooltip></el-table-column>
                <el-table-column prop="subClassify" align="center" label="分类" show-overflow-tooltip></el-table-column>
                <el-table-column prop="bookName" align="center" label="书名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="series" align="center" label="辑"></el-table-column>
                <el-table-column prop="quantity" align="center" label="数量(本)"></el-table-column>
                <el-table-column fixed="right" align="center" label="操作" width="100">
                    <template scope="scope">
                        <el-button @click="editBook(scope.row)" type="text" size="small" v-if="userType === '1'">编辑</el-button>
                        <el-button @click="details(scope.row)" type="text" size="small">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-else>
            <div v-if="bookDatas.length > 0">
                <ul v-for="(data, index) in bookDatas" :key="data.bookId">
                    <li style="list-style-type:none;" v-on:mouseenter="onMouseOver(index)" v-on:mouseleave="onMouseOut(index)">
                        <div style="padding: 8px 0; border-bottom: 1px #ddd solid">
                            <el-row>
                                <el-col :span="3">
                                    <img 
                                    :src="defaultImg" width="120" height="120" 
                                    v-real-img="thumbUrl + data.thumbPath"
                                    @click="previewImg(oriUrl + data.thumbPath.replace(thumbPrefix, ''))"
                                    style="cursor: pointer"
                                />
                                </el-col>
                                <el-col :span="19">
                                    <div><label style="font-size: 18px">{{ data.bookName }}</label></div>
                                    <div>
                                        <span v-if="data.bookSubName.length > 0">{{ data.bookSubName }} / </span>
                                        <span>{{ data.series }}</span>
                                        <span style="color: rgb(255, 100, 100)">({{ data.quantity }}本）</span>
                                    </div>
                                    <div>
                                        <span style="color: rgb(104, 171, 248)">地区：</span>
                                        <span>{{ data.province }} / {{ data.city }} / {{ data.district }}</span>
                                    </div>
                                    <div>
                                        <span style="color: rgb(104, 171, 248)">作者：</span>
                                        <span v-if="data.author.length > 60">{{ data.author.substring(0, 60) }} ...</span>
                                        <span v-else>{{ data.author }}</span>
                                    </div>
                                    <div>
                                        <span style="color: rgb(104, 171, 248)">出版日期：</span><span>{{ data.publishedDate }}</span>
                                        <span style="margin-left: 50px"></span>
                                        <span style="color: rgb(104, 171, 248)">出版社：</span>
                                        <span v-if="data.publishing.length > 45">{{ data.publishing.substring(0, 45) }} ...</span>
                                        <span v-else>{{ data.publishing }}</span>
                                    </div>
                                    <span style="color: rgb(104, 171, 248)">简介：</span>
                                    <span v-if="data.summary.length > 60">{{ data.summary.substring(0, 60) }} ...</span>
                                    <span v-else>{{ data.summary }}</span>
                                </el-col>
                                <el-col :span="2">
                                    <el-button @click="editBook(data)" type="text" size="small" v-if="userType === '1'">编辑</el-button>
                                    <el-button @click="details(data)" type="text" size="small">详情</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else style="text-align: center; padding: 20px; border-bottom: 1px #ddd solid"><span>暂无数据</span></div>
        </div>
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
        <el-dialog :visible.sync="imgVisible" title="预览">
            <img :src="previewImgUrl" width="100%"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="imgVisible = false">关闭</el-button>
                <el-button>
                    <a :href="previewImgUrl" target="_blank">原图</a>
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../../../constant/api'
    import qs from 'querystring'
    import defaultImg from '../../../../assets/images/default_book.jpg'
    import {imageIsExist} from '../../../../utils/imgutil'
    import { export_json_to_excel } from '../../../../vendor/Export2Excel'
    import Vue from 'vue'
    import Moment from 'moment'
    Vue.prototype.moment = Moment
    const oriUrl = window.LOCAL_CONFIG.oriUrl;
    const thumbUrl = window.LOCAL_CONFIG.thumbUrl;
    const thumbPrefix = window.LOCAL_CONFIG.thumbPrefix;

    export default {
        name: 'bookHome',
        props: ['classify'],
        data () {
            return {
                showMore: false,
                showList: true,
                userType: '-1',
                colSize: 24,
                pickerOptions: {
                   disabledDate(time) {
                      return time.getTime() > Date.now();
                   }
                },
                oriUrl: oriUrl,
                thumbUrl: thumbUrl,
                thumbPrefix: thumbPrefix,
                imgVisible: false,
                defaultImg: defaultImg,
                previewImgUrl: '',
                subClassifyOptions: {},
                selectForm: {
                    findMode: 2,
                    province: '',
                    city: '',
                    district: '',
                    classifyId: '',
                    bookName: '',
                    bookSubName: '',
                    author: '',
                    publishing: '',
                    publishedDate: '',
                    position: '',
                    createUser: '',
                    createTime: '',
                    updateTime: '',
                },
                selectParamData: {},
                loading: false,
                bookDatas: [],
                pageNum: 1,
                pageSize: 10,
                totalNum: 0,
                selectedIds: [],
                bookAllData: [],
                totalNumber: 0,
                totalNumberForClassify: 0,
                operateShow: null
             }
        }, 
        created() {
            this.getUserType();
            this.getSubClassify();
            this.getBooksCount();
            this.searchBooks();
        },
        methods: {
            showMoreSearch() {
                this.showMore = true;
            },
            showLessSearch() {
                this.showMore = false;
            },
            showListType() {
                this.showList = true;
            },
            showImgType() {
                this.showList = false;
            },
            getUserType() {
                var _this = this;
                this.axios.post(api.baseUrl + "/user/getUserTypeById", qs.stringify({userId : this.$cookieStore.getCookie('username')}))
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.userType = response.value;
                            _this.colSize = 2;
                        } else {
                            _this.$router.push({
                                path: '/login'
                            })
                        }
                    }
                );
            },
            getSubClassify() {
                var _this = this;
                _this.axios.get(api.baseUrl + "/classify/getSubClassifyByClassify?classify=" + _this.classify)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.subClassifyOptions = response.value;
                        }
                    }
                );
            },
            getBooksCount() {
                var _this = this;
                _this.axios.get(api.baseUrl + "/book/getBooksCountByClassify")
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.totalNumber = response.value;
                        }
                    }
                );
                _this.axios.get(api.baseUrl + "/book/getBooksCountByClassify?classify=" + _this.classify)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.totalNumberForClassify = response.value;
                        }
                    }
                );
            },
            initBookData() {
                this.pageNum = 1;
                this.pageSize = 10;
                this.totalNum = 0;
                this.bookDatas = [];
            },
            handleCurrentChange(num) {
                this.pageNum = num;
                this.searchBooks();
            },
            handleSizeChange(size) {
                this.pageSize = size;
                if (this.pageNum == 1) {
                    this.searchBooks();
                } else {
                    this.pageNum = 1;
                }
            },
            searchBooksButton() {
                this.initBookData();
                this.searchBooks();
            },
            resetBooksButton() {
                this.selectForm = {
                    findMode: 2,
                    province: '',
                    city: '',
                    district: '',
                    classifyId: '',
                    bookName: '',
                    bookSubName: '',
                    author: '',
                    publishing: '',
                    publishedDate: '',
                    position: '',
                    createUser: '',
                    createTime: '',
                    updateTime: '',
                };
            },
            searchBooks() {
                var _this = this;
                _this.loading = true;
                var publishedDate = _this.selectForm.publishedDate;
                if (publishedDate && publishedDate[0]) {
                    var pts = _this.moment(publishedDate[0]).format("YYYY-MM-DD");
                    var pte = _this.moment(publishedDate[1]).format("YYYY-MM-DD");
                    publishedDate = pts + "|" + pte;
                } else {
                    publishedDate = "";
                }
                var createTime = _this.selectForm.createTime;
                if (createTime && createTime[0]) {
                    var pts = _this.moment(createTime[0]).format("YYYY-MM-DD HH:mm:ss");
                    createTime[1] = new Date(new Date(createTime[1].toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                    var pte = _this.moment(createTime[1]).format("YYYY-MM-DD HH:mm:ss");
                    createTime = pts + "|" + pte;
                } else {
                    createTime = "";
                }
                var updateTime = _this.selectForm.updateTime;
                if (updateTime && updateTime[0]) {
                    var pts = _this.moment(updateTime[0]).format("YYYY-MM-DD HH:mm:ss");
                    updateTime[1] = new Date(new Date(updateTime[1].toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                    var pte = _this.moment(updateTime[1]).format("YYYY-MM-DD HH:mm:ss");
                    updateTime = pts + "|" + pte;
                } else {
                    updateTime = "";
                }
                _this.selectParamData = {
                    findMode: _this.selectForm.findMode,
                    province: _this.selectForm.province,
                    city: _this.selectForm.city,
                    district: _this.selectForm.district,
                    classify: _this.classify,
                    classifyId: _this.selectForm.classifyId,
                    bookName: _this.selectForm.bookName,
                    bookSubName: _this.selectForm.bookSubName,
                    author: _this.selectForm.author,
                    createUser: _this.selectForm.createUser,
                    publishing: _this.selectForm.publishing,
                    publishedDate: publishedDate,
                    position: _this.selectForm.position,
                    createTime: createTime,
                    updateTime: updateTime,
                    pageNum: _this.pageNum,
                    pageSize: _this.pageSize
                };
                _this.axios.post(api.baseUrl + "/book/getBooksList", _this.selectParamData)
                    .then(function (result) {
                        var response = result.data;
                        _this.loading = false;
                        if (response.suc) {
                            _this.bookDatas = response.value;
                        } else {
                            _this.$message.error("获取图书失败");
                        }
                    }
                ).catch(function (error) {
                    _this.loading = false;
                    _this.$message.error('获取图书失败');
                });
                _this.axios.post(api.baseUrl + "/book/getBooksCount", _this.selectParamData)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.totalNum = response.value;
                        }
                }).catch(function (error) {
                    _this.$message.error('获取总条数失败');
                });
            },
            searchAllBook() {
                var _this = this;
                _this.selectParamData.pageNum = -1;
                _this.axios.post(api.baseUrl + "/book/getBooksList", _this.selectParamData)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.bookAllData = response.value;
                            if (_this.bookAllData.length == 0) {
                                _this.$message.warning("暂无图书数据");
                                return;
                            }
                            _this.export2Excel();
                        } else {
                            _this.$message.error("获取图书失败");
                        }
                    }
                ).catch(function (error) {
                    _this.$message.error('获取图书失败');
                });
            },
            async previewImg(imgUrl) {
                var exist = await imageIsExist(imgUrl);
                if (exist) {
                    this.previewImgUrl = imgUrl;
                } else {
                    this.previewImgUrl = defaultImg;
                }
                this.imgVisible = true;
            },
            selectionChange(selection) {
                var _this = this;
                if (selection.length == 0) {
                    _this.selectedIds = [];
                } else {
                    selection.forEach(e => {
                        _this.selectedIds.push(e.bookId);
                    });
                }
            },
            deleteBooks() {
                var _this = this;
                if (_this.selectedIds.length == 0) {
                    _this.$message.warning("请选择需要删除的图书");
                    return;
                }
                _this.$confirm(`确定删除该图书数据？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(action => {
                    _this.axios.post(api.baseUrl + "/book/deleteByBookIds", {selectedIds: _this.selectedIds}).then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.$message.success("删除成功！");
                            _this.searchBooksButton();
                            _this.getBooksCount();
                         } else {
                            _this.$message.error("删除失败：" + response.msg);
                         }
                    });
                }).catch(() => {
                });
            },
            addBook() {
                this.$emit("update:showPage", "bookManage");
                this.$emit("update:pageType", "新增");
                this.$emit("update:bookData", {});
            },
            editBook(row) {
                this.$emit("update:showPage", "bookManage");
                this.$emit("update:pageType", "编辑");
                this.$emit("update:bookData", row);
            },
            details(row) {
                this.$emit("update:showPage", "bookDetail");
                this.$emit("update:pageType", "详情");
                this.$emit("update:bookData", row);
            },
            onMouseOver(index) {
                this.operateShow = index;
            },
            onMouseOut(index) {
                this.operateShow = null;
            },
            outExcel() {
                this.$confirm('此操作将导出Excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.searchAllBook();
                }).catch(() => {
                });
            },
            export2Excel() {
                require.ensure([], () => {
                    const tHeader = ['省份', '城市', '区/县', '一级分类', '二级分类', '书名', '副书名', '辑', '数量', '作者',
                                       '出版社', '出版时间', '简介', '存放位置', '备注', '录入者', '录入时间', '更新时间'];
                    const filterVal = ['province', 'city', 'district', 'classify', 'subClassify', 'bookName', 'bookSubName', 'series', 'quantity', 'author', 
                                        'publishing', 'publishedDate', 'summary', 'position', 'remarks', 'createUser', 'createTime', 'updateTime'];
                    const list = this.bookAllData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, this.classify + '图书列表');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]));
            },
            outSql() {
                this.$confirm('此操作将导出SQL文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.export2Sql();
                }).catch(() => {
                });
            },
            export2Sql() {
                var _this = this;
                _this.axios.post(api.baseUrl + "/book/exportSql")
                    .then(function (result) {
                        var response = result.data;
                        if (response) {
                            var time = _this.moment(new Date()).format("YYYYMMDDHHmmss");
                            _this.download("book_manage" + time + ".sql", response);
                        } else {
                            _this.$message.error("导出失败");
                        }
                }).catch(function (error) {
                    _this.$message.error('导出失败');
                });
            },
            download: function(fileName, text) {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', fileName);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            },
            exportContent(type) {
                var suffix = "";
                if (type == "pdf") {
                    suffix = ".pdf";
                } else {
                    suffix = ".docx";
                }
                this.$confirm('此操作将导出目录文件（' + suffix + '）, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.export2Content(type);
                }).catch(() => {
                });
            },
            export2Content(type) {
                var _this = this;
                _this.selectParamData.type = type;
                _this.axios.post(api.baseUrl + "/content/exportTotalContent", _this.selectParamData, {responseType: 'blob'})
                    .then(function (result) {
                        var response = result.data;
                        if (response) {
                            if (type == "pdf") {
                                _this.downloadContent(_this.classify + "图书目录.pdf", response);
                            } else {
                                _this.downloadContent(_this.classify + "图书目录.docx", response);
                            }
                        } else {
                            _this.$message.error("导出失败");
                        }
                }).catch(function (error) {
                    _this.$message.error('导出失败');
                });
            },
            downloadContent: function(fileName, text) {
                var element = document.createElement('a');
                element.setAttribute('href', URL.createObjectURL(text));
                element.setAttribute('download', fileName);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }
        }
    }
</script>

<style>
    input[type=file] {
        display: none;
    }
    .book-summary-single {
        padding: 6px;
        background: no-repeat right center, linear-gradient(90deg, rgb(152, 253, 121) 0%, #54ABFF 100%);
        text-align: center;
        vertical-align: middle;
        border-radius: 4px;
        color: #fff;
        font-size: 16px;
        line-height: 17px;
    }
    .book .glyphicon {
        top: 2px !important;
    }
    .book-repeat .glyphicon {
        top: 0px !important;
    }
    .book .glyphicon span {
        padding-left: 4px;
    }
    .book-repeat .glyphicon span {
        padding-left: 4px;
    }
    .book-repeat .glyphicon-repeat:before {
        content: "\E030";
        font-size: 12px;
    }
</style>