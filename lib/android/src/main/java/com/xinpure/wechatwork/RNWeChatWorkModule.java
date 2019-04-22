
package com.xinpure.wechatwork;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import com.tencent.wework.api.IWWAPI;
import com.tencent.wework.api.IWWAPIEventHandler;
import com.tencent.wework.api.WWAPIFactory;
import com.tencent.wework.api.model.BaseMessage;
import com.tencent.wework.api.model.WWAuthMessage;
import com.tencent.wework.api.model.WWMediaConversation;
import com.tencent.wework.api.model.WWMediaFile;
import com.tencent.wework.api.model.WWMediaImage;
import com.tencent.wework.api.model.WWMediaLink;
import com.tencent.wework.api.model.WWMediaMergedConvs;
import com.tencent.wework.api.model.WWMediaText;
import com.tencent.wework.api.model.WWMediaVideo;

public class RNWeChatWorkModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private final String WeChatWorkEventName = "EventWeChatWork";
  private DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter;

  private IWWAPI iwwapi;
  private String APPID = "";
  private String AGENTID = "";
  private String SCHEMA = "";

  private final static String NOT_REGISTERED = "registerApp required.";
  private final static String INVOKE_FAILED = "WeChat API invoke returns false.";
  private final static String INVALID_ARGUMENT = "invalid argument.";

  public RNWeChatWorkModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "WeChatWork";
  }

  @ReactMethod
  public void registerApp(String schema, String appId, String agentId, Callback callback) {
    SCHEMA = schema;
    APPID = appId;
    AGENTID = agentId;

    iwwapi = WWAPIFactory.createWWAPI(this.reactContext);

    eventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

    callback.invoke(null, iwwapi.registerApp(this.SCHEMA));
  }

  @ReactMethod
  public void isAppInstalled(Callback callback) {
    if (iwwapi == null) {
      callback.invoke(NOT_REGISTERED);
      return;
    }
    callback.invoke(null, iwwapi.isWWAppInstalled());
  }

  @ReactMethod
  public void isAppSupportApi(Callback callback) {
    if (iwwapi == null) {
      callback.invoke(NOT_REGISTERED);
      return;
    }
    callback.invoke(null, iwwapi.isWWAppSupportAPI());
  }

  @ReactMethod
  public void getApiVersion(Callback callback) {
    if (iwwapi == null) {
      callback.invoke(NOT_REGISTERED);
      return;
    }
    callback.invoke(null, iwwapi.getWWAppSupportAPI());
  }

  @ReactMethod
  public void getAppInstallUrl(Callback callback) {
    if (iwwapi == null) {
      callback.invoke(NOT_REGISTERED);
      return;
    }
    callback.invoke(null, "");
  }

  @ReactMethod
  public void openApp(Callback callback) {
    if (iwwapi == null) {
      callback.invoke(NOT_REGISTERED);
      return;
    }
    callback.invoke(null, iwwapi.openWWApp());
  }

  @ReactMethod
  public void SSOAuth(String state) {
    this.SSO(state);
  }

  public void SSO(String state) {
    if (iwwapi == null) {
      return;
    }
    final WWAuthMessage.Req req = new WWAuthMessage.Req();
    req.sch = SCHEMA;
    req.appId = APPID;
    req.agentId = AGENTID;
    req.state = state;

    iwwapi.sendMessage(req, new IWWAPIEventHandler() {
      @Override
      public void handleResp(BaseMessage resp) {
        WritableMap map = Arguments.createMap();

        if (resp instanceof WWAuthMessage.Resp) {
          WWAuthMessage.Resp rsp = (WWAuthMessage.Resp) resp;

          map.putInt("errCode", rsp.errCode);
          map.putString("code", rsp.code);
          map.putString("state", rsp.state);
          map.putString("type", "SSOAuth.Resp");

          if (rsp.errCode == WWAuthMessage.ERR_CANCEL) {
            map.putString("errStr", "SSOAuth Cancel");
          }else if (rsp.errCode == WWAuthMessage.ERR_FAIL) {
            map.putString("errStr", "SSOAuth Failed");
          } else if (rsp.errCode == WWAuthMessage.ERR_OK) {
            map.putString("errStr", "SSOAuth OK");
          }
        }

        eventEmitter.emit(WeChatWorkEventName, map);
      }
    });
  }

}
