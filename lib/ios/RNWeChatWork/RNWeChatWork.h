
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#import <React/RCTEventEmitter.h>

#import "WWKApi.h"

#define WeChatWorkEventName @"EventWeChatWork"

@interface RNWeChatWork : RCTEventEmitter <RCTBridgeModule, WWKApiDelegate>

@end
