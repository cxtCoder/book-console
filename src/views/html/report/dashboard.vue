<template>
    <div>
        <div class="summary-number">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="book-summary-number">
                        <el-row>
                            <el-col :span="6" style="color: #409EFF">
                                <i class="glyphicon glyphicon-book icon-number"></i>
                            </el-col>
                            <el-col :span="18">
                                <h3>馆藏图书</h3>
                                <h4>{{bookNumber}}<span class="unit-number">本</span></h4>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="painting-summary-number">
                        <el-row>
                            <el-col :span="6" style="color: #B573BE">
                                <i class="iconfont icon-flow icon-number"></i>
                            </el-col>
                            <el-col :span="18">
                                <h3>名人书画</h3>
                                <h4>{{paintingNumber}}<span class="unit-number">幅</span></h4>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="relic-summary-number">
                        <el-row>
                            <el-col :span="6" style="color: #E6A23C">
                                <i class="glyphicon glyphicon-pawn icon-number"></i>
                            </el-col>
                            <el-col :span="18">
                                <h3>文物古迹</h3>
                                <h4>{{relicNumber}}<span class="unit-number">件</span></h4>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top: 20px"></div>
        <el-form :inline="true">
            <el-form-item>
                <v-distpicker :placeholders="placeholders" :province="province" :city="city" :area="district" 
                    @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea">
                </v-distpicker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button @click="onReset">重置</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-dropdown size="medium" trigger="click">
                    <el-tooltip effect="dark" content="导出图书目录" placement="top-start">
                        <el-button type="success" class="glyphicon glyphicon-export"></el-button>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="exportContent('pdf')">PDF格式</el-dropdown-item>
                        <el-dropdown-item @click.native="exportContent('word')">Word格式</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="12" class="summary-chart" v-loading="summaryLoading">
                <div id="bookSummary" style="height: 300px"></div>
            </el-col>
            <el-col :span="12" class="summary-chart" v-loading="bookLoading">
                <div id="bookPie" style="height: 300px"></div>
            </el-col>
        </el-row>
        <div style="padding-bottom: 10px"></div>
        <el-row>
            <el-col :span="12" class="summary-chart" v-loading="bookLoading">
                <div id="book" style="height: 300px"></div>
            </el-col>
            <el-col :span="12" class="summary-chart" v-loading="bookDetailLoading">
                <div id="bookDetail" style="height: 300px"></div>
            </el-col>
        </el-row>
        <div style="padding-bottom: 10px"></div>
        <el-row>
            <el-col :span="12" class="summary-chart" v-loading="paintingLoading">
                <div id="painting" style="height: 300px"></div>
            </el-col>
            <el-col :span="12" class="summary-chart" v-loading="relicLoading">
                <div id="relic" style="height: 300px"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import api from '../../../constant/api'
    import Vue from 'vue'
    import VDistpicker from 'v-distpicker'
    import Moment from 'moment'
    Vue.prototype.moment = Moment

    var echarts = require('echarts')
    var elementResizeDetectorMaker = require("element-resize-detector")

    export default {
        name: 'dashboard',
        components: { VDistpicker },
        data () {
            return {
                bookNumber: 0,
                paintingNumber: 0,
                relicNumber: 0,
                placeholders: {
                    province: '省份',
                    city: '城市',
                    area: '区/县',
                },
                province: "",
                city: "",
                district: "",
                condition: '文史类',
                bookCount: {},
                bookDetailCount: {},
                paintingCount: {},
                relicCount: {},
                bookSummaryCount: {},
                bookChart: null,
                bookPieChart: null,
                bookDetailChart: null,
                paintingChart: null,
                relicChart: null,
                summaryChart: null,
                bookLoading: false,
                bookDetailLoading: false,
                paintingLoading: false,
                relicLoading: false,
                summaryLoading: false
            }
        },
        created() {
            this.getAllCount();
            this.initData();
        },
        mounted() {
            this.initCharts();
        },
        beforeDestory() {
            this.disposeChart();
        },
        methods: {
            initData() {
                this.getAllSummaryCount();
                this.getAllBookCount();
                this.getAllBookDetailCount();
                this.getAllPaintingCount();
                this.getAllRelicCount();
            },
            initCharts() {
                var _this = this;
                _this.initChart();
                var erd = elementResizeDetectorMaker();
                erd.listenTo(document.getElementById("book"), function (element) {
                    _this.$nextTick(function () {
                        _this.handleResize();
                    })
                });
            },
            disposeChart() {
                var _this = this;
                if (_this.summaryChart != null) {
                    _this.summaryChart.dispose();
                    _this.bookChart.dispose();
                    _this.bookPieChart.dispose();
                    _this.bookDetailChart.dispose();
                    _this.paintingChart.dispose();
                    _this.relicChart.dispose();
                }
            },
            initChart() {
                var _this = this;
                _this.summaryChart = echarts.init(document.getElementById('bookSummary'));
                _this.bookChart = echarts.init(document.getElementById('book'));
                _this.bookPieChart = echarts.init(document.getElementById('bookPie'));
                _this.bookDetailChart = echarts.init(document.getElementById('bookDetail'));
                _this.paintingChart = echarts.init(document.getElementById('painting'));
                _this.relicChart = echarts.init(document.getElementById('relic'));
            },
            handleResize() {
                this.summaryChart.resize();
                this.bookChart.resize();
                this.bookPieChart.resize();
                this.bookDetailChart.resize();
                this.paintingChart.resize();
                this.relicChart.resize();
            },
            getAllCount() {
                var _this = this;
                _this.axios.post(api.baseUrl + "/book/getAllCount")
                    .then(function (result) {
                        var response = result.data;
                        if (response.suc) {
                            _this.bookNumber = response.value.bookNumber;
                            _this.paintingNumber = response.value.paintingNumber;
                            _this.relicNumber = response.value.relicNumber;
                        }
                    }
                );
            },
            getAllSummaryCount() {
                var _this = this;
                var data = {
                    province: this.province,
                    city: this.city,
                    district: this.district
                };
                _this.summaryLoading = true;
                _this.axios.post(api.baseUrl + "/book/getAllSummaryCount", data)
                    .then(function (result) {
                        var response = result.data;
                        _this.summaryLoading = false;
                        if (response.suc) {
                            _this.bookSummaryCount = response.value;
                            _this.drawSummaryBook();
                        }
                    }
                );
            },
            getAllBookCount() {
                var _this = this;
                var data = {
                    province: this.province,
                    city: this.city,
                    district: this.district
                }; 
                _this.bookLoading = true;
                _this.axios.post(api.baseUrl + "/book/getAllBookCount", data)
                    .then(function (result) {
                        var response = result.data;
                        _this.bookLoading = false;
                        if (response.suc) {
                            _this.bookCount = response.value;
                            _this.drawBook();
                            _this.drawBookPie();
                        }
                    }
                );
            },
            getAllBookDetailCount() {
                var _this = this;
                var data = {
                    province: this.province,
                    city: this.city,
                    district: this.district,
                    condition: this.condition
                };
                _this.bookDetailLoading = true;
                _this.axios.post(api.baseUrl + "/book/getAllBookDetailCount", data)
                    .then(function (result) {
                        var response = result.data;
                        _this.bookDetailLoading = false;
                        if (response.suc) {
                            _this.bookDetailCount = response.value;
                            _this.drawBookDetail();
                        }
                    }
                );
            },
            getAllPaintingCount() {
                var _this = this;
                var data = {
                    province: this.province,
                    city: this.city,
                    district: this.district
                };
                _this.paintingLoading = true;
                _this.axios.post(api.baseUrl + "/book/getAllPaintingCount", data)
                    .then(function (result) {
                        var response = result.data;
                        _this.paintingLoading = false;
                        if (response.suc) {
                            _this.paintingCount = response.value;
                            _this.drawPainting();
                        }
                    }
                );
            },
            getAllRelicCount() {
                var _this = this;
                var data = {
                    province: this.province,
                    city: this.city,
                    district: this.district
                };
                _this.relicLoading = true;
                _this.axios.post(api.baseUrl + "/book/getAllRelicCount", data)
                    .then(function (result) {
                        var response = result.data;
                        _this.relicLoading = false;
                        if (response.suc) {
                            _this.relicCount = response.value;
                            _this.drawRelic();
                        }
                    }
                );
            },
            onChangeProvince(data) {
                this.province = "";
                if (data.code != undefined) {
                    this.province = data.value;
                }
            },
            onChangeCity(data) {
                this.city = "";
                if (data.code != undefined) {
                    this.city = data.value;
                }
            },
            onChangeArea(data) {
                this.district = "";
                if (data.code != undefined) {
                    this.district = data.value;
                }
            },
            onSubmit() {
                this.initData();
            },
            onReset() {
                this.province = "";
                this.city = "";
                this.district = "";
                this.condition = "文史类";
                this.initData();
            },
            drawSummaryBook() {
                var option = {
                    title: {
                        text: '文史资料',
                        subtext:'资料分类占比情况'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}<br/>{b}({d}%)"
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        left: '75%',
                        y: 'center',
                        data: ['馆藏图书', '名人书画', '文物古迹']
                    },
                    color: ['#409EFF', '#B573BE', '#E6A23C'],
                    series: [
                        {
                            name: '占比',
                            type: 'pie',
                            radius: '65%',
                            label: {
                                normal: {
                                    formatter: '{d}%\n{b}',
                                }
                            },
                            data:[
                                {name: '馆藏图书', value: this.bookSummaryCount.bookNumber},
                                {name: '名人书画', value: this.bookSummaryCount.paintingNumber},
                                {name: '文物古迹', value: this.bookSummaryCount.relicNumber},
                            ]
                        }
                    ]
                };
                this.summaryChart.setOption(option);
            },
            drawBook() {
                var _this = this;
                _this.bookChart.setOption({
                    color: ['#5B52F7'],
                    title: {
                        text: '馆藏图书'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    xAxis: {
                        name: '分类',
                        data: ['文史类', '志书类', '文学类', '历史类', '工具类', '其他类']
                    },
                    yAxis : [
                        {
                            type : 'value',
                            name : '数量(本)'
                        }
                    ],
                    series: [{
                        name: '数量',
                        type: 'bar',
                        barWidth: 30,
                        label: {
                            show: true,
                            position: 'top'
                        },
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    if (params.name == _this.condition) {
                                        return "#FE8463";
                                    } else {
                                        return "#5B52F7";
                                    }
                                }
                            }
                        },
                        data: [_this.bookCount.wsNumber, _this.bookCount.zsNumber, _this.bookCount.wxNumber,
                            _this.bookCount.lsNumber, _this.bookCount.gjNumber, _this.bookCount.qtNumber]
                    }]
                });
                _this.bookChart.on('click', function (params) {
                    _this.condition = params.name;
                    _this.getAllBookDetailCount();
                    _this.bookChart.dispose();
                    _this.bookChart = echarts.init(document.getElementById('book'));
                    _this.drawBook();
                });
            },
            drawBookPie() {
                var option = {
                    title: {
                        text: '馆藏图书',
                        subtext:'图书分类占比情况'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}<br/>{b}({d}%)"
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        left: '85%',
                        y: 'center',
                        data: ['文史类', '志书类', '文学类', '历史类', '工具类', '其他类']
                    },
                    color: ['#EE7AE9', '#858585', '#CDAF95',
                        '#4EEE94', 'rgb(235,161,159)', '#63B8FF'],
                    series: [
                        {
                            name: '占比',
                            type: 'pie',
                            radius: '65%',
                            label: {
                                normal: {
                                    formatter: '{d}%\n{b}',
                                }
                            },
                            data:[
                                {name: '文史类', value: this.bookCount.wsNumber},
                                {name: '志书类', value: this.bookCount.zsNumber},
                                {name: '文学类', value: this.bookCount.wxNumber},
                                {name: '历史类', value: this.bookCount.lsNumber},
                                {name: '工具类', value: this.bookCount.gjNumber},
                                {name: '其他类', value: this.bookCount.qtNumber}
                            ]
                        }
                    ]
                };
                this.bookPieChart.setOption(option);
            },
            drawBookDetail() {
                var dataKey = [], dataValue = [];
                for (var i in this.bookDetailCount) {
                    dataKey.push(i);
                    dataValue.push(this.bookDetailCount[i]);
                }
                this.bookDetailChart.setOption({
                    color: ['#9966FF'],
                    title: {
                        text: '馆藏图书(' + this.condition + ')'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    xAxis: {
                        name: '分类',
                        data: dataKey
                    },
                    yAxis : [
                        {
                            type : 'value',
                            name : '数量(本)'
                        }
                    ],
                    series: [{
                        name: '数量',
                        type: 'bar',
                        barWidth: 30,
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: dataValue
                    }],
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true,
                            start: 0,
                            end: 100
                        }
                    ]
                });
            },
            drawPainting() {
                var dataKey = [], dataValue = [];
                for (var i in this.paintingCount) {
                    dataKey.push(i);
                    dataValue.push(this.paintingCount[i]);
                }
                this.paintingChart.setOption({
                    color: ['#B573BE'],
                    title: {
                        text: '名人书画'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    xAxis: {
                        name: '分类',
                        data: dataKey
                    },
                    yAxis : [
                        {
                            type : 'value',
                            name : '数量(幅)'
                        }
                    ],
                    series: [{
                        name: '数量',
                        type: 'bar',
                        barWidth: 30,
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: dataValue
                    }],
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true,
                            start: 0,
                            end: 100
                        }
                    ]
                });
            },
            drawRelic() {
                var dataKey = [], dataValue = [];
                for (var i in this.relicCount) {
                    dataKey.push(i);
                    dataValue.push(this.relicCount[i]);
                }
                this.relicChart.setOption({
                    color: ['#E6A23C'],
                    title: {
                        text: '文物古迹'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    xAxis: {
                        name: '分类',
                        data: dataKey
                    },
                    yAxis : [
                        {
                            type : 'value',
                            name : '数量(件)'
                        }
                    ],
                    series: [{
                        name: '数量',
                        type: 'bar',
                        barWidth: 30,
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: dataValue
                    }],
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true,
                            start: 0,
                            end: 100
                        }
                    ]
                });
            },
            exportContent(type) {
                var range = "", suffix = "";
                if (this.province != "") {
                    range += this.province + "/";
                }
                if (this.city != "") {
                    range += this.city + "/";
                }
                if (this.district != "") {
                    range += this.district + "/";
                }
                if (type == "pdf") {
                    suffix = ".pdf";
                } else {
                    suffix = ".docx";
                }
                this.$confirm('此操作将导出【' + range + '馆藏图书】总目录文件（' + suffix + '）, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.export2Content(range, type);
                }).catch(() => {
                });
            },
            export2Content(range, type) {
                var _this = this;
                var data = {
                    findMode: 1,
                    province: _this.province,
                    city: _this.city,
                    district: _this.district,
                    type: type
                };
                _this.axios.post(api.baseUrl + "/content/exportTotalContent", data, {responseType: 'blob'})
                    .then(function (result) {
                        var response = result.data;
                        if (response) {
                            if (type == "pdf") {
                                _this.download(range + "馆藏图书总目录.pdf", response);
                            } else {
                                _this.download(range + "馆藏图书总目录.docx", response);
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
    .distpicker-address-wrapper select {
        height: 36px !important;
    }
    .summary-number {
        border-radius: 2px;
    }
    .book-summary-number {
        height: 100px;
        padding: 10px 10px;
        border: 1px solid #DDDDDD;
        border-radius: 4px;
    }
    .painting-summary-number {
        height: 100px;
        padding: 10px 10px;
        border: 1px solid #DDDDDD;
        border-radius: 4px;
    }
    .relic-summary-number {
        height: 100px;
        padding: 10px 10px;
        border: 1px solid #DDDDDD;
        border-radius: 4px;
    }
    .summary-number h3 {
        height: 20px;
        overflow: hidden;
        font-weight: 600;
        font-size: 17px;
        line-height: 20px;
        padding-left: 50px;
    }
    .summary-number h4 {
        margin-top: 12px;
        padding-left: 50px;
        font-size: 26px;
        color: #4686F2;
        line-height: 30px;
    }
    .icon-number {
        font-size: 50px;
        line-height: 75px;
        margin-left: 15px;
    }
    .unit-number {
        font-size: 15px; 
        color: rgb(0, 0, 0);
        margin-left: 8px;
    }
    .summary-chart {
        border: 1px solid #DDDDDD;
        padding: 15px 15px 0px 15px;
    }
</style>