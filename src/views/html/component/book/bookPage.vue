<template>
    <div>
        <div v-if="showPage !== 'bookHome'" class="main-header">
            <el-row>
                <el-col :span="12">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item ><a @click="showBookHome">{{ classify }}图书</a></el-breadcrumb-item>
                        <el-breadcrumb-item>{{ pageType }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="12">
                    <div style="float: right; margin-right: 10px">
                        <i class="el-icon-arrow-left"></i>
                        <a href="javascript:void(0);" @click="showBookHome">返回</a>
                    </div>
                </el-col>
            </el-row>
        </div>
        <book-home v-if="showPage == 'bookHome'" :classify="classify" :bookData.sync="bookData" :showPage.sync="showPage" :pageType.sync="pageType"></book-home>
        <book-manage v-if="showPage == 'bookManage'" :classify="classify" :bookData="bookData" :showPage.sync="showPage"></book-manage>
        <book-detail v-if="showPage == 'bookDetail'" :classify="classify" :data="bookData" :showPage.sync="showPage"></book-detail>
    </div>
</template>

<script>
    import api from '../../../../constant/api'
    import Vue from 'vue'
    import Moment from 'moment'
    Vue.prototype.moment = Moment
    import bookHome from './bookHome.vue'
    import bookManage from './bookManage.vue'
    import bookDetail from './bookDetail.vue'

    export default {
        name: 'bookPage',
        props: ['classify'],
        components: { 
            'book-home': bookHome,
            'book-manage': bookManage,
            'book-detail': bookDetail
        },
        data () {
            return {
                showPage: 'bookHome',
                pageType: '',
                bookData: {}
            }
        },
        methods: {
            showBookHome() {
                this.showPage = 'bookHome';
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