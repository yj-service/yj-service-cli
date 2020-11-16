import Vue from 'vue'
import Index from "./pages/index";

new Vue({
    router,
    render: h => h(Index),
}).$mount('#app')

YjService.install = function(Vue){
  Vue.component(Index.name,Index);
}
export default YjService;