require(['PullUpDown'],function (PullUpDown) {
    new Vue({
        el: '#gtabs',
        components: {
          'PullUpDown': PullUpDown
        },
        template: `<div>
                       <van-tabs v-model="active">
                              <van-tab title="标签 1">
                                <PullUpDown ref="one" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="appendOne">
                                    <div v-for="o in one" style="height: 60px; border: 1px solid green;">
                                        {{o}}
                                     </div>
                                </PullUpDown>
                              </van-tab>
                              <van-tab title="标签 2">
                                    <PullUpDown ref="two" :pullDown="false" :currentPage="tpage" :count="tcount" :sum="tsum" @nextPage="appendTwo">
                                        <div v-for="o in two" style="height: 60px; border: 1px solid green;">
                                            {{o}}
                                         </div>
                                    </PullUpDown>
                              </van-tab>
                          <van-tab title="标签 3">内容 3</van-tab>
                          <van-tab title="标签 4">内容 4</van-tab>
                       </van-tabs>
                   </div>`,
            data() {
                return {
                    active:0,
                    page: 1,
                    count: 5,
                    sum: 50,
                    one: [],
                    tpage: 1,
                    tcount: 5,
                    tsum: 50,
                    two: []
                };
            },
            methods: {
                appendOne (){
                    var self = this
                    self.page++
                    for (var i = self.page * 10; i <= self.page*10 + 10; i++){
                        (function(i){
                            setTimeout(function(){self.one.push('first:'+i)}, 5000);
                        })(i);
                    }
                    var timer = setInterval(function(){
                        if (self.one.length >= self.page * 10) {
                            self.$refs["one"].closePullDown();
                            clearInterval(timer);
                        }
                    }, 1000);
                },
                appendTwo (){
                    var self = this
                    self.tpage++
                    for (var i = self.tpage * 10; i <= self.tpage*10 + 10; i++){
                        (function(i){
                            setTimeout(function(){self.two.push('second:'+i)}, 5000);
                        })(i);
                    }
                    var timer = setInterval(function(){
                        if (self.two.length >= self.tpage * 10) {
                            self.$refs["two"].closePullDown();
                            clearInterval(timer);
                        }
                    }, 1000);
                }
            },
            created(){
                var self = this
                for (var i = 0; i<=10; i++){
                    self.one.push('first:'+i)
                }
                for (var i = 0; i<=10; i++){
                    self.two.push('second:'+i)
                }
            },
            mounted(){

            }
        });

});