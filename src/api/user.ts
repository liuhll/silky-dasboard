import { http } from "../utils/http";

// 获取验证码
export const getVerify = (): any => {
  return http.request("get", "/captcha");
};

// 登录
export const getLogin = (data: any): any => {
  const requestParams: any = {};
  requestParams[window.tenantName] = data.tenantName;
  requestParams[window.account] = data.userName;
  requestParams[window.password] = data.password;
  return http.request("post", window.authApi, requestParams);
};
