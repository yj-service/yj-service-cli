import axois from "axios";
import config from "./config";
import { Toast } from 'vant'
import {getToken} from "./common"
import Router from '../router/index'

axois.interceptors.request.use(
  config => {
    let token = localStorage.getItem("token") || "";
    if (token) {
      config.headers = {
        token: token
      };
    }
    config.headers['idSoftOrg'] = global.idSoftOrg;
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
axois.interceptors.response.use(
  response => {
    //处理状态码为200，但接口异常的情况
    if (response.data.code == '200') {
      return response;
    }else if (response.data.code == "500") {
      Toast(response.data.msg || response.data.message)
    }else if (response.data.code == "501") {
      refreshCount()
    }else if(response.data.code == "502"){
      //跳转页面，显示502系统维护界面
    }else if(response.data.code == "404"){
      //显示404 NOT_FOUND页面
    }else{
      //  
    }
  },
  error => {
    // 处理服务器状态码不为200的情况,返回promise可以自定义处理,将alert换成其他toast组件
    if (error.response&&error.response.status) {
      if (error.response) {
        if(error.response.data&&error.response.data.code === 404){
          refreshCount()
        }else {
          Toast(error.response.data.message || error.response.data.msg)
        }
      } else if (error.request) {
        Toast(error.request.data.message)
      } else {
        Toast(error.message)
      }
    }else{
      refreshCount()
    }
    return Promise.reject(error);
  }
);
/**
 * @description 统计计数，错误5次以上就指向404
 */
function refreshCount(){
  let count = 0;
  if(localStorage.getTokenCount && localStorage.getTokenCount !== 'null' && localStorage.getTokenCount !== 'undefined'){
    count = Number(localStorage.getTokenCount)+1
  }
  localStorage.getTokenCount = count;
  if(Number(localStorage.getTokenCount < 5)){
    getToken(localStorage.idPi).then(res => {
      localStorage.getTokenCount = 0;
      localStorage.setItem("token", res);
      location.reload()
    });
  }else {
    localStorage.getTokenCount = 0;
    Router.replace({path:'/404'})
  }
}
function httpRequest(method, url, data, configHeaders={}, baseURL) { 
  return axois({
    baseURL: baseURL ? baseURL : config.server + "/" + config.apiVersion,
    method: method,
    headers:configHeaders,
    url: url,
    params: method === "GET" ? data : null,
    data: data || null
  });
}
export default {
  get(url, data, config, baseURL) {
    return httpRequest("GET", url, data, config, baseURL);
  },
  post(url, data, config, baseURL) {
    return httpRequest("POST", url, data, config, baseURL);
  },
  put(url, data, config, baseURL) {
    return httpRequest("PUT", url, data, config, baseURL);
  },
  patch(url, data) {
    return httpRequest("PATCH", url, data);
  },
  delete(url, data) {
    return httpRequest("DELETE", url, data);
  },
  request(method, url, data,config) {
    return httpRequest(method, url, data,config);
  }
};
