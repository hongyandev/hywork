require(['httpKit'], function (httpKit) {
    new Vue({
        el: '#gcomment',
        template: `
                    <div>
                        <van-divider :style="{ borderColor: '#fff', padding: '0 16px' }"></van-divider>
                        <ul class="comment">
                            <li>
                                <div class="myd">
                                    <span>环境评价</span><van-rate  v-model="evaluateStar1" @change="onChange1" /><span class="mydtext">{{hjpj}}</span>
                                </div>
                            </li>
                            <li>
                                <div class="myd">
                                    <span>服务评价</span><van-rate v-model="evaluateStar2" @change="onChange2" /><span class="mydtext">{{fwpj}}</span>
                                </div>
                            </li>
                            <li>
                                <div class="myd">
                                    <span>味道评价</span><van-rate v-model="evaluateStar3" @change="onChange3" /><span class="mydtext">{{wdpj}}</span>
                                </div>
                            </li>
                            <li>
                                <div class="myd">
                                    <span>总体评价</span><van-rate v-model="evaluateStarSum" @change="onChange4" /><span class="mydtext">{{ztpj}}</span>
                                </div>
                            </li>
                        </ul>
                        <div style="margin: 16px;">
                            <van-button color="#07c160" round block type="primary" @click="submit">
                              提交
                            </van-button>
                          </div>
                    </div>
                   `,
        data() {
            return {
                hjpj: '',
                fwpj:'',
                wdpj:'',
                ztpj:'',
                evaluateStar1:0,
                evaluateStar2:0,
                evaluateStar3:0,
                evaluateStarSum:0,
                problem:'',
                message:'',
                showPicker:false,
                columns:['是','否']
            }
        },
        methods: {
            onChange1(value) {
                //Toast('当前值：' + value);
                switch (value) {
                    case 1:
                        this.hjpj = "很不满意";
                        break;
                    case 2:
                        this.hjpj = "不满意";
                        break;
                    case 3:
                        this.hjpj = "一般";
                        break;
                    case 4:
                        this.hjpj = "满意";
                        break;
                    case 5:
                        this.hjpj = "很满意";
                }

            },
            onChange2(value) {
                //Toast('当前值：' + value);
                switch (value) {
                    case 1:
                        this.fwpj = "很不满意";
                        break;
                    case 2:
                        this.fwpj = "不满意";
                        break;
                    case 3:
                        this.fwpj = "一般";
                        break;
                    case 4:
                        this.fwpj = "满意";
                        break;
                    case 5:
                        this.fwpj = "很满意";
                }

            },
            onChange3(value) {
                //Toast('当前值：' + value);
                switch (value) {
                    case 1:
                        this.wdpj = "很不满意";
                        break;
                    case 2:
                        this.wdpj = "不满意";
                        break;
                    case 3:
                        this.wdpj = "一般";
                        break;
                    case 4:
                        this.wdpj = "满意";
                        break;
                    case 5:
                        this.wdpj = "很满意";
                }

            },
            onChange4(value) {
                //Toast('当前值：' + value);
                switch (value) {
                    case 1:
                        this.ztpj = "很不满意";
                        break;
                    case 2:
                        this.ztpj = "不满意";
                        break;
                    case 3:
                        this.ztpj = "一般";
                        break;
                    case 4:
                        this.ztpj = "满意";
                        break;
                    case 5:
                        this.ztpj = "很满意";
                }
            },
            submit(){
                var self = this;
                self.$toast.loading({ forbidClick: true, duration: 0});
                var data = {
                    "evaluateStar1":self.evaluateStar1,
                    "evaluateStar2":self.evaluateStar2,
                    "evaluateStar3":self.evaluateStar3,
                    "evaluateStarSum":self.evaluateStarSum,
                    "id":httpKit.urlParams().id
                };
                httpKit.post("/reserve/canyin/evaluate",data,httpKit.type.json).then(res=>{
                    self.$toast.clear();
                    console.info(res);
                    self.$toast("谢谢您的评价！");
                    window.location.href='../../gpark/gmyordering/gmyordering.html?type=jbc'

                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            }
        },
        created: function () {

        },
        mounted: function () {

        }
    });
})