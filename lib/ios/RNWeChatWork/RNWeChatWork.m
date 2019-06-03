
#import "RNWeChatWork.h"
#import "WWKApiObject.h"

@implementation RNWeChatWork

@synthesize bridge = _bridge;

#define REGISTER_REQUIRED (@"RegisterApp Required.")
#define REGISTER_FAILED (@"WeChatWork Register Failed.")

RCT_EXPORT_MODULE(WeChatWork)

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"EventWeChatWork"];
}

- (instancetype)init
{
   self = [super init];
   if (self) {
       [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleOpenURL:) name:@"RCTOpenURLNotification" object:nil];
   }
   return self;
}

- (void)dealloc
{
   [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (BOOL)handleOpenURL:(NSNotification *)aNotification
{
   NSString * aURLString =  [aNotification userInfo][@"url"];
   NSURL * aURL = [NSURL URLWithString:aURLString];

   if ([WWKApi handleOpenURL:aURL delegate:self])
   {
       return YES;
   } else {
       return NO;
   }
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(registerApp:(NSString *)schema
                  :(NSString *)corpId
                  :(NSString *)agentId
                  :(RCTResponseSenderBlock)callback)
{
    callback(@[[WWKApi registerApp:schema corpId:corpId agentId:agentId] ? [NSNull null] : REGISTER_FAILED]);
}

RCT_EXPORT_METHOD(isAppInstalled:(RCTResponseSenderBlock)callback)
{
    callback(@[[NSNull null], @([WWKApi isAppInstalled])]);
}

RCT_EXPORT_METHOD(getAppInstallUrl:(RCTResponseSenderBlock)callback)
{
    callback(@[[NSNull null], [WWKApi getAppInstallUrl]]);
}

RCT_EXPORT_METHOD(getApiVersion:(RCTResponseSenderBlock)callback)
{
    callback(@[[NSNull null], [WWKApi getApiVersion]]);
}

RCT_EXPORT_METHOD(openApp:(RCTResponseSenderBlock)callback)
{
    callback(@[([WWKApi openApp] ? [NSNull null] : REGISTER_FAILED)]);
}

RCT_EXPORT_METHOD(SSOAuth:(NSString *)state)
{
    [self SSO:state];
}

- (Boolean)SSO:(NSString *)state {
    WWKSSOReq *req = [WWKSSOReq new];

    req.state = state;
    [WWKApi sendReq:req];
    return true;
}

RCT_EXPORT_METHOD(shareLinkAttachment:(NSString *)title :(NSString *)summary :(NSString *)url) {
    WWKSendMessageReq *req = [[WWKSendMessageReq alloc] init];
    WWKMessageLinkAttachment *attachment = [[WWKMessageLinkAttachment alloc] init];
    // 示例用链接，请填写你想分享的实际链接的标题、介绍、图标和URL
    attachment.title = title;
    if (summary) {
        attachment.summary = summary;
    }
    attachment.url = url;
    attachment.icon = [NSData dataWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"icon" ofType:@"jpg"]];
    req.attachment = attachment;
    [WWKApi sendReq:req];
}

#pragma mark - wx callback

-(void) onReq:(WWKBaseReq *)req {
    NSLog(@"onReq");
}

- (void)onResp:(WWKBaseResp *)resp {
    /* SSO 的回调 */
    if ([resp isKindOfClass:[WWKSSOResp class]]) {
        WWKSSOResp *r = (WWKSSOResp *)resp;

        NSMutableDictionary *body = [NSMutableDictionary new];
        body[@"errCode"] = @(r.errCode);
        body[@"errStr"] = r.errStr;
        body[@"state"] = r.state;
        body[@"code"] = r.code;
        body[@"type"] = @"SSOAuth.Resp";

        NSLog(@"body = %@", [body description]);

        [self sendEventWithName:WeChatWorkEventName body:body];
    } else
    /// 分享回调
    if ([resp isKindOfClass:[WWKSendMessageResp class]]) {
        WWKSendMessageResp *r = (WWKSendMessageResp *)resp;
        
        NSMutableDictionary *body = [NSMutableDictionary new];
        body[@"errCode"] = @(r.errCode);
        body[@"errStr"] = r.errStr;
        body[@"type"] = @"Share.Resp";
        
        NSLog(@"body = %@", [body description]);
        
        [self sendEventWithName:WeChatWorkEventName body:body];
    }
}

@end
