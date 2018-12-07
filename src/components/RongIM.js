
export const RongIms = {
    init(obj) {
        // 开发环境：25wehl3u28qfw，生产环境：qd46yzrfqe01f
        RongIMLib.RongIMClient.init("25wehl3u28qfw"); // appKey
        // 设置连接监听状态 （ status 标识当前连接状态 ）
        // 连接状态监听器
        let _this = this;
        RongIMClient.setConnectionStatusListener({
            onChanged: function (status) {
                // SDK 的连接状态：成功/连接/断开/重连
                switch (status) {
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('链接成功');
                        break;
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('断开连接');
                        _this.reconnect()
                        break;
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        let question = confirm("token 被其他设备登录，是否重新登录？")
                        if (question) {
                            // 跳到登录页
                            obj.$router.push('/')
                        }
                        break;
                    case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                        console.log('域名不正确');
                        break;
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('网络不可用');
                        _this.reconnect()
                        break;
                }
            }
        });
    },
    // 暂时不做：获取指定用户的未读消息，融云高级功能，付费
    // noReadMessage(userId) {//
    //     var conversationType = RongIMLib.ConversationType.PRIVATE;
    //     var targetId = userId;
    //     RongIMLib.RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
    //         onSuccess: function (count) {
    //             // count => 指定会话的总未读数。
    //         },
    //         onError: function () {
    //             // error => 获取指定会话未读数错误码。
    //         }
    //     });
    // },
    message(callBack) {
        // 消息监听器
        RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived: function (message) {
                console.log(message)
                // 这里有可能不是陪聊消息，返回所有消息。
                try {
                    if (message['objectName'] === 'PIE:FriendCustomMessage') {
                        message.content.message.content.st = new Date()
                        callBack(message.content.message.content)
                    }
                    else if (message['objectName'] === 'RC:VcMsg') {
                        callBack(message.content)
                    } else if (message['objectName'] === 'PIE:GameInvite') {
                        // 收到“游戏邀请” 类型消息 
                        message.content.message.content.messageType = 'text'
                        message.content.message.content.message = 'you recieved a game inviting'
                        callBack(message.content.message.content)
                    } else if (message['objectName'] === 'PIE:FriendGift') {
                        // 收到“发送礼物” 类型消息
                        message.content.message.content.messageType = 'text'
                        message.content.message.content.message = 'you recieved a gift,giftId: ' + message.content.message.content.giftId
                        callBack(message.content.message.content)
                    }
                } catch (error) {
                    console.log(message)
                }
                // 判断消息类型
                switch (message.messageType) {
                    case RongIMClient.MessageType.TextMessage:
                        // message.content.content => 消息内容
                        break;
                    case RongIMClient.MessageType.VoiceMessage:
                        // callBack(message.content)
                        // 对声音进行预加载                
                        // message.content.content 格式为 AMR 格式的 base64 码
                        // alert('rongIm voice ok!')
                        break;
                    case RongIMClient.MessageType.ImageMessage:
                        // message.content.content => 图片缩略图 base64。
                        // message.content.imageUri => 原图 URL。
                        break;
                    case RongIMClient.MessageType.DiscussionNotificationMessage:
                        // message.content.extension => 讨论组中的人员。
                        break;
                    case RongIMClient.MessageType.LocationMessage:
                        // message.content.latiude => 纬度。
                        // message.content.longitude => 经度。
                        // message.content.content => 位置图片 base64。
                        break;
                    case RongIMClient.MessageType.RichContentMessage:
                        // message.content.content => 文本消息内容。
                        // message.content.imageUri => 图片 base64。
                        // message.content.url => 原图 URL。
                        break;
                    case RongIMClient.MessageType.InformationNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ContactNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ProfileNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.UnknownMessage:
                        // do something...
                        break;
                    default:
                    // do something...
                }
            }
        });
    },
    connect(token) {
        RongIMClient.connect(token, {
            onSuccess: function (userId) {
                console.log("Connect successfully." + userId);
            },
            onTokenIncorrect: function () {
                console.log('token无效');
            },
            onError: function (errorCode) {
                let info = '';
                switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                        info = '超时';
                        break;
                    case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
                        info = '不可接受的协议版本';
                        break;
                    case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                        info = 'appkey不正确';
                        break;
                    case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                        info = '服务器不可用';
                        break;
                }
                console.log(errorCode);
            }
        });


    },
    reconnect() {
        // 融云 断开，自动 重连
        var callback = {
            onSuccess: function (userId) {
                console.log("Reconnect successfully." + userId);
            },
            onTokenIncorrect: function () {
                console.log('token无效');
            },
            onError: function (errorCode) {
                console.log(errorcode);
            }
        };
        var config = {
            // 默认 false, true 启用自动重连，启用则为必选参数
            auto: true,
            // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
            url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
            // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
            rate: [100, 1000, 3000, 6000, 10000]
        };
        RongIMClient.reconnect(callback, config);
    }
}