import * as request from "./request"
import api from "../api/index"
/**
 * @description 获取链接参数
 * @param {*} url 
 * @param {*} name 
 */
export function getUrlParam(url, name) {
    let reg = /([^&^\?^\/^#]*?)=(.*?)(?=$|&|#|\/)/g;
    let result;
    while ((result = reg.exec(url))) {
      if (result[1] == name) {
        return decodeURIComponent(result[2]);
      }
    }
    return "";
}
/**
 * @description 获取token
 * @param {*} idPi 
 */
export function getToken(idPi) {
    return new Promise((resolve, reject) => {
      request.post(api.getToken,{ idPi: idPi || localStorage.idPi}).then(
        res => {
          resolve(res.data.body);
        },
        err => {
          reject(err);
        }
      );
    });
}