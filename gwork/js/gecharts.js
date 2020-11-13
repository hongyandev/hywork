require(['httpKit','echarts'], function (httpKit,echarts) {
    new Vue({
        el: '#gecharts',
        template: `<div>
                        <div id="ndrw" style="width:100%;height:450px;"></div>
                        <div style="height:5px;background: #f7f7f7"></div>
                        <h3 style="padding:0 15px;">第{{quarter}}季度完成情况（单位：万元）</h3>
                        <van-field readonly clickable  name="baddesc" :value="jdobj.text" label="季度" placeholder="请选择季度"  @click="showjd(item)"/>
                        <div id="jdrwcz" style="width:90%;height:450px;margin-left:5%"></div>
                        <div style="height:5px;background: #f7f7f7"></div>
                        <div id="qdkf" style="width:100%;height:450px;"></div>
                        <van-popup v-model="showPicker" round position="bottom">
                            <van-picker show-toolbar :columns="jdcolumns" @cancel="showPicker = false" @confirm="jdConfirm"/>
                        </van-popup>
                    </div>
                    `,
            data() {
                return {
                    myChart: null,
                    myquarter:null,
                    mylrwcz:null,
                    myqdkf:null,
                    lrzdata:[],
                    rwdata:[],
                    showPicker:false,
                    years:new Date().getFullYear(),
                    jdcolumns:[
                        {
                            id:1,
                            text:'第一季度'
                        },
                        {
                            id:2,
                            text:'第二季度'
                        },
                        {
                            id:3,
                            text:'第三季度'
                        },
                        {
                            id:4,
                            text:'第四季度'
                        }
                        ],
                    jdobj:{},
                    quarter:httpKit.getQuarterStartMonth(new Date().getMonth()),
                    qdkfdata:[]
                };
            },
            methods: {
                ndrwz() {
                    var _this = this;
                    if(_this.rwdata.length>0 && _this.lrzdata.length>0){
                        _this.$nextTick(function() {
                            _this.myChart = echarts.init(document.getElementById('ndrw'), 'light');
                            var option = {
                                title: {
                                    text:  _this.years + '年任务完成情况（单位：万元）',
                                },
                                tooltip: {
                                    trigger: 'item',
                                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                                },
                                legend: {
                                    top: "10%",
                                    left: 20,
                                    // data: ['已完成任务', '未完成任务']
                                },
                                series: [
                                    {
                                        name: '利润',
                                        type: 'pie',
                                        radius: ['20%', '35%'],
                                        label: {
                                            position: 'inner'
                                        },
                                        labelLine: {
                                            show: false
                                        },
                                        tooltip:{
                                            position:["10%","10%"]
                                        },
                                        data: [{
                                            name: '已完成利润',
                                            value: _this.lrzdata[0].ndwc,//36.362526,//-94111.13,
                                            total: _this.lrzdata[0].ndzb,//-231000//_this.lrzdata[0].ndzb
                                        },
                                            {
                                                name: '未完成利润',
                                                value: _this.lrzdata[0].ndzb - _this.lrzdata[0].ndwc,//-136888.87,//_this.lrzdata[0].ndzb - _this.lrzdata[0].ndwc,
                                                total: _this.lrzdata[0].ndzb//-231000,//_this.lrzdata[0].ndzb
                                            }]
                                    },
                                    {
                                        name: '任务',
                                        type: 'pie',
                                        radius: ['50%', '65%'],
                                        label: {
                                            position: 'inner'
                                        },
                                        tooltip:{
                                            position:["10%","10%"]
                                        },
                                        data: [{
                                            name: '已完成任务',
                                            value: _this.rwdata[0].ndwc,
                                            total: _this.rwdata[0].ndrw,
                                        },
                                            {
                                                name: '未完成任务',
                                                value: _this.rwdata[0].ndrw - _this.rwdata[0].ndwc,
                                                total:_this.rwdata[0].ndrw,
                                            }]
                                    },
                                ]
                            };
                            _this.myChart.setOption(option);
                            window.addEventListener('resize', () => {
                                _this.myChart.resize();
                            });

                            _this.myChart.dispatchAction({ type: 'highlight', dataIndex: 0 }); // dataIndex属性伟data传入的索引值
                            _this.myChart.dispatchAction({ type: 'showTip', seriesIndex: 0, position: ["10%","10%"], dataIndex: 0 }); // 点击生成detip工具条位置
                            _this.myChart.on('mouseover', (e) => {
                                if (e.dataIndex !== 0) { // 当鼠标移除的时候 使默认的索引值去除默认选中
                                    _this.myChart.dispatchAction({ type: 'downplay', dataIndex: 0 });
                                }
                            });
                        })
                    }

                },
                showjd(){
                    this.showPicker = true;
                },
                jdConfirm(val){
                    this.jdobj = val;
                    this.quarter = val.id;
                    this.showPicker =false;
                    this.jdrwz()
                },
                jdrwz() {
                    var _this = this;
                    if(_this.rwdata.length>0 && _this.lrzdata.length>0){
                        _this.$nextTick(function() {
                            _this.myquarter = echarts.init(document.getElementById('jdrwcz'), 'light');
                            var option = {
                                title: {
                                    //text:  '第'+ _this.quarter + '季度完成情况（单位：万元）',
                                    //subtext:'<van-field readonly clickable  name="baddesc" label="选择季度" placeholder="请选择"  @click="showjd(item)"/>'
                                },
                                tooltip: {
                                    trigger: 'item',
                                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                                },
                                legend: {
                                    // orient: 'vertical',
                                    top: "10%",
                                    left: 20,
                                   // data: ['已完成任务/利润', '未完成任务/利润']
                                },
                                series: [
                                    {
                                        name: '利润',
                                        type: 'pie',
                                        radius: ['20%', '35%'],
                                        label: {
                                            position: 'inner'
                                        },
                                        labelLine: {
                                            show: false
                                        },
                                        data: [{
                                            name: '已完成',
                                            value: _this.lrzdata[0]['jdwc'+_this.quarter],
                                            total: _this.lrzdata[0]['jdzb'+_this.quarter],
                                        },
                                            {
                                                name: '未完成',
                                                value: _this.lrzdata[0]['jdzb'+_this.quarter] - _this.lrzdata[0]['jdwc'+_this.quarter],
                                                total: _this.lrzdata[0]['jdzb'+_this.quarter],
                                            }]
                                    },
                                    {
                                        name: '任务',
                                        type: 'pie',
                                        radius: ['50%', '65%'],
                                        label: {
                                            position: 'inner'
                                        },
                                        data: [{
                                            name: '已完成',
                                            value: _this.rwdata[0]['jd'+_this.quarter],
                                            total: _this.rwdata[0]['n19_zxszb'+_this.quarter],
                                        },
                                            {
                                                name: '未完成',
                                                value: _this.rwdata[0]['n19_zxszb'+_this.quarter] - _this.rwdata[0]['jd'+_this.quarter],
                                                total: _this.rwdata[0]['n19_zxszb'+_this.quarter],
                                            }]
                                    },
                                ]
                            };
                            _this.myquarter.setOption(option);
                            window.addEventListener('resize', () => {
                                _this.myquarter.resize();
                            });

                            _this.myquarter.dispatchAction({ type: 'highlight', dataIndex: 0 }); // dataIndex属性伟data传入的索引值
                            _this.myquarter.dispatchAction({ type: 'showTip', seriesIndex: 0, position: ["10%","10%"], dataIndex: 0 }); // 点击生成detip工具条位置
                            _this.myquarter.on('mouseover', (e) => {
                                if (e.dataIndex !== 0) { // 当鼠标移除的时候 使默认的索引值去除默认选中
                                    _this.myquarter.dispatchAction({ type: 'downplay', dataIndex: 0 });
                                }
                            });
                        })
                    }

                },
                ndqdkf(){
                    var _this = this;
                    _this.$nextTick(function() {
                        _this.myqdkf = echarts.init(document.getElementById('qdkf'), 'light');
                        var option = {
                            title: {
                                text:  _this.years + '渠道开发完成数',
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: '{a} <br/>{b}: {c} ({d}%)'
                            },
                            legend: {
                                top: "10%",
                                left: 20,
                                 data: ['已完成', '未完成']
                            },
                            series: [
                                {
                                    name: '渠道开发数',
                                    type: 'pie',
                                    radius: ['50%', '70%'],
                                    avoidLabelOverlap: false,
                                    formatter: '{b}:\n{c}个 ({d}%)',
                                    label: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        label: {
                                            show: true,
                                            fontSize: '16',
                                            formatter: function (params) {
                                                return '年度任务\n'+params.data.total+'个 \n '+params.name+'：'+params.value+'个 \n '+params.name+'率：'+params.percent+'%';
                                            },
                                        }
                                    },
                                    data: [{
                                        name: '已完成',
                                        value: 4 ,
                                        total: _this.qdkfdata[0].sl,
                                    },
                                    {
                                            name: '未完成',
                                            value:_this.qdkfdata[0].sl - 4,
                                            total:_this.qdkfdata[0].sl,
                                    }]
                                },
                            ]
                        };
                        _this.myqdkf.setOption(option);
                        window.addEventListener('resize', () => {
                            _this.myqdkf.resize();
                        });

                        _this.myqdkf.dispatchAction({ type: 'highlight', dataIndex: 0 }); // dataIndex属性伟data传入的索引值
                        _this.myqdkf.dispatchAction({ type: 'showTip', seriesIndex: 0, position: ["10%","10%"], dataIndex: 0 }); // 点击生成detip工具条位置
                        _this.myqdkf.on('mouseover', (e) => {
                            if (e.dataIndex !== 0) { // 当鼠标移除的时候 使默认的索引值去除默认选中
                                _this.myqdkf.dispatchAction({ type: 'downplay', dataIndex: 0 });
                            }
                        });
                    })
                },
                jdqdkfz() {
                    var _this = this;
                    if(_this.rwdata.length>0 && _this.lrzdata.length>0){
                        _this.$nextTick(function() {
                            _this.myquarter = echarts.init(document.getElementById('qdkf'), 'light');
                            var option = {
                                title: {
                                    text:  '年度渠道开发分析',
                                    //subtext:'<van-field readonly clickable  name="baddesc" label="选择季度" placeholder="请选择"  @click="showjd(item)"/>'
                                },
                                tooltip: {
                                    trigger: 'item',
                                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                                },
                                legend: {
                                    // orient: 'vertical',
                                    top: "10%",
                                    left: 20,
                                    data: ['已完成', '未完成']
                                },
                                series: [
                                    {
                                        name: '完成数',
                                        type: 'pie',
                                        radius: ['20%', '35%'],
                                        label: {
                                            position: 'inner'
                                        },
                                        labelLine: {
                                            show: false
                                        },
                                        data: [{
                                            name: '已完成',
                                            value: _this.qdkfdata[0]['jdwc'+_this.quarter],
                                            total: _this.lrzdata[0]['jdzb'+_this.quarter],
                                        },
                                            {
                                                name: '未完成',
                                                value: _this.lrzdata[0]['jdzb'+_this.quarter] - _this.lrzdata[0]['jdwc'+_this.quarter],
                                                total: _this.lrzdata[0]['jdzb'+_this.quarter],
                                            }]
                                    },
                                    {
                                        name: '任务',
                                        type: 'pie',
                                        radius: ['50%', '65%'],
                                        label: {
                                            position: 'inner'
                                        },
                                        data: [{
                                            name: '已完成',
                                            value: _this.rwdata[0]['jd'+_this.quarter],
                                            total: _this.rwdata[0]['n19_zxszb'+_this.quarter],
                                        },
                                            {
                                                name: '未完成',
                                                value: _this.rwdata[0]['n19_zxszb'+_this.quarter] - _this.rwdata[0]['jd'+_this.quarter],
                                                total: _this.rwdata[0]['n19_zxszb'+_this.quarter],
                                            }]
                                    },
                                ]
                            };
                            _this.myquarter.setOption(option);
                            window.addEventListener('resize', () => {
                                _this.myquarter.resize();
                            });

                            _this.myquarter.dispatchAction({ type: 'highlight', dataIndex: 0 }); // dataIndex属性伟data传入的索引值
                            _this.myquarter.dispatchAction({ type: 'showTip', seriesIndex: 0, position: ["10%","10%"], dataIndex: 0 }); // 点击生成detip工具条位置
                            _this.myquarter.on('mouseover', (e) => {
                                if (e.dataIndex !== 0) { // 当鼠标移除的时候 使默认的索引值去除默认选中
                                    _this.myquarter.dispatchAction({ type: 'downplay', dataIndex: 0 });
                                }
                            });
                        })
                    }

                },
            },
            created(){
                var self = this;
                var data = {
                    "ygbm" : httpKit.urlParams().ygbm
                };

                httpKit.post("/api/my/lrwc",data,httpKit.type.form).then(res=>{
                    self.$toast.clear();
                    console.info(res);
                    self.lrzdata = res.data;
                    self.ndrwz();
                    self.jdrwz();
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/api/my/rwwc",data,httpKit.type.form).then(res=>{
                    //console.info(res)
                    self.$toast.clear();
                    // debugger
                    self.rwdata = res.data;
                    self.ndrwz();
                    self.jdrwz();
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/api/my/qdkf",data,httpKit.type.form).then(res=>{
                    //console.info(res)
                    self.$toast.clear();
                    // debugger
                    self.qdkfdata = res.data;
                    self.ndqdkf();
                    self.jdqdkfz()
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            },
            mounted(){

            }
        });

});