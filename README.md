
# react-native-we-chat-work

## Getting started

`$ npm install react-native-we-chat-work --save`

### Mostly automatic installation

`$ react-native link react-native-we-chat-work`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-we-chat-work` and add `RNWeChatWork.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNWeChatWork.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.xinpure.WechatWork.RNWeChatWorkPackage;` to the imports at the top of the file
  - Add `new RNWeChatWorkPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-we-chat-work'
  	project(':react-native-we-chat-work').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-we-chat-work/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-we-chat-work')
  	```


## Usage
```javascript
import RNWeChatWork from 'react-native-we-chat-work';

// TODO: What to do with the module?
RNWeChatWork;
```
  