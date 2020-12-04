require(['httpKit','echarts'], function (httpKit, echarts) {
    Vue.use(vant.Lazyload);
    new Vue({
        el: '#gordering',
        template: `<div>
                        <van-swipe :autoplay="3000">
                          <van-swipe-item v-for="(image, index) in images" :key="index">
                            <img v-lazy="image" style="width: 100%" />
                          </van-swipe-item>
                        </van-swipe>
                        <van-divider :style="{ borderColor: '#fff', padding: '0 10px',color:'#333' }"></van-divider>
                        <van-grid :gutter="20" :column-num="2">
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
                          <van-grid-item clickable>
                            <van-icon name="send-gift-o" size="30" color="#999"/>
                            <span style="color:#999;font-size:14px">小超市</span>
                          </van-grid-item>
                          <van-grid-item clickable>
                            <van-icon name="more-o" size="30" color="#999"/>
                            <span style="color:#999;font-size:14px">更多</span>
                          </van-grid-item>
                          <!--<van-grid-item clickable icon="vip-card-o" text="包厢/卡包" />
                          <van-grid-item clickable icon="send-gift-o" text="商务套餐" />
                          <van-grid-item clickable icon="todo-list-o" text="加班餐" />
                          <van-grid-item clickable icon="more-o" text="更多" />-->
                        </van-grid>
                        <div class="myorder">
                           <van-grid direction="horizontal" :column-num="1">
                              <van-grid-item url="../gmyordering/gmyordering.html" icon="orders-o" text="我的预定" />
                            </van-grid>
                        </div>
                   </div>
                    `,
            data() {
                return {
                    images: [
                        '../gordering/img/img1.png',
                    ],
                };
            },
            methods: {

            },
            created(){

            },
            mounted(){

            }
        });

});