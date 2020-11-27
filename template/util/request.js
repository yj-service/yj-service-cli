import axois from "axios";
import config from "./config";

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
    if(response){
       Promise.resolve(response);   
    }
  },
  error => {
    return Promise.reject(error);
  }
);
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
