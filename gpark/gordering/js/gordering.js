require(['httpKit','echarts'], function (httpKit, echarts) {
    Vue.use(vant.Lazyload);
    new Vue({
        el: '#gordering',
        template: `<div style="padding-bottom: 65px;">
                        <van-swipe :autoplay="3000" style="margin:15px 15px 0;">
                          <van-swipe-item v-for="(image, index) in images" :key="index">
                            <van-image radius="15px" lazy-load :src="image" style="width: 100%" />
                          </van-swipe-item>
                        </van-swipe>
                        <van-divider :style="{ borderColor: '#fff', padding: '0 5px',color:'#999',margin:'5px 0' }"></van-divider>
                        <van-grid  :column-num="3">
                           <van-grid-item clickable  url="../gworkorder/gworkorder.html?type=3">
                            <van-icon name="todo-list-o" size="30" color="#d87a80"/>
                            <span style="color:#d87a80;font-size:14px">加班餐</span>
                          </van-grid-item>
                          <van-grid-item clickable url="../gviporder/gviporder.html?type=1">
                            <van-icon name="vip-card-o" size="30" color="#4ea397"/>
                            <span style="color:#4ea397;font-size:14px">包厢/卡包</span>
                          </van-grid-item>
                          <van-grid-item clickable url="../gbusinessorder/gbusinessorder.html?type=2">
                            <van-icon name="send-gift-o" size="30" color="#ffb980"/>
                            <span style="color:#ffb980;font-size:14px">商务套餐</span>
                          </van-grid-item>
                          <van-grid-item clickable url="../gbusorder/gbusorder.html">
                            <van-icon name="logistics" size="30" color="#5ab1ef"/>
                            <span style="color:#5ab1ef;font-size:14px">班车预约</span>
                          </van-grid-item>
                          <van-grid-item clickable @click="grecord">
                            <van-icon name="balance-list-o" size="30" color="#d281ff"/>
                            <span style="color:#d281ff;font-size:14px">餐厅消费记录</span>
                          </van-grid-item>
                         
                          <van-grid-item clickable url="../gmenu/gmenu.html">
                            <van-icon name="description"  size="30" color="#ff7fb1"/>
                            <span style="color:#ff7fb1;font-size:14px">今日菜单</span>
                          </van-grid-item>
                          <van-grid-item clickable>
                            <van-icon name="shop-o" size="30" color="#999"/>
                            <span style="color:#999;font-size:14px">小超市</span>
                          </van-grid-item>
                          
                          <!--<van-grid-item clickable>
                            <van-icon name="more-o" size="30" color="#999"/>
                            <span style="color:#999;font-size:14px">更多</span>
                          </van-grid-item>-->
                        </van-grid>
                     
                        <div class="myorder">
                           <van-grid direction="horizontal" :column-num="1">
                              <van-grid-item url="../gmyordering/gmyordering.html" icon="orders-o" text="我的餐饮预订" />
                            </van-grid>
                        </div>
                   </div>
                    `,
            data() {
                return {
                    images: [
                        '../gordering/img/pic-1.png',
                    ],
                };
            },
            methods: {
                grecord(){
                   // window.location.href = 'http://dev.sge.cn/rest/oapi/stxfjl?access_token='+document.cookie

                    this.$toast.loading({ forbidClick: true, duration: 0});
                    //return;
                    httpKit.post("/getToken").then(res=>{
                        this.$toast.clear();
                        window.location.href = 'http://dev.sge.cn/rest/oapi/stxfjl?access_token='+res.data
                    }).catch(err => {
                        this.$toast.clear();
                        this.$toast.fail({
                            message: err.message
                        });
                    });
                }
            },
            created(){

            },
            mounted(){

            }
        });

});