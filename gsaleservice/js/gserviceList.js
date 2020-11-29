require(['httpKit','PullUpDown','backTop'], function (httpKit,PullUpDown,backTop) {
    new Vue({
        el: '#gserviceList',
        components: {
            'pull-up-down':PullUpDown,
            'back-top':backTop
        },
        template: `<div>
                        <div  class="pddingTop" style="height:100%">
                        
                           <!--检索框-->
                           <van-sticky>
                              <van-search readonly placeholder="请输入搜索关键词" @click="showSpopup"></van-search>
                           </van-sticky>
                           
                            <!--条件检索-->
                            <van-popup get-container="body" v-model="showsearch" position="top" :style="{ height: '50%' }" >
                              <van-field readonly clickable label="产业" :value="cyval" placeholder="选择产业" @click="showCy = true"></van-field>
                              <van-field readonly clickable label="日期" :value="date" @click="showdate = true" />
                              <van-field v-model="khdm" label="客户" placeholder="请输入客户代码" />
                              <div class="popupbtn">
                                <van-button type="default" style="width: 50%" size="normal" @click="showsearch = false">取消</van-button>
                                <van-button type="primary" style="width: 50%" size="normal" @click="searchsure">确定</van-button>
                              </div>
                            </van-popup>
                            
                            <!--条件检索 - 选择产业-->
                            <van-popup v-model="showCy" round position="bottom">
                              <van-picker show-toolbar :columns="cys" @cancel="showPicker = false" @confirm="pickCy" />
                            </van-popup>
                           
                           <!--正文-->
                           <pull-up-down ref="pull" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="loadOrder()">
                                <template v-if="orderList.length > 0">
                                    <van-cell-group v-for="(order, index) in orderList" class="itemCard" @click="showDetail(order)">
                                      <van-cell title="反馈日期" :value="order.fksj" :label="order.cy+'  '+order.lsh"/>
                                      <van-cell title="客户信息" :value="order.khmc" />
                                      <van-cell title="联系信息"  :value="order.lxr" :label="'tel:' + order.lxdh"/>
                                      <van-cell title="产品总额"  :value="order.jhcpzje" value-class="money"/>
                                      <!-- 详情and评价
                                      <van-cell title-class="midtext" value-class="midtext" >
                                        <template #title>
                                            <van-button plain hairline type="default" size="mini">评价</van-button>
                                        </template>
                                        <template #default>
                                            <van-button plain hairline type="default" size="mini">详情</van-button>
                                        </template>
                                      </van-cell>
                                      -->
                                    </van-cell-group>
                                </template>
                                <van-empty v-else description="没有符合条件的单据"></van-empty>
                            </pull-up-down>
                           
                            <van-button round icon="plus" type="primary" color="#009D85" class="diy" @click="showAdd"/>
                           
                            <van-calendar safe-area-inset-bottom v-model="showdate" type="range" allow-same-day :default-date="defaultdate" :min-date="mindate" @confirm="onConfirmdate" />
                        </div>
                   </div>
                    `,
        data() {
            return {
                cyval: '', //产业
                cykey: '',
                showCy: false,
                cys: ['电工','照明','管道','智能','电力电气','线缆','南科'],
                cyDict: [{key: 'A60', value: '电工'},{key: 'A80', value: '照明'},
                         {key: 'I10', value: '管道'},{key: 'G10', value: '智能'},
                         {key: 'R10', value: '电力电气'},{key: 'F10', value: '线缆'},{key: 'H10', value: '南科'}],
                strDate:'', // 日期
                endDate:'',
                khdm: '', //客户代码
                active:['1'],
                jdstatus:1,
                page:1,
                limit:10,
                sum:0,
                count:0,
                value:'',
                showsearch:false,
                showdate:false,
                date: `${this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} -- ${this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))}`,
                defaultdate:[],
                mindate:  new Date(1900, 0, 1),
                dataList:[],
                orderList:[],
                activeNames:['0']

            };
        },
        methods: {
            pickCy: function(value){
                var self = this;
                self.cyval = value;
                self.showCy = false;
                self.cykey = self.cyDict.filter(cy => cy.value === value)[0]['key'];
            },
            loadOrder(){
                var self = this;
                var orderdata = {
                    "strDate":self.strDate,
                    "endDate":self.endDate,
                    "cy":self.cykey,
                    "limit":self.limit,
                    "page":self.page
                };
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/afterSale/list",orderdata, httpKit.type.form).then(res=>{
                    self.$toast.clear();
                    self.sum = res.count;
                    self.count = _.ceil(res.count / this.limit);
                    if(self.page == '1'){
                        self.orderList = res.data;
                    }else{
                        self.orderList = self.orderList.concat(res.data);
                    }
                    self.page++;
                    if (self.orderList && self.orderList.length > 0)
                        self.$refs['pull'].closePullDown();
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            },
            showDetail: function (order) {
                window.location.href = "../gsaleservice/gserviceDetail.html?saleid="+order.requestid;
            },
            showAdd: function (){
                window.location.href = "../gsaleservice/gserviceAdd.html";
            },
            showSpopup(){
                this.showsearch = true;
            },
            formatDate(date) {
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            },
            onConfirmdate(date) {
                const [start, end] = date;
                this.showdate = false;
                this.date = `${this.formatDate(start)} -- ${this.formatDate(end)}`;
            },
            searchsure(){
                console.info(this.date);
                var datearr = this.date.split('--');
                this.strDate = datearr[0];
                this.endDate = datearr[1];
                this.page = 1;
                this.loadOrder();
                this.showsearch = false;
            }
        },
        mounted(){
            this.$nextTick(function () {
                var self = this;
                self.loadOrder();
            });
        }
    });
});