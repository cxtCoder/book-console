<template>
    <div>
        <div v-if="showPage !== 'relicHome'" class="main-header">
            <el-row>
                <el-col :span="12">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item ><a @click="showRelicHome">{{ classify }}</a></el-breadcrumb-item>
                        <el-breadcrumb-item>{{ pageType }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="12">
                    <div style="float: right; margin-right: 10px">
                        <i class="el-icon-arrow-left"></i>
                        <a href="javascript:void(0);" @click="showRelicHome">返回</a>
                    </div>
                </el-col>
            </el-row>
        </div>
        <relic-home v-if="showPage == 'relicHome'" :classify="classify" :bookData.sync="bookData" :showPage.sync="showPage" :pageType.sync="pageType"></relic-home>
        <relic-manage v-if="showPage == 'relicManage'" :classify="classify" :bookData="bookData" :showPage.sync="showPage"></relic-manage>
        <relic-detail v-if="showPage == 'relicDetail'" :classify="classify" :data="bookData" :showPage.sync="showPage"></relic-detail>
    </div>
</template>

<script>
    import api from '../../../../constant/api'
    import Vue from 'vue'
    import Moment from 'moment'
    Vue.prototype.moment = Moment
    import relicHome from './relicHome.vue'
    import relicManage from './relicManage.vue'
    import relicDetail from './relicDetail.vue'

    export default {
        name: 'relicPage',
        props: ['classify'],
        components: { 
            'relic-home': relicHome,
            'relic-manage': relicManage,
            'relic-detail': relicDetail
        },
        data () {
            return {
                showPage: 'relicHome',
                pageType: '',
                bookData: {}
            }
        },
        methods: {
            showRelicHome() {
                this.showPage = 'relicHome';
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