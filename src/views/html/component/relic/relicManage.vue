<template>
    <div>
        <div style="padding-top: 20px">
            <el-row>
                <el-col :span="13" :offset="4">
                    <el-form :model="bookForm" ref="bookForm" :rules="bookRules" label-position="right" label-width="100px">
                        <el-form-item label="名称" prop="bookName">
                            <el-input v-model="bookForm.bookName"></el-input>
                        </el-form-item>
                        <el-form-item label="级别" prop="author">
                            <el-input v-model="bookForm.author"></el-input>
                        </el-form-item>
                        <el-form-item label="所属年代" prop="bookSubName">
                            <el-input v-model="bookForm.bookSubName"></el-input>
                        </el-form-item>
                        <el-form-item label="出土地点" prop="publishing">
                            <el-input v-model="bookForm.publishing"></el-input>
                        </el-form-item>
                        <el-form-item label="出土日期" prop="publishedDate">
                            <el-date-picker v-model="bookForm.publishedDate" type="date" :picker-options="pickerOptions"
                                :editable="false" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="数量" prop="quantity">
                            <el-input-number v-model="bookForm.quantity" :min="1" label="数量"></el-input-number>
                        </el-form-item>
                        <el-form-item label="文物图片">
                            <el-upload
                                    :action="uploadUrl"
                                    accept="image/jpeg,image/gif,image/png"
                                    :before-upload="beforeUpload"
                                    :on-success="handleSuccess"
                                    :on-error="handleError"
                                    :on-remove="onRemove"
                                    :limit="1"
                                    :file-list="fileList">
                                <el-button type="primary" :disabled="buttonDisabled">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="分类" prop="classifyId">
                            <el-select v-model="bookForm.classifyId" filterable clearable>
                                <el-option v-for="item in subClassifyOptions"
                                    :key="item.id" :value="item.id" :label="item.name">
                                </el-option>
                            </el-select>
                            <el-button type="info" @click="manageClassify">管理</el-button>
                        </el-form-item>
                        <el-form-item label="地区">
                            <v-distpicker :placeholders="placeholders" 
                                :province="bookForm.province" :city="bookForm.city" :area="bookForm.district" 
                                @selected="onSelected">
                            </v-distpicker>
                        </el-form-item>
                        <el-form-item label="存放位置" prop="position">
                            <el-input v-model="bookForm.position"></el-input>
                        </el-form-item>
                        <el-form-item label="录入者" prop="userId">
                            <el-select v-model="bookForm.userId" filterable clearable>
                                <el-option v-for="item in userOptions"
                                    :key="item.id" :value="item.id" :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="简介" prop="summary">
                            <el-input type="textarea" :rows="10" v-model="bookForm.summary"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remarks">
                            <el-input type="textarea" :rows="5" v-model="bookForm.remarks"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div class="step-footer"></div>
            <div style="margin-top: 10px">
                <el-row type="flex" justify="center">
                    <el-col :span="2">
                        <el-button @click="returnPage">取消</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" @click="saveBookButton">保存</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
        <el-dialog title="分类管理" :visible.sync="classifyVisible" :before-close="cancelClassify">
            <relic-classify :classify="classify"></relic-classify>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../../../constant/api'
    import Vue from 'vue'
    import vDistpicker from 'v-distpicker'
    import relicClassify from './relicClassify.vue'
    import Moment from 'moment'
    Vue.prototype.moment = Moment

    export default {
        name: 'relicManage',
        props: ['classify', 'bookData'],
        components: { vDistpicker, relicClassify },
        data () {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                bookForm: {
                    bookId: '',
                    bookName: '',
                    bookSubName: '',
                    author: '',
                    publishing: '',
                    publishedDate: '',
                    summary: '',
                    remarks: '',
                    thumbPath: '',
                    classifyId: '',
                    series: '',
                    quantity: '',
                    province: '',
                    city: '',
                    district: '',
                    position: '',
                    userId: '',
                    contentData: []
                },
                uploadUrl: api.baseUrl + "/book/uploadImage",
                fileList: [],
                fileLength: 0,
                buttonDisabled: false,
                subClassifyOptions: [],
                userOptions: {},
                classifyVisible: false,
                placeholders: {
                    province: '省份',
                    city: '城市',
                    area: '区/县',
                },
                bookRules: {
                    bookName: [
                        { required: true, message: '请填写名称', trigger: 'blur' }
                    ],
                    bookSubName: [
                        { required: true, message: '请填写所属年代', trigger: 'blur' }
                    ],
                    publishing: [
                        { required: true, message: '请填写出土地点', trigger: 'blur' }
                    ],
                    publishedDate: [
                        { type: 'date', required: true, message: '请选择出土日期', trigger: 'change' }
                    ],
                    classifyId: [
                        { required: true, message: '请选择分类', trigger: 'change' }
                    ],
                    userId: [
                        { required: true, message: '请选择录入者', trigger: 'change' }
                    ],
                    summary: [
                        { required: true, message: '请填写简介', trigger: 'change' }
                    ]
                }
            }
        },
        created() {
            this.initBookData();
            this.getSubClassify();
            this.getAllUser();
        },
        methods: {
            initBookData() {
                var _this = this;
                if (_this.bookData.bookId != undefined) {
                    _this.bookForm = {
                        bookId: _this.bookData.bookId,
                        bookName: _this.bookData.bookName,
                        bookSubName: _this.bookData.bookSubName,
                        author: _this.bookData.author,
                        publishing: _this.bookData.publishing,
                        publishedDate: new Date(_this.bookData.publishedDate),
                        summary: _this.bookData.summary,
                        remarks: _this.bookData.remarks,
                        thumbPath: _this.bookData.thumbPath,
                        classifyId: _this.bookData.classifyId,
                        series: _this.bookData.series,
                        quantity: _this.bookData.quantity,
                        province: _this.bookData.province,
                        city: _this.bookData.city,
                        district: _this.bookData.district,
                        position: _this.bookData.position,
                        userId: _this.bookData.userId,
                        contentData: _this.bookData.contentData
                    };
                    _this.fileList.push({
                        name: _this.bookData.thumbPath,
                        id: _this.bookData.thumbPath.split('.')[0],
                        url: _this.bookData.thumbPath
                    });
                    _this.fileLength = 1;
                }
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
            getAllUser() {
                var _this = this;
                _this.axios.post(api.baseUrl + "/user/getAllUser")
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.userOptions = response.value;
                        }
                    }
                );
            },
            beforeUpload(file) {
                if(this.fileLength == 1){
                   this.$message.warning(`当前限制上传 1 个图片`);
                   return false;
                } else {
                   return true;
                }
            },
            handleSuccess(response, file, fileList) {
                var _this = this;
                if (response.suc) {
                    var value = response.value;
                    _this.fileList.push({name: file.name, id: value.split('.')[0], url: value});
                    _this.fileLength = 1;
                    _this.bookForm.thumbPath = value;
                    _this.buttonDisabled = true;
                } else {
                    _this.uploadError();
                }
            },
            handleError(err, file, fileList) {
                this.uploadError();
            },
            uploadError() {
                this.fileList = [];
                this.fileLength = 0;
                this.bookForm.thumbPath = "";
                this.$message.error("上传失败！");
            },
            onRemove(file, fileList) {
                if(fileList.length == 0) {
                  this.fileLength = 0;
                }
                this.fileList = fileList;
                this.bookForm.thumbPath = "";
                this.buttonDisabled = false;
            },
            manageClassify() {
                var _this = this;
                _this.classifyVisible = true;
            },
            cancelClassify() {
                var _this = this;
                _this.classifyVisible = false;
                _this.getSubClassify();
            },
            onSelected(data) {
                this.bookForm.province = data.province.value;
                this.bookForm.city = data.city.value;
                this.bookForm.district = data.area.value;
            },
            returnPage() {
                this.$emit('update:showPage', 'relicHome');
            },
            saveBookButton() {
                var _this = this;
                _this.$refs['bookForm'].validate((valid) => {
                    if (valid) {
                        if (_this.fileLength == 0) {
                            _this.$alert("请上传文物图片", '提示', {
                                type: 'warning'
                            }).catch(function(reason) {
                            });
                            return;
                        }
                        if (_this.bookForm.district == '区/县' || _this.bookForm.district == "") {
                            _this.$alert("请选择地区信息", '提示', {
                                type: 'warning'
                            }).catch(function(reason) {
                            });
                            return;
                        }
                        _this.saveBook();
                    }
                });
            },
            saveBook() {
                var _this = this;
                var publishedDate = _this.moment(_this.bookForm.publishedDate).format("YYYY-MM-DD");
                _this.bookForm.publishedDate = publishedDate;
                _this.axios.post(api.baseUrl + "/book/saveBook", _this.bookForm)
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.$message.success("保存成功");
                            _this.returnPage();
                        } else {
                            _this.$message.error("保存失败");
                        }
                    }
                );
            }
        }
    }
</script>

<style>
    .step-footer {
        border-bottom: 1px #ddd solid;
    }
</style>