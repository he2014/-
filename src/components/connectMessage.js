import { RongIms } from './RongIM'

export const connectMessage = {
    init(obj) {//初始化
        RongIms.init(obj)
    },
    connect(token) {//传入token
        RongIms.connect(token);
    },
    message(callback) {//消息回调
        if (callback) {
            RongIms.message(callback);
        }
    }

}