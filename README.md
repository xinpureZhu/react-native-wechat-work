
# react-native-wechat-work

## Reference

[react-native-wechat](https://github.com/yorkie/react-native-wechat)

## Getting started

`$ npm install react-native-wechat-work --save`

### Mostly automatic installation

`$ react-native link react-native-wechat-work`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-wechat-work` and add `RNWeChatWork.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNWeChatWork.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.xinpure.wechatwork.RNWeChatWorkPackage;` to the imports at the top of the file
  - Add `new RNWeChatWorkPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-wechat-work'
  	project(':react-native-wechat-work').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-wechat-work/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-wechat-work')
  	```


## Usage
```javascript
import RNWeChatWork from 'react-native-wechat-work';

// TODO: What to do with the module?
RNWeChatWork;
```

## Run Example

```
yarn install

cd ios

pod install
```

### iOS
由于iOS系统的限制，在iOS9及以上系统检测企业微信是否安装，需要将企业微信的scheme"wxwork"(云端版本)及"wxworklocal"(本地部署版本)添加到工程的Info.plist中的LSApplicationQueriesSchemes白名单里，否则此方法总是会返回NO。

On iOS 9+, add wxwork and wxworklocal into LSApplicationQueriesSchemes in Targets > info > Custom iOS Target Properties. Or edit Info.plist then add:

```
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>wxworklocal</string>
  <string>wxwork</string>
</array>
```

在 AppDelegate.m 文件中添加 handleOpenURL 支持

```
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```

You must rebuild it with bitcode enabled (Xcode setting ENABLE_BITCODE), obtain an updated library from the vendor, or disable bitcode for this target. file '/Project/react-native-wechat-work/lib/ios/libWXWorkApi.a' for architecture arm64

Fixed: This is used for appthining. If you dont want to update the sdk you cam turn off bitcode in your project.
Go to your target-> Settings and serch for bitcode. Than turn the option to NO. By default its activated

### Android
AndroidManifest.xml
```
<intent-filter>
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="your scheme" />
</intent-filter>
```


### 企业微信后台

在手机安装使用 Gen_Signature_Android.apk 生成签名后，将签名添加到后台管理界面
