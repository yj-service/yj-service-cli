import Vue from 'vue';
import router from './router/index';
import Index from "./pages/index";
import api from "./api/index"
import axios from "./util/request"
import {getUrlParam,getToken, goLogIn} from "./util/common"

Vue.prototype.$axios = axios;
Vue.prototype.$api = api;

let instance = null;
// 添加渠道id
router.beforeEach((to, from, next) => {
  const idPi = getUrlParam(location.href,"idPi");
  const serviceCode = getUrlParam(location.href,"serviceCode");
  const isPermission = getUrlParam(location.href,"isPermission");
  const idPiOrg = getUrlParam(location.href,"idPiOrg");
  const openId = getUrlParam(location.href,"openId");
  if(isPermission&&isPermission!== localStorage.isPermission){
    localStorage.isPermission = isPermission;
  }
  if(idPiOrg&&idPiOrg!== localStorage.idPiOrg){
    localStorage.idPiOrg = idPiOrg;
  }
  if(openId&&openId!== localStorage.openId){
    localStorage.openId = openId;
  }
  if(serviceCode&&serviceCode!== localStorage.serviceCode){
    localStorage.serviceCode = serviceCode;
  }
  if(idPi&&idPi!== localStorage.idPi){
    localStorage.idPi = idPi;
  }
  // 判断是否登录
  if (!localStorage.idPi || localStorage.idPi === 'undefined' || localStorage.idPi === 'null') {
    goLogIn({
      required: true,
      targetRedirect: location.href,
      isPerfectInformation: false
    })
  }
  if (!global.idSoftOrg) {
    const idSoftOrg = getUrlParam(location.href, "idSoftOrg");
    if (idSoftOrg) {
      global.idSoftOrg = idSoftOrg || "";
    }
  }
  document.title = to.meta&&to.meta.title || '';
  //没有token时设置token
  if(!localStorage.token){
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