require(['httpKit','echarts','westeros'], function (httpKit,echarts,westeros) {
    new Vue({
        el: '#gecharts',
        template: `<div>
                        <ul>
                            <li>
                                <h3 style="padding:0 15px;">年度完成情况（单位：万元）</h3>
                                <div id="ndrw" style="width:100%;height:450px;"></div>
                            </li>
                            <li>
                                 <h3 style="padding:0 15px;">第{{quarter}}季度完成情况（单位：万元）</h3>
                                 <van-field style="border-bottom: 1px solid #f7f7f7;border-top:1px solid #f7f7f7;margin-bottom:10px" readonly clickable name="baddesc" :value="jdobj.text" label="季度" placeholder="请选择季度"  @click="showjd(item)"/>
                            </li>
                            <li>
                               <div id="jdrwcz" style="width:90%;height:450px;margin-left:5%"></div>
                            </li>
                            <li>
                                <div id="qdkf" style="width:100%;height:450px;"></div>
                            </li>
                            <li >
                                 <div id="jdqdkf" style="width:100%;height:450px;"></div>
                            </li>
                        </ul>
                        <van-popup v-model="showPicker" round position="bottom">
                            <van-picker show-toolbar :columns="jdcolumns" @cancel="showPicker = false" @confirm="jdConfirm"/>
                        </van-popup>
                    </div>
                    `,
            data() {
                return {
                    gh:httpKit.urlParams().ygbm,
                    myChart: null,
                    myquarter:null,
                    mylrwcz:null,
                    myqdkf:null,
                    myjdqdkf:null,
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
                            _this.myChart = echarts.init(document.getElementById('ndrw'), 'westeros');
                            var lrndmb = Number(_this.lrzdata[0].ndzb/10000).toFixed(4),
                                lrndwc = Number(_this.lrzdata[0].ndwc/10000).toFixed(4),
                                lrndwwc =  _this.lrzdata[0].ndzb - _this.lrzdata[0].ndwc,
                                rwndmb = _this.rwdata[0].ndrw,
                                rwndwc = _this.rwdata[0].ndwc,
                                rwndwwc = _this.rwdata[0].ndrw - _this.rwdata[0].ndwc;
                            //if(lrndmb > 0){
                                /*var option = {
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
                                        data: ['已完成', '未完成']
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
                                                name: '已完成',
                                                value: _this.lrzdata[0].ndwc,//36.362526,//-94111.13,
                                                total: _this.lrzdata[0].ndzb,//-231000//_this.lrzdata[0].ndzb
                                            },
                                                {
                                                    name: '未完成',
                                                    value: lrndwwc,//-136888.87,//_this.lrzdata[0].ndzb - _this.lrzdata[0].ndwc,
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
                                                name: '已完成',
                                                value: _this.rwdata[0].ndwc,
                                                total: _this.rwdata[0].ndrw,
                                            },
                                                {
                                                    name: '未完成',
                                                    value: rwndwwc,
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
                                });*/
                          //  }else{
                                var option = {
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                        }
                                    },
                                    legend: {
                                        data: ['任务','任务完成','利润目标','利润完成']
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        bottom: '3%',
                                        containLabel: true
                                    },
                                    yAxis: [
                                        {
                                            type: 'value'
                                        }
                                    ],
                                    xAxis: [
                                        {
                                            type: 'category',
                                            axisTick: {
                                                show: false
                                            },
                                            data:[_this.years]
                                        }
                                    ],
                                    series: [
                                        {
                                            name: '任务',
                                            type: 'bar',
                                            label: {
                                                show: true,
                                                position: 'inside'
                                            },
                                            data: [rwndmb]
                                        },
                                        {
                                            name: '任务完成',
                                            type: 'bar',
                                            stack: '总量',
                                            label: {
                                                show: true,
                                                position: 'inside'
                                            },
                                            data: [rwndwc]
                                        },
                                        {
                                            name: '利润目标',
                                            type: 'bar',
                                            label: {
                                                show: true,
                                                position: 'inside'
                                            },
                                            data: [lrndmb]
                                        },
                                        {
                                            name: '利润完成',
                                            type: 'bar',
                                            label: {
                                                show: true,
                                                position: 'inside'
                                            },
                                            data: [lrndwc]
                                        },
                                    ]
                                };
                                _this.myChart.setOption(option);
                                window.addEventListener('resize', () => {
                                    _this.myChart.resize();
                                });
                           // }



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
                            _this.myquarter = echarts.init(document.getElementById('jdrwcz'), 'westeros');
                            var option = {
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                    }
                                },
                                legend: {
                                      data: ['任务','任务完成','利润目标','利润完成']
                                },
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                },
                                yAxis: [
                                    {
                                        type: 'value'
                                    }
                                ],
                                xAxis: [
                                    {
                                        type: 'category',
                                        axisTick: {
                                            show: false
                                        },
                                        data: ['第'+_this.quarter+'季度']
                                    }
                                ],
                                series: [
                                    {
                                        name: '任务',
                                        type: 'bar',
                                        label: {
                                            show: true,
                                            position: 'inside'
                                        },
                                        data: [_this.rwdata[0]['n19_zxszb'+_this.quarter]]
                                    },
                                    {
                                        name: '任务完成',
                                        type: 'bar',
                                        label: {
                                            show: true,
                                            position: 'inside'
                                        },
                                        data: [_this.rwdata[0]['jd'+_this.quarter]]
                                    },
                                    {
                                        name: '利润目标',
                                        type: 'bar',
                                        label: {
                                            show: true,
                                            position: 'inside'
                                        },
                                        data: [Number(_this.lrzdata[0]['jdzb'+_this.quarter]/10000).toFixed(4)]
                                    },
                                    {
                                        name: '利润完成',
                                        type: 'bar',
                                        label: {
                                            show: true,
                                            position: 'inside'
                                        },
                                        data: [Number(_this.lrzdata[0]['jdwc'+_this.quarter]/10000).toFixed(4)]
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
                                        value: _this.qdkfdata[0].ndwc,
                                        total: _this.qdkfdata[0].ndsl,
                                    },
                                    {
                                            name: '未完成',
                                            value:_this.qdkfdata[0].ndsl - _this.qdkfdata[0].ndwc,
                                            total:_this.qdkfdata[0].ndsl,
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
                    if(_this.qdkfdata.length>0){
                        _this.$nextTick(function() {
                            _this.myjdqdkf = echarts.init(document.getElementById('jdqdkf'), 'light');
                           var option = {
                               title:{
                                   text:'季度完成情况（单位：万元）'
                               },
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                    }
                                },
                               legend: {
                                   top: "5%",
                                   left: 20,
                                   data: ['渠道开发目标', '渠道开发完成']
                               },
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                },
                                xAxis: [
                                    {
                                        type: 'value'
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'category',
                                        axisTick: {
                                            show: false
                                        },
                                        data: ['第一季度', '第二季度', '第三季度', '第四季度']
                                    }
                                ],
                                series: [
                                    {
                                        name: '渠道开发目标',
                                        type: 'bar',
                                        label: {
                                            show: true,
                                            position: 'inside'
                                        },
                                        data: [_this.qdkfdata[0].jdmb1,_this.qdkfdata[0].jdmb2,_this.qdkfdata[0].jdmb3,_this.qdkfdata[0].jdmb4]
                                    },
                                    {
                                        name: '渠道开发完成',
                                        type: 'bar',
                                        stack: '总量',
                                        label: {
                                            show: true
                                        },
                                        data: [_this.qdkfdata[0].wc1,_this.qdkfdata[0].wc2,_this.qdkfdata[0].wc3,_this.qdkfdata[0].wc4]
                                    }

                                ]
                            };

                            _this.myjdqdkf.setOption(option);
                            window.addEventListener('resize', () => {
                                _this.myjdqdkf.resize();
                            });

                            _this.myjdqdkf.dispatchAction({ type: 'highlight', dataIndex: 0 }); // dataIndex属性伟data传入的索引值
                            _this.myjdqdkf.dispatchAction({ type: 'showTip', seriesIndex: 0, position: ["10%","10%"], dataIndex: 0 }); // 点击生成detip工具条位置
                            _this.myjdqdkf.on('mouseover', (e) => {
                                if (e.dataIndex !== 0) { // 当鼠标移除的时候 使默认的索引值去除默认选中
                                    _this.myjdqdkf.dispatchAction({ type: 'downplay', dataIndex: 0 });
                                }
                            });
                        })
                    }

                },
            },
            created(){
                var self = this;
                var data ={
                    //"ygbm": "02417"
                    'ygbm':self.gh
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
                    if(self.qdkfdata[0].ndsl){
                        self.ndqdkf();
                        self.jdqdkfz()
                    }

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