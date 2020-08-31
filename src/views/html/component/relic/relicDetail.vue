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
                    <span style="color: rgb(104, 171, 248)">年代：</span>
                    <span>{{ data.bookSubName }}</span>
                </div>
                <div>
                    <span style="color: rgb(104, 171, 248)">数量：</span>
                    <span style="color: rgb(255, 100, 100)">{{ data.quantity }}（件）</span>
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
                            <span style="font-weight: 700">名称：</span><span>{{ data.bookName }}</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="font-weight: 700">级别：</span><span>{{ data.author }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span style="font-weight: 700">所属年代：</span><span>{{ data.bookSubName }}</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="font-weight: 700">出土地点：</span><span>{{ data.publishing }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span style="font-weight: 700">出土日期：</span><span>{{ data.publishedDate }}</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="font-weight: 700">录入者：</span><span>{{ data.createUser }}</span>
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
                <div class="book-info"><span>文物简介</span></div>
                <div class="book-tab" style="padding: 10px">
                    <p v-if="data.summary.length > 0">{{ data.summary }}</p>
                    <div v-else style="text-align: center; padding: 12px"><span>暂无数据</span></div>
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
    import defaultImg from '../../../../assets/images/default_relic.jpg'
    import {imageIsExist} from '../../../../utils/imgutil'
    import Vue from 'vue'
    import Moment from 'moment'
    Vue.prototype.moment = Moment
    const oriUrl = window.LOCAL_CONFIG.oriUrl;
    const thumbUrl = window.LOCAL_CONFIG.thumbUrl;
    const thumbPrefix = window.LOCAL_CONFIG.thumbPrefix;

    export default {
        name: 'relicDetail',
        props: ['classify', 'data'],
        data () {
            return {
                oriUrl: oriUrl,
                thumbUrl: thumbUrl,
                thumbPrefix: thumbPrefix,
                imgVisible: false,
                defaultImg: defaultImg,
                previewImgUrl: ''
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