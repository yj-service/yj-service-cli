import Vue from 'vue';
import router from './router/index';
import Index from "./pages/index";
import api from "./api/index"
import axios from "./util/request"
import {getUrlParam,getToken} from "./util/common"

Vue.prototype.$axios = axios;

let instance = null;
// 添加渠道id
router.beforeEach((to, from, next) => {
  if (!global.idSoftOrg) {
    const idSoftOrg = getUrlParam(location.href, "idSoftOrg");
    if (idSoftOrg) {
      global.idSoftOrg = idSoftOrg || "";
    }
  }
  if(!localStorage.token){
    const idPi = getUrlParam(idPi);
    localStorage.idPi = idPi;
    getToken(localStorage.idPi).then(res => {
      localStorage.token = res; 
      next();
    })  
  }else{
    next();
  }
})

function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    router,
    api,
    render: h => h(Index),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}

export async function mount(props) {
  console.log('[vue] props from main framework', props);
  storeTest(props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
}

function storeTest(props) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value, prev) => console.log(value, prev),
      true,
    );
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      },
    });
}

Index.install = function (Vue) {
  Vue.component(Index.name, Index);
}
export default Index;