require(['httpKit','echarts'], function (httpKit, echarts) {
    Vue.use(vant.Lazyload);
    new Vue({
        el: '#gmenu',
        template: `
                   <div>
                        <van-tabs class="tab-menu"  color="#009D85" v-if="menu.length>0">
                          <van-tab v-for="(item,index) in menu">
                            <template #title>
                                <span>{{item.menuType}}</span>
                            </template>
                             <ul v-if="item.dishes.length>0">
                                <li v-for="value in item.dishes">
                                    <van-divider :style="{ color: '#1989fa', borderColor: '#fff', padding: '0 10px' }">{{value.dishesType}}</van-divider>
                                    <van-grid :column-num="3" style="color:#555">
                                       <van-grid-item v-for="dish in value.dishesBase" style="font-size:12px;">
                                            <template #text>
                                                <label style="font-size: 14px">{{dish.dishesName}}</label>
                                                <div v-show="dish.unauditedPrice > 0"><span>未审核价<em style="font-style: normal;color: #ff4e42">￥{{dish.unauditedPrice}}</em></span></div>
                                                <div v-show="dish.price > 0"><em v-show="dish.unauditedPrice > 0" style="font-style: normal;">已审核价</em><span style="color: #ff4e42">￥{{dish.price}}</span></div>
                                            </template>
                                       </van-grid-item>
                                    </van-grid>
                                </li>
                             </ul>
                             <van-empty v-else description="暂时还没有菜单信息" />
                             <van-divider :style="{ color: '#999', borderColor: '#fff', padding: '0 10px' }"><time style="font-size:12px;color:#999">更新于：{{item.updateTime}}</time></van-divider>
                             <div></div>      
                          </van-tab>
                        </van-tabs>
                        <van-empty v-else description="暂时还没有菜单信息" />
                   </div>
                  `,
            data() {
                return {
                    menu:[]
                };
            },
            methods: {
                getmenu(){
                    var self = this;
                    self.$toast.loading({ forbidClick: true, duration: 0});
                    httpKit.post("/park/menu/todaymenu").then(res=>{
                        self.$toast.clear();
                        console.info(res);
                        self.menu = res.data
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                }
            },
            created(){

            },
            mounted(){
                this.getmenu();
            }
        });

});