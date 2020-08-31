<template>
    <div>
        <div style="padding-top: 20px">
            <el-row type="flex">
                <el-col :span="19" :offset="5">
                    <el-steps :active="active" align-center>
                        <el-step title="基本信息"></el-step>
                        <el-step title="目录信息"></el-step>
                        <el-step title="其他信息"></el-step>
                    </el-steps>
                </el-col>
            </el-row>
            <div style="margin-bottom: 20px"></div>
            <el-row v-if="active === 1">
                <el-col :span="13" :offset="4">
                    <el-form :model="bookForm" ref="bookForm" :rules="bookRules" label-position="right" label-width="100px">
                        <el-form-item label="书名" prop="bookName">
                            <el-input v-model="bookForm.bookName"></el-input>
                        </el-form-item>
                        <el-form-item label="副书名" prop="bookSubName">
                            <el-input v-model="bookForm.bookSubName"></el-input>
                        </el-form-item>
                        <el-form-item label="辑" prop="series">
                            <el-row>
                                <el-col :span="12">
                                    <el-input v-model="bookForm.series"></el-input>
                                </el-col>
                                <el-col :span="8">
                                    <el-input-number v-model="bookForm.seriesOrder" controls-position="right" :min="0"></el-input-number>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="数量" prop="quantity">
                            <el-input-number v-model="bookForm.quantity" :min="1" label="数量"></el-input-number>
                        </el-form-item>
                        <el-form-item label="作者" prop="author">
                            <el-input v-model="bookForm.author"></el-input>
                        </el-form-item>
                        <el-form-item label="出版社" prop="publishing">
                            <el-input v-model="bookForm.publishing"></el-input>
                        </el-form-item>
                        <el-form-item label="出版日期" prop="publishedDate">
                            <el-date-picker v-model="bookForm.publishedDate" type="date" :picker-options="pickerOptions"
                                :editable="false" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="图书封面">
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
                    </el-form>
                </el-col>
            </el-row>
            <div v-if="active === 2">
                <div class="content-part">
                    <el-row>
                        <el-col :span="22" :offset="1">
                            <div style="padding-top: 10px">
                                <el-button type="info" icon="plus" size="small" v-on:click="addContent">添加一级目录</el-button>
                                <div style="padding: 10px 0">
                                    <div v-if="imgShow" class="bg-position">
                                        <el-row>
                                            <el-col>
                                                <img :src="bgImg"/>
                                            </el-col>
                                            <el-col>
                                                <span>暂无数据～</span>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <div v-else>
                                        <el-tree ref="contentTree" node-key="id" :data="bookForm.contentData" :render-content="renderContent" accordion
                                            empty-text="" :default-expanded-keys="defaultExpandKeys" @node-click="handleNodeClick" highlight-current></el-tree>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22" :offset="1">
                            <div style="padding: 10px 0">
                                <el-input v-if="areaShow" type="textarea" :rows="8" v-model="newDesc" placeholder="请输入当前目录内容" :disabled="areaDisabled" @input="editAreaDesc"></el-input>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div style="padding-bottom: 20px"></div>
            </div>
            <el-row v-if="active === 3">
                <el-col :span="13" :offset="4">
                    <el-form :model="bookForm" ref="bookMoreForm" :rules="bookRules" label-position="right" label-width="100px">
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
                    <el-col :span="2" v-if="active === 1">
                        <el-button @click="returnPage">取消</el-button>
                    </el-col>
                    <el-col :span="2" v-if="active === 1">
                        <el-button type="primary" @click="contentStep">下一步</el-button>
                    </el-col>
                    <el-col :span="2" v-if="active === 2">
                        <el-button @click="basicStep">上一步</el-button>
                    </el-col>
                    <el-col :span="2" v-if="active === 2">
                        <el-button type="primary" @click="otherStep">下一步</el-button>
                    </el-col>
                    <el-col :span="2" v-if="active === 3">
                        <el-button @click="retContentStep">上一步</el-button>
                    </el-col>
                    <el-col :span="2" v-if="active === 3">
                        <el-button type="primary" @click="saveBookButton">保存</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
        <el-dialog title="分类管理" :visible.sync="classifyVisible" :before-close="cancelClassify">
            <book-classify :classify="classify"></book-classify>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../../../constant/api'
    import Vue from 'vue'
    import vDistpicker from 'v-distpicker'
    import bookClassify from './bookClassify.vue'
    import bgImg from '../../../../assets/images/bg-blank.png'
    import Moment from 'moment'
    Vue.prototype.moment = Moment

    export default {
        name: 'bookManage',
        props: ['classify', 'bookData'],
        components: { vDistpicker, bookClassify },
        data () {
            return {
                active: 1,
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
                    seriesOrder: '',
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
                        { required: true, message: '请填写书名', trigger: 'blur' }
                    ],
                    series: [
                        { required: true, message: '请填写辑及辑次序', trigger: 'blur' }
                    ],
                    author: [
                        { required: true, message: '请填写作者', trigger: 'blur' }
                    ],
                    publishing: [
                        { required: true, message: '请填写出版社', trigger: 'blur' }
                    ],
                    publishedDate: [
                        { type: 'date', required: true, message: '请选择出版日期', trigger: 'change' }
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
                },
                bgImg: bgImg,
                newLabel: '',
                newAuthor: '',
                newStartPage: '',
                newDesc: '',
                areaShow: false,
                imgShow: false,
                areaDisabled: false, 
                defaultExpandKeys: [],
                isAddContent: true,
                editId: '',
                editDesc: {},
                existEdit: false,
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
                        seriesOrder: _this.bookData.seriesOrder,
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
                    _this.buttonDisabled = true;
                    if (_this.bookForm.contentData.length == 0) {
                        _this.imgShow = true;
                        _this.areaShow = false;
                    }
                } else {
                    _this.imgShow = true;
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
                this.$emit('update:showPage', 'bookHome');
            },
            contentStep() {
                var _this = this;
                _this.$refs['bookForm'].validate((valid) => {
                    if (valid) {
                        if (_this.fileLength == 0) {
                            _this.$alert("请上传图书封面", '提示', {
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
                        _this.active = 2;
                    }
                });
            },
            retContentStep() {
                this.active = 2;
            },
            basicStep() {
                this.active = 1;
                this.areaShow = false;
            },
            otherStep() {
                if (!this.isAddContent) {
                    this.$message.warning("请先保存正在编辑的目录信息");
                    return;
                }
                this.active = 3;
                this.areaShow = false;
            },
            renderContent(h, { node, data, store }) {
                var _this = this;
                return h('span', {}, [
                    h('el-tooltip', {
                        props: {
                            effect: 'light',
                            placement: 'right-start',
                            content: data.label
                        },
                        style: {
                            display: data.isEdit ? 'none' : ''
                        },
                    }, [
                        h('span', {}, data.label.length > 50 ? data.label.substring(0, 50) + '...' : data.label)
                    ]),
                    h('el-input', {
                        props: {
                            size: 'small',
                            placeholder: '请输入目录名称',
                            maxlength: 100,
                            value: _this.newLabel
                        },
                        style: {
                            display: data.isEdit ? '' : 'none',
                            width: '50%'
                        },
                        on: {
                            input: (value) => {
                                _this.newLabel = value;
                            }
                        }
                    }),
                    h('el-input', {
                        props: {
                            size: 'small',
                            placeholder: '请输入作者',
                            maxlength: 50,
                            value: _this.newAuthor
                        },
                        style: {
                            display: data.isEdit ? '' : 'none',
                            width: '20%'
                        },
                        on: {
                            input: (value) => {
                                _this.newAuthor = value;
                            }
                        }
                    }),
                    h('el-input', {
                        props: {
                            size: 'small',
                            placeholder: '请输入页码',
                            maxlength: 100,
                            value: _this.newStartPage
                        },
                        style: {
                            display: data.isEdit ? '' : 'none',
                            width: '15%'
                        },
                        on: {
                            input: (value) => {
                                _this.newStartPage = value;
                            }
                        }
                    }),           
                    h('el-button', {
                        props: {
                            type: 'text',
                            icon: 'delete'
                        },
                        style: {
                            float: 'right',
                            marginLeft: '10px'
                        },
                        on: {
                            click: (e) => {
                                _this.removeConfirm(e, node, data);
                            }
                        }
                    }),
                    h('el-button', {
                        props: {
                            type: 'text',
                            icon: 'edit'
                        },
                        style: {
                            float: 'right',
                            display: data.isEdit ? 'none' : ''
                        },
                        on: {
                            click: (e) => {
                                _this.edit(e, data);
                            }
                        }
                    }),
                    h('el-button', {
                        props: {
                            type: 'text',
                            icon: 'check'
                        },
                        style: {
                            color: '#67c23a',
                            float: 'right',
                            display: data.isEdit ? '' : 'none',
                        },
                        on: {
                            click: (e) => {
                                _this.submitEdit(e, data);
                            }
                        }
                    }),
                    h('el-button', {
                        props: {
                            type: 'text',
                            icon: 'plus'
                        },
                        style: {
                            float: 'right',
                            display: data.level == 5 || data.isEdit ? 'none' : ''
                        },
                        on: {
                            click: (e) => {
                                _this.append(e, data);
                            }
                        }
                    }),
                    h('el-tooltip', {
                        props: {
                            effect: 'light',
                            placement: 'right-start',
                            content: '第(' + data.startPage + ')页'
                        },
                        style: {
                            display: data.isEdit ? 'none' : ''
                        },
                    }, [
                        h('span', {
                            style: {
                                float: 'right',
                                marginRight: '10px',
                                color: '#67c23a',
                                display: data.isEdit ? 'none' : ''
                            }
                        }, data.startPage.length > 10 ? '第(' + data.startPage.substring(0, 10) + '...)页' : '第(' + data.startPage + ')页')
                    ]),
                    h('el-tooltip', {
                        props: {
                            effect: 'light',
                            placement: 'right-start',
                            content: data.author
                        },
                        style: {
                            display: data.isEdit ? 'none' : ''
                        },
                    }, [
                        h('span', {
                            style: {
                                float: 'right',
                                marginRight: '10px',
                                color: '#cc9966',
                                display: data.isEdit ? 'none' : ''
                            }
                        }, data.author == null ? '' : (data.author.length > 15 ? data.author.substring(0, 15) + '...' : data.author))
                    ])
				]);
            },
            addContent() {
                if (!this.isAddContent) {
                    this.$message.warning("请先保存正在编辑的目录信息");
                    return;
                }
                const newNode = {
                    id: new Date().getTime(), 
                    upperId: '-1',
                    label: '',
                    author: '',
                    desc: '',
                    startPage: '',
                    isEdit: true,
                    level: 1,
                    children: []
                };
                this.bookForm.contentData.push(newNode);
                this.isAddContent = false;
                this.defaultExpandKeys.push(newNode.id);
                this.areaShow = true;
                this.imgShow = false;
                this.areaDisabled = false;
                this.newDesc = "";
                this.editId = newNode.id;
            },
            append(e, data) {
                e.stopPropagation();
                if (!this.isAddContent) {
                    this.$message.warning("请先保存正在编辑的目录信息");
                    return;
                }
                const newChild = {
                    id: new Date().getTime(), 
                    upperId: data.id,
                    label: '',
                    author: '',
                    startPage: '',
                    desc: '',
                    isEdit: true,
                    level: data.level + 1,
                    children: []
                };
                if (!data.children) {
                    this.$set(data, "children", []);
                }
                data.children.push(newChild);
                this.isAddContent = false;
                this.defaultExpandKeys.push(newChild.id);
                this.areaShow = true;
                this.imgShow = false;
                this.areaDisabled = false;
                this.newDesc = "";
                this.editId = newChild.id;
            },
            edit(e, data) {
                // e.stopPropagation();
                if (!this.isAddContent) {
                    this.$message.warning("请先保存正在编辑的目录信息");
                    return;
                }
                this.$set(data, "isEdit", true);
                this.newLabel = data.label;
                this.newAuthor = data.author;
                this.newStartPage = data.startPage;
                this.isAddContent = false;
                this.areaShow = true;
                this.imgShow = false;
                this.areaDisabled = false;
                this.editId = data.id;
            },
            submitEdit(e, data) {
                // e.stopPropagation();
                if (this.newLabel == "") {
                    this.$message.warning("目录名称不能为空");
                    return;
                }
                if (this.newStartPage == "") {
                    this.$message.warning("页码不能为空");
                    return;
                }
                if(!(/(^[1-9]\d*$)/.test(this.newStartPage))){
                    this.$message.warning("请输入正确的页码格式");
                    return;
                }
                this.$set(data, "isEdit", false);
                this.$set(data, "label", this.newLabel);
                this.$set(data, "author", this.newAuthor);
                this.$set(data, "startPage", this.newStartPage);
                var desc = this.editDesc[this.editId] == undefined ? "" : this.editDesc[this.editId];
                this.$set(data, "desc", desc);
                this.newLabel = "";
                this.newAuthor = "";
                this.newStartPage = "";
                this.isAddContent = true;
            },
            removeConfirm(e, node, data) {
                var _this = this;
                e.stopPropagation();
                if (data.children && data.children.length > 0) {
                    _this.$confirm(`确定删除当前目录及子目录数据？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(action => {
                        _this.remove(node, data);
                    }).catch(() => {
                    });
                } else {
                    _this.remove(node, data);
                }
            },
            remove(node, data) {
                this.existEdit = false;
                this.findEdit(data);
                if (data.isEdit || this.existEdit) {
                    this.isAddContent = true;
                    this.newLabel = "";
                    this.newAuthor = "";
                    this.newStartPage = "";
                }
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
                const expandIndex = this.defaultExpandKeys.indexOf(data.id);
                this.defaultExpandKeys.splice(expandIndex, 1);
                if (data.level == 1) {
                    this.areaShow = false;
                }
                this.imgShow = false;
                if (this.bookForm.contentData.length == 0) {
                    this.imgShow = true;
                }
            },
            findEdit(tree) {
                var _this = this;
                if (tree.children) {
                    for (var i = 0; i < tree.children.length; i++) {
                        let node = tree.children[i];
                        if (node.isEdit) {
                            _this.existEdit = true;
                        } else {
                            _this.findEdit(node);
                        }
                    }
                }
            },
            handleNodeClick(data) {
                this.areaShow = true;
                if (data.isEdit) {
                    this.areaDisabled = false;
                    if (this.editDesc[this.editId] == undefined) {
                        this.newDesc = data.desc;
                        this.editDesc[this.editId] = data.desc;
                    } else {
                        this.newDesc = this.editDesc[this.editId];
                    }
                } else {
                    this.areaDisabled = true;
                    this.newDesc = data.desc;
                }
            },
            editAreaDesc(value) {
                this.editDesc[this.editId] = value;
            },
            saveBookButton() {
                var _this = this;
                _this.$refs['bookMoreForm'].validate((valid) => {
                    if (valid) {
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
    .content-part {
        border: 1px rgb(193, 205, 255) solid; 
        border-radius: 4px; 
    }
    .el-tree {
        border: 0px !important;
    }
    .step-footer {
        border-bottom: 1px #ddd solid;
    }
    .bg-position {
        display: flex;
        justify-content: center;
        text-align: center;
        align-items: center;
    }
</style>