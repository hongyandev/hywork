require(['httpKit','lodash'], function (httpKit,_) {
    new Vue({
        el: '#gsdetail',
        template: `<div>
                          <van-divider content-position="left">所处流程状态</van-divider>
                          <van-steps class="lcstatus" :active="jdstatus">
                               <van-step>受理</van-step>
                               <van-step>退货</van-step>
                               <van-step>分拣</van-step>
                               <van-step>评价</van-step>
                               <van-step>归档</van-step>
                          </van-steps>  
                          <van-divider content-position="left">客户评价</van-divider>
                          <!--评价 -->
                          <div>
                              <ul class="comment">
                                <li>
                                    <van-field readonly label="问题是否解决" :value="prodes" placeholder="请选择"/>
                                </li>
                                <li>
                                    <van-field readonly v-model="message" rows="3" autosize label="评价描述" type="textarea" placeholder="请输入评价描述"/>
                                </li>
                            </ul>
                            <div class="myd">
                                <span>满意度点评</span><van-rate readonly v-model="value"/><span class="mydtext">{{satisfaction}}</span>
                            </div>
                          </div>
                          <van-divider content-position="left">快递信息</van-divider>
                          <!--快递-->
                          <van-cell-group>
                             <van-field label="快递名称" type="text" v-model="express" placeholder="请输入快递名称"/>
                             <van-field label="快递单号" type="number" v-model="expressNumber" placeholder="请输入快递单号"/>
                          </van-cell-group>
                          <van-divider content-position="left">反馈信息</van-divider>
                          <div class="salecell">
                             <p><label>流水号: </label><span>{{saledetail.lsh}}</span></p>
                             <p><label>反馈时间：</label><span>{{saledetail.fksj}}</span></p>
                             <p><label>产业：</label><span>{{saledetail.cy}}</span></p>
                             <p><label>客户：</label><span>{{saledetail.khmc}}</span></p>  
                             <p><label>联系人：</label><span>{{saledetail.lxr}}</span></p>
                             <p><label>联系电话：</label><span>{{saledetail.lxdh}}</span></p>
                             <p><label>寄回产品金额：</label><span>￥{{saledetail.jhcpzje}}</span></p>  
                             <p><label>反馈类型：</label><span>{{saledetail.fklx == 0 ? '产品质量类':(saledetail.fklx == 2 ? '差错类':'缺货类')}}</span></p>  
                          </div>
                          <van-divider content-position="left">详细产品信息</van-divider>
                          <ul class="salemx">
                            <li v-for="(item,i) in saledetail.mxs">
                            <van-collapse style="margin-left: 15px" v-model="activeNames" accordion>
                              <van-collapse-item :title="item.cpmc" :name="i">
                                <div>
                                    <van-cell title="合同单号" :value="item.htdh" />
                                    <van-cell title="产品型号" :value="item.cpxh" />
                                    <van-cell title="产品系列" :value="item.cpxl" />
                                    <van-cell title="不良环节" :value="item.blhj" />
                                    <van-cell title="不良数量" :value="item.blsl" />
                                    <van-cell title="不良金额" :value="'￥'+item.blje" />
                                    <van-cell title="产品名称" :value="item.cpmc" />
                                    <van-cell title="问题描述" :label="item.wtms"/>
                                </div>
                                </van-collapse-item>
                            </van-collapse>
                             </li>
                          </ul>
                    </div>
                    `,
        data() {
            return {
                satisfaction: '',
                value:0,//评价分值
                prodes:'',
                prokey:'',
                message:'',
                showPicker:false,
                columns:['是','否'],
                express:'',//快递名称
                expressNumber:'',//快递单号
                jdstatus:'0',
                activeNames: '1',
                saleid:httpKit.urlParams().saleid,
                saledetail:{},
            };
        },
        methods: {
            onChange(value) {
                //Toast('当前值：' + value);
                switch (value) {
                    case 1:
                        this.satisfaction = "非常不满意";
                        break;
                    case 2:
                        this.satisfaction = "不满意";
                        break;
                    case 3:
                        this.satisfaction = "一般";
                        break;
                    case 4:
                        this.satisfaction = "满意";
                        break;
                    case 5:
                        this.satisfaction = "非常满意";
                }

            },
            onConfirm(val, index){
                this.showPicker = false;
                this.prodes = val;
                this.prokey = index;
            },
            commentSubmit(){
               //提交评价
                var self = this;
                if (self.prokey.length < 1) {
                    self.$notify('问题是否解决?');
                    return;
                }
                if (self.value == 0) {
                    self.$notify('满意度点评!');
                    return;
                }
                var data = {
                    "gkpjsfjj" : self.prokey,
                    "gkpjsfmy" : self.value,
                    "gkpjms"   : self.message,
                    "requestid": self.saleid
                }
                self.$toast.loading({forbidClick: true, duration: 0});
                httpKit.post("/afterSale/appraise", data, httpKit.type.form).then(res=>{
                   self.$toast.clear();
                   self.$toast.success('评价成功!');
                }).catch(err => {
                   self.$toast.clear();
                   self.$toast.fail({
                       message: err.message
                   });
                });
            },
            expressSubmit(){
               //提交快递
               var self = this;
               if (self.express.length < 1) {
                   self.$notify('请填写快递名称!');
                   return;
               }
               if (self.expressNumber.length < 1) {
                   self.$notify('请填写快递单号!');
                   return;
               }
               var data = {
                   "kdgs" : self.express,
                   "kddh" : self.expressNumber,
                   "requestid" : self.saleid
               };
               self.$toast.loading({forbidClick: true, duration: 0});
                httpKit.post("/afterSale/express", data, httpKit.type.form).then(res=>{
                    self.$toast.clear();
                    self.$toast.success('快递回写成功!');
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            }
        },
        computed: {

        },
        watch:{

        },
        mounted(){
            var self = this;
            self.$nextTick(function () {
                var saleid = {
                    "requestid": self.saleid
                };
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/afterSale/detail",saleid, httpKit.type.form).then(res=>{
                    self.$toast.clear();
                    self.saledetail = res.data;
                    // 顾客评价是否解决
                    self.prokey = self.saledetail.gkpjsfjj;
                    if (self.prokey == "0") {
                        self.prodes = "是";
                    }
                    if (self.prokey == "1") {
                        self.prodes = "否";
                    }
                    // 评价描述
                    self.message = self.saledetail.gkpjms;
                    // 满意度点评
                    switch (self.saledetail.gkpjsfmy) {
                        case 0:
                            self.value = 5;
                            self.satisfaction = "非常满意";
                            break;
                        case 1:
                            self.value = 4;
                            self.satisfaction = "满意";
                            break;
                        case 2:
                            self.value = 3;
                            self.satisfaction = "一般";
                            break;
                        case 3:
                            self.value = 2;
                            self.satisfaction = "不满意";
                            break;
                        case 4:
                            self.value = 1;
                            self.satisfaction = "非常不满意";
                            break;
                    }
                    // 快递
                    self.express = self.saledetail.kdgs;
                    self.expressNumber = self.saledetail.kddh;
                    //debugger
                    var sl = [6280,6281,6282,6283,6285,6295,6310];
                    var th = [6286];
                    var fj = [6338,6288,6334];
                    var pj = [6291,6292];
                    var gd = [6294,6293];

                    if(_.indexOf(sl,self.saledetail.currentnodeid) != -1){
                        self.jdstatus = '0'
                    }else if(_.indexOf(th,self.saledetail.currentnodeid) != -1){
                        self.jdstatus = '1'
                    }else if(_.indexOf(fj,self.saledetail.currentnodeid) != -1){
                        self.jdstatus = '2'
                    }else if(_.indexOf(pj,self.saledetail.currentnodeid) != -1){
                        self.jdstatus = '3'
                    }else{
                        self.jdstatus = '4'
                    }
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            })
        }
    });
});