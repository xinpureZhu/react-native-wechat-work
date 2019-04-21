/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

import * as WeChatWork from 'react-native-wechat-work'

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      apiVersion: 'waiting...',
      appInstallUrl: 'waiting...',
      isAppInstalled: 'waiting...',
    };
  }
  async componentDidMount() {
    try {
      await WeChatWork.registerApp('11', '22', '33');
      this.setState({
        apiVersion: await WeChatWork.getApiVersion(),
        appInstallUrl: await WeChatWork.getAppInstallUrl(),
        isAppInstalled: await WeChatWork.isAppInstalled()
      });
      console.log(this.state);
    } catch (e) {
      console.error(e);
    }
    console.log(WeChatWork);
  }

  componentWillUnMount() {
    WeChatWork.removeAllListener()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>API 版本：{this.state.apiVersion}</Text>
        <Text>企业微信安装 URL：{this.state.appInstallUrl}</Text>
        <Text>是否安装企业微信：{String(this.state.isAppInstalled)}</Text>
        <TouchableOpacity onPress={this.auth}>
          <Text>企业微信登录</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async auth() {
    const result = await WeChatWork.SSOAuth();
    result && alert('SSOAuth Success')
    console.log('result = ', result)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
