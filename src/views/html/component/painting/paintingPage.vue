<template>
    <div>
        <div v-if="showPage !== 'paintingHome'" class="main-header">
            <el-row>
                <el-col :span="12">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item ><a @click="showPaintingHome">{{ classify }}</a></el-breadcrumb-item>
                        <el-breadcrumb-item>{{ pageType }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="12">
                    <div style="float: right; margin-right: 10px">
                        <i class="el-icon-arrow-left"></i>
                        <a href="javascript:void(0);" @click="showPaintingHome">返回</a>
                    </div>
                </el-col>
            </el-row>
        </div>
        <painting-home v-if="showPage == 'paintingHome'" :classify="classify" :bookData.sync="bookData" :showPage.sync="showPage" :pageType.sync="pageType"></painting-home>
        <painting-manage v-if="showPage == 'paintingManage'" :classify="classify" :bookData="bookData" :showPage.sync="showPage"></painting-manage>
        <painting-detail v-if="showPage == 'paintingDetail'" :classify="classify" :data="bookData" :showPage.sync="showPage"></painting-detail>
    </div>
</template>

<script>
    import api from '../../../../constant/api'
    import Vue from 'vue'
    import Moment from 'moment'
    Vue.prototype.moment = Moment
    import paintingHome from './paintingHome.vue'
    import paintingManage from './paintingManage.vue'
    import paintingDetail from './paintingDetail.vue'

    export default {
        name: 'paintingPage',
        props: ['classify'],
        components: { 
            'painting-home': paintingHome,
            'painting-manage': paintingManage,
            'painting-detail': paintingDetail
        },
        data () {
            return {
                showPage: 'paintingHome',
                pageType: '',
                bookData: {}
            }
        },
        methods: {
            showPaintingHome() {
                this.showPage = 'paintingHome';
            }
        }
    }
</script>

<style>
    .main-header {
        height: 30px;
        border-bottom: 1px #ddd solid;
    }
</style>