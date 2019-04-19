'use strict';

import { DeviceEventEmitter, NativeEventEmitter, NativeModules } from 'react-native';

let isAppRegistered = false;
const { WeChatWork } = NativeModules;

const emitter = new NativeEventEmitter(WeChatWork);

const subscription = emitter.addListener('EventWeChatWork', resp => {
  DeviceEventEmitter.emit(resp.type, resp);
});

function wrapRegisterApp(nativeFunc) {
  if (!nativeFunc) {
    return undefined;
  }
  return (...args) => {
    if (isAppRegistered) {
      return Promise.resolve(true);
    }
    isAppRegistered = true;
    return new Promise((resolve, reject) => {
      nativeFunc.apply(null, [
        ...args,
        (error, result) => {
          if (!error) {
            return resolve(result);
          }
          if (typeof error === 'string') {
            return reject(new Error(error));
          }
          reject(error);
        },
      ]);
    });
  };
}

function wrapApi(nativeFunc) {
  if (!nativeFunc) {
    return undefined;
  }
  return (...args) => {
    if (!isAppRegistered) {
      return Promise.reject(new Error('registerApp required.'));
    }
    return new Promise((resolve, reject) => {
      nativeFunc.apply(null, [
        ...args,
        (error, result) => {
          if (!error) {
            return resolve(result);
          }
          if (typeof error === 'string') {
            return reject(new Error(error));
          }
          reject(error);
        },
      ]);
    });
  };
}

/**
 * @method registerApp
 * @param {String} schema - the app schema
 * @param {String} corpID - the WeChatWork corpID
 * @param {String} agentId - the app agentId
 * @return {Promise}
 */
export const registerApp = wrapRegisterApp(WeChatWork.registerApp);

/**
 * Return if the wechat work app is installed in the device.
 * @method isAppInstalled
 * @return {Promise}
 */
export const isAppInstalled = wrapApi(WeChatWork.isAppInstalled);

/**
 * Get the wechat work app installed url
 * @method getAppInstallUrl
 * @return {String} the wechat work app installed url
 */
export const getAppInstallUrl = wrapApi(WeChatWork.getAppInstallUrl);

/**
 * Get the wechat work api version
 * @method getApiVersion
 * @return {String} the api version string
 */
export const getApiVersion = wrapApi(WeChatWork.getApiVersion);

/**
 * Open wechat work app
 * @method openApp
 * @return {Promise}
 */
export const openApp = wrapApi(WeChatWork.openApp);

export function SSOAuth(state) {
  return new Promise((resolve, reject) => {
    WeChatWork.SSOAuth(state);
    DeviceEventEmitter.once('SSOAuth.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}

export const removeAllListener = () => {
  DeviceEventEmitter.removeAllListener();
  subscription.remove();
}

/**
 * promises will reject with this error when API call finish with an errCode other than zero.
 */
export class WechatError extends Error {
  constructor(resp) {
    const message = resp.errStr || resp.errCode.toString();
    super(message);
    this.name = 'WechatError';
    this.code = resp.errCode;

    // avoid babel's limition about extending Error class
    // https://github.com/babel/babel/issues/3083
    if (typeof Object.setPrototypeOf === 'function') {
      Object.setPrototypeOf(this, WechatError.prototype);
    } else {
      this.__proto__ = WechatError.prototype;
    }
  }
}
