import { request } from 'umi';
import { getApiBase } from '@/utils/utils';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function login(params: LoginParamsType) {
  return request<API.LoginStateType>(getApiBase() + '/backend/admins/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request(getApiBase() + '/backend/admins/logout');
}
