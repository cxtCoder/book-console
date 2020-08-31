<template>
    <div>
        <el-row style="padding: 10px 0">
            <el-col :span="4">
                <img 
                :src="defaultImg" width="150" height="150" 
                v-real-img="thumbUrl + data.thumbPath"
                @click="previewImg(oriUrl + data.thumbPath.replace(thumbPrefix, ''))"
                style="cursor: pointer"
            />
            </el-col>
            <el-col :span="19" class="book-basic">
                <div><label style="font-size: 20px">{{ data.bookName }}</label></div>
                <div>
                    <span style="color: rgb(104, 171, 248)">辑：</span>
                    <span>{{ data.series }}</span>
                </div>
                <div>
                    <span style="color: rgb(104, 171, 248)">数量：</span>
                    <span style="color: rgb(255, 100, 100)">{{ data.quantity }}（本）</span>
                </div>
                <div>
                    <span style="color: rgb(104, 171, 248)">分类：</span>
                    <span>{{ data.classify }} / {{ data.subClassify }}</span>
                </div>
                <div>
                    <span style="color: rgb(104, 171, 248)">地区：</span>
                    <span>{{ data.province }} / {{ data.city }} / {{ data.district }}</span>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <div class="book-info"><span>基本信息</span></div>
                <div class="book-tab" style="padding: 10px">
                    <el-row>
                        <el-col :span="12">
                            <span style="font-weight: 700">书名：</span><span>{{ data.bookName }}</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="font-weight: 700">副书名：</span><span>{{ data.bookSubName }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span style="font-weight: 700">作者：</span><span>{{ data.author }}</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="font-weight: 700">录入者：</span><span>{{ data.createUser }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span style="font-weight: 700">出版社：</span><span>{{ data.publishing }}</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="font-weight: 700">出版日期：</span><span>{{ data.publishedDate }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span style="font-weight: 700">录入时间：</span><span>{{ data.createTime }}</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="font-weight: 700">更新时间：</span><span>{{ data.updateTime }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span style="font-weight: 700">存放位置：</span>
                            <span>{{ data.position }}</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="font-weight: 700">备注：</span>
                            <span>{{ data.remarks }}</span>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <div class="book-info"><span>图书简介</span></div>
                <div class="book-tab" style="padding: 10px">
                    <p v-if="data.summary.length > 0">{{ data.summary }}</p>
                    <div v-else style="text-align: center; padding: 12px"><span>暂无数据</span></div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <div class="book-info">
                    <span>图书目录</span>
                    <el-dropdown trigger="click" style="float: right; margin-right: 10px">
                        <span class="el-dropdown-link">
                            <el-tooltip effect="dark" content="导出图书目录" placement="top-start">
                                <a v-if="data.contentData != null && data.contentData.length > 0"
                                    class="glyphicon glyphicon-export">
                                </a>
                            </el-tooltip>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="exportContent('pdf')">PDF格式</el-dropdown-item>
                            <el-dropdown-item @click.native="exportContent('word')">Word格式</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="book-tab" style="padding: 10px">
                    <el-row>
                        <el-col>
                            <el-tree ref="contentTree" node-key="id" :data="data.contentData" accordion
                                :render-content="renderContent" @node-click="handleNodeClick" highlight-current></el-tree>
                        </el-col>
                    </el-row>
                    <div style="padding-top: 10px; border-bottom: 1px #ddd solid">
                        <span style="font-weight: 700">目录描述</span>
                    </div>
                    <el-row>
                        <el-col>
                            <p v-if="contentDesc != ''">{{ contentDesc }}</p>
                            <div v-else style="text-align: center; padding: 12px"><span>暂无数据</span></div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
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
    import defaultImg from '../../../../assets/images/default_book.jpg'
    import {imageIsExist} from '../../../../utils/imgutil'
    import Vue from 'vue'
    import Moment from 'moment'
    Vue.prototype.moment = Moment
    const oriUrl = window.LOCAL_CONFIG.oriUrl;
    const thumbUrl = window.LOCAL_CONFIG.thumbUrl;
    const thumbPrefix = window.LOCAL_CONFIG.thumbPrefix;

    export default {
        name: 'bookDetail',
        props: ['classify', 'data'],
        data () {
            return {
                oriUrl: oriUrl,
                thumbUrl: thumbUrl,
                thumbPrefix: thumbPrefix,
                imgVisible: false,
                defaultImg: defaultImg,
                previewImgUrl: '',
                contentDesc: ''
            }
        },
        created() {
        },
        methods: {
            async previewImg(imgUrl) {
                var exist = await imageIsExist(imgUrl);
                if (exist) {
                    this.previewImgUrl = imgUrl;
                } else {
                    this.previewImgUrl = defaultImg;
                }
                this.imgVisible = true;
            },
            renderContent(h, { node, data, store }) {
                return h('span', {}, [
                    h('span', {}, data.label),
                    h('span', {
                        style: {
                            float: 'right',
                            color: '#67c23a'
                        }
                    }, '(第' + data.startPage + '页)'),
                    h('span', {
                        style: {
                            float: 'right',
                            marginRight: '10px',
                            color: '#cc9966'
                        }
                    }, data.author)
				]);
            },
            handleNodeClick(data) {
                this.contentDesc = data.desc;
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
                _this.axios.get(api.baseUrl + "/content/exportContent?id=" + _this.data.bookId + "&type=" + type, {responseType: 'blob'})
                    .then(function (result) {
                        var response = result.data;
                        if (response) {
                            if (type == "pdf") {
                                _this.download(_this.data.classify + "-《" + _this.data.bookName + "》-" + _this.data.series + "图书目录.pdf", response);
                            } else {
                                _this.download(_this.data.classify + "-《" + _this.data.bookName + "》-" + _this.data.series + "图书目录.docx", response);
                            }
                        } else {
                            _this.$message.error("导出失败");
                        }
                }).catch(function (error) {
                    _this.$message.error('导出失败');
                });
            },
            download: function(fileName, text) {
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

<style lang="scss">
    .book-info {
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
        };
        background: no-repeat right center, linear-gradient(90deg, rgb(207, 237, 247) 10%, rgb(102, 178, 250) 100%);
    }
    .book-basic span {
        font-size: 14px;
        line-height: 28px;
    }
    .book-tab p {
        font-size: 14px;
        line-height: 20px;
        text-indent: 2em;
    }
    .book-tab span {
        font-size: 14px;
        line-height: 30px;
    }
</style>