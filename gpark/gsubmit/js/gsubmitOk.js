require(['httpKit'], function (httpKit) {
    new Vue({
        el: '#gsubmitOk',
        template: `<div>
                       <div class="empty">
                            <van-icon class="success" color="#07c160" name="passed" @click="tap" />
                            <p>订单提交成功！</p>
                            <!--
                            <div class="btnCenter">
                                <van-button  type="primary" @click="goShoping">继续购物</van-button>
                                <van-button plain type="primary" @click="goOrder">查看订单</van-button>
                                <van-button plain type="info" @click="goPayment">到款录入</van-button>
                            </div>
                            -->
                            <div class="buttons">
                                <van-button  type="primary" @click="goShoping" block>继续购物</van-button>
                                <van-button plain type="primary" @click="goOrder" block>查看订单</van-button>
                                <van-button plain type="info" @click="goPayment" block>到款录入</van-button>
                            </div>
                            <div v-if="payId > 0 && showPay>5" class="buttons">
                                <p>支付订单号：{{payId}}</p>
                                <van-button color="linear-gradient(to right, #ff6034, #ee0a24)" @click="goPay"  block>在线支付</van-button>
                            </div>
                       </div>
                    </div>
                    `,
        data() {
            return {
                payId: null,
                showPay: 0
            };
        },
        methods: {
            tap(){
                this.showPay += 1
            },
            goShoping(){
                window.location.href = "../gcat/gcat.html"
            },
            goOrder(){
                window.location.href = "../gorder/gorder.html"
            },
            goPayment(){
                window.location.href = "../gpayment/gpayment.html"
            },
            goPay(){
                window.location.href = "../gpay/gpay.html?payId="+this.payId
            }
        },
        computed: {

        },
        watch:{

        },
        created(){
            var self = this
            if (httpKit.urlParams() && httpKit.urlParams().payId)
                self.payId = httpKit.urlParams().payId
            else
                self.payId = -1
        },
        mounted(){
            this.$nextTick(function () {

            })
        }
    });
});