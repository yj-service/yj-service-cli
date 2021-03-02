import request from "./request"
import api from "../api/index"
import { isWeChat, combineUrl } from 'yj-common-utils'
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
      console.log(request,api.getToken)
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

/*
 *@description: 登陆
 *@author: Masc
 *@date: 2020-10-28 16:10:16
 *@variable1:
*/
export function goLogIn(data) {
  const reg = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/;
  const ua = isWeChat()
  if (ua) {
    location.replace(combineUrl(`${process.env.VUE_APP_CRMURL}/yj-h5/index.html#/WXRight`, {
      redirect: data.targetRedirect,
      isPerfectInformation: data.isPerfectInformation
    }))
  } else {
    jumpUrl(data)
  }
}

function jumpUrl(item) {
  location.replace(`${process.env.VUE_APP_CRMURL}/yj-h5-sso/index.html#/login?redirectUri=${encodeURIComponent(item.targetRedirect)}`)
}