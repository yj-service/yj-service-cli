import Vue from 'vue';
import router from './router/index';
import Index from "./pages/index";

new Vue({
  router,
  render: h => h(Index),
}).$mount('#app')

Index.install = function (Vue) {
  Vue.component(Index.name, Index);
}
export default Index;