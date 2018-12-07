<template>
  <div class="message-con" v-scroll ref="message">
    <audio :src="audioUrl" ref="playAudio" style="display:none;">Your browser does not support audio tags.</audio>
    <ul>
      <li v-for="item in messgeData.messages" :key="item.id">
        <p class="time"> <span>{{toUTCTime(new Date(item.st))}}</span> </p>
        <div class="main-con" :class="{ self: item.self }">
          <div v-if="item.messageType == 'text'" data-commont="文字">
            <div v-if="item.sendFail" data-commont="发送失败">
              <img @click="resendContent(item)" class="resend-icon-img" src="@/assets/images/resendIcon.png" alt="resendIcon" title="重新发送">
              <img @click="showInfoData" data-avatar="100" data-commont="头像" class="avatar" width="30" height="30"  :class="item.self?'message-user':'message-to-user'" :src="(item.self?currentRobotHeaderPic:currentUserHeaderPic)" />

              <div class="text-con" v-html="emoji(item.message, item.messageType)" data-commont="在main.js中引入全局"></div>
            </div>
            <div v-else data-commont="发送成功">
              <img  @click="showInfoData" data-avatar="100" data-commont="头像" class="avatar" width="30" height="30" :class="item.self?'message-user':'message-to-user'" :src="(item.self?currentRobotHeaderPic:currentUserHeaderPic)" />
              <div class="text-con" v-html="emoji(item.message, item.messageType)" data-commont="在main.js中引入全局"></div>
            </div>
          </div>
          <div v-else-if="item.messageType == 'gif'" data-commont="图片">
            <img @click="showInfoData" data-avatar="100" data-commont="头像" class="avatar" width="30" height="30"  :class="item.self?'message-user':'message-to-user'" :src="(item.self?currentRobotHeaderPic:currentUserHeaderPic)" />
            <div v-html="emoji(exchangeGifNameToNumber(item.message), item.messageType)"></div>
          </div>
          <div v-else-if="item.messageType == 'img'" data-commont="图片">
            <img @click="showInfoData" data-avatar="100" data-commont="头像" class="avatar" width="30" height="30"  :class="item.self?'message-user':'message-to-user'" :src="(item.self?currentRobotHeaderPic:currentUserHeaderPic)" />
            <div ><img :src="item.message" width="auto" height="30" @click.stop="lookBIGimg(item)" /></div>
          </div>
          <div v-else-if="item.messageType == 'media'" data-commont="语音">
            <img @click="showInfoData" data-avatar="100" data-commont="头像" class="avatar" width="30" height="30" :class="item.self?'message-user':'message-to-user'" :src="(item.self?currentRobotHeaderPic:currentUserHeaderPic)" />
            <div @click="playAudio(item)" class="audio-box-white" v-bind:style="{ width: parseInt(item.duration)/60*200+30+'px',background: '#fff',display:'inline-block'}">
              <div class="audio-animation">
                <div class="box">
                  <div class="wifi-symbol">
                    <div class="wifi-circle first" data-commont="第一个点"></div>
                    <div class="wifi-circle" :class="item.isAnimationShow?'secondAnim':'second'" data-commont="第二个曲线"></div>
                    <div class="wifi-circle" :class="item.isAnimationShow?'thirdAnim':'third'" data-commont="第二个曲线"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-message-info" data-commont="是否已读的红点标识、语音时间">
              &nbsp;&nbsp;{{item.duration}}&nbsp;
              <i v-if="item.isRead || item.self"></i>
              <i v-else class="unread-flag"></i>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!-- 查看图片 -->
    <el-dialog
          title=""
          :visible.sync="dialogVisible"
          width="50%">
          <div v-if="dialogVisible">
              <el-carousel :autoplay="false" indicator-position="none" :initial-index="curentImageIndex" height="200px">
                <el-carousel-item v-for="item in carousel" :key="item.st">
                  <img :src="item.url" alt="图片墙">
                </el-carousel-item>
              </el-carousel>
          </div>
    </el-dialog>
  </div>
</template>
<script>
import userImg from "@/assets/images/test.jpg";
import { setTimeout, setInterval } from "timers";
export default {
  name: "message",
  props: {
    messgeData: {
      type: Object
    },
    currentFromUserId: {
      type: Number
    },
    currentToUserId: {
      type: Number
    },
    currentRobotHeaderPic: {
      type: String
    },
    currentUserHeaderPic: {
      type: String
    },
    currentRobotSex: {
      type: Number
    },
    imageList: {
      type: Object
    }
  },
  mounted () {
    console.log('this.messgeData:',this.messgeData)
  },
  updated () {
    console.log('this.messgeData:',this.messgeData)
  },
  data() {
    return {
      bool: true,
      user: {
        img: userImg
      },
      slideShow: false,
      audioUrl: null,
      curentImageIndex: 0,
      carousel: [],
      dialogVisible: false
      // isAnimationShow: false,
    };
  },
  methods: {
    lookBIGimg(data) {
      this.carousel = [];
      let Carousel = this.imageList[
        this.currentToUserId + "_" + this.currentFromUserId
      ];
      Carousel.forEach(item => this.carousel.push(item));
      this.curentImageIndex = data.currentImageIndex;
      this.dialogVisible = true;
    },
    // 点击播放 语音
    playAudio(item) {
      let that = this;
      //playAudio
      this.audioUrl = item.message;

      console.log(item);
      this.$set(item, "isRead", true);
      RongIMLib.RongIMVoice.play(item.message);
      // 语音时间
      that.$set(item, "isAnimationShow", true);
      let duration = parseInt(item.duration);
      setTimeout(() => {
        that.$set(item, "isAnimationShow", false);
      }, duration * 1000);
    },
    // 点击头像 展示资料卡
    showInfoData() {
      // console.log(item)
      console.log(item);
      this.$set(item, "isRead", true);
      // this.$refs.playAudio.play();
      RongIMLib.RongIMVoice.play(item.message);
      // 语音时间
      that.$set(item, "isAnimationShow", true);
      let duration = parseInt(item.duration);
      setTimeout(() => {
        that.$set(item, "isAnimationShow", false);
        // item.isAnimationShow = false
      }, duration * 1000);
    },

    getDuration(strJson) {
      let duration = strJson.duration;
      return duration;
    },
    // 将GIF动图名字（:soogif12:） 转成 数字(12)
    exchangeGifNameToNumber(str) {
      str = str.replace(":soogif", "");
      str = parseInt(str);
      return str;
    },
    // 发送失败，重新发送
    resendContent(item) {
      // item.message =
      console.log(item);
      let params = {
        // 用户id
        userId: this.currentToUserId,
        // 机器人id
        toUserId: this.currentFromUserId,
        msg: encodeURI(this.exchangeEmojiStrToAppEmojiStr(item.message)),
        //  对话框颜色 1男 2 女
        extern: "{sex: " + this.currentRobotSex + "}",
        messageType: item.messageType
      };
      this.$get("/chatting/sendMsg", params)
        .then(res => {
          console.log(res);
          if (res.code == 0) {
            item.sendFail = false;
          } else if (res.code == 12000009) {
            alert("Speak too fast");
          } else if (res.code == 12000001) {
            alert("Unknown error in message system");
          } else if (res.code == 12000002) {
            alert("Not a friend");
          }
        })
        .catch(res => {
          console.log("error");
          // 标志发送失败
          // data['sendFail'] = true
          // that.$emit("sendMessage",data)
        });
    },
    PrefixInteger(num) {
      num = Number(num);
      return (Array(2).join("0") + num).slice(-2);
    },
    showSlide() {
      //点击图片出现大图
      this.slideShow = true;
    },
    slideClose(val) {
      //关闭图片
      this.slideShow = val;
    }
  },
  filters: {
    // 将日期过滤为 hour:minutes
    time(date) {
      if (typeof date === "string") {
        date = new Date(date);
      }
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
      );
    }
  },
  updated: function() {
    //滚动到最底部
    this.$nextTick(function() {
      const el = this.$refs["message"];
      el.scrollTop = el.scrollHeight - el.clientHeight;
    });
  },
  directives: {
    scroll: {
      bind: function(el) {
        el.scrollTop = el.scrollHeight - el.clientHeight;
      }
    }
  }
};
</script>
<style lang="less"  scoped>
.message-con {
  width: 100%;
  height: 440px;
  padding: 10px 15px;
  overflow-y: scroll;
  background-color: #eee;
  box-sizing: border-box;
  overflow-x: hidden;
  li {
    width: 100%;
    margin-bottom: 15px;
  }
  .time {
    margin: 7px 0;
    text-align: center;
    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      border-radius: 2px;
      background-color: #dcdcdc;
    }
  }
  .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
  }
  .text-con {
    display: inline-block;
    position: relative;
    padding: 0 10px;
    max-width: ~"calc(100% - 40px)";
    min-height: 30px;
    line-height: 2.5;
    font-size: 12px;
    text-align: left;
    word-break: break-all;
    background-color: #fafafa;
    border-radius: 4px;
    &:before {
      content: " ";
      position: absolute;
      top: 9px;
      right: 100%;
      border: 6px solid transparent;
      border-right-color: #fafafa;
    }
  }
  .self {
    text-align: right;
    .avatar {
      float: right;
      margin: 0 0 0 10px;
    }
    .text-con {
      background-color: #b2e281;
      &:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #b2e281;
      }
    }
  }
}
.message-li-img img {
  width: 200px;
  cursor: pointer;
}
.resend-icon-img {
  cursor: pointer;
}
.message-con {
  min-height: 1px;
}
.seeHistoryRecord {
  color: blue;
  width: 100%;
  text-align: center;
  cursor: pointer;
}
.audio-img-icon {
  width: 20px;
}
.audio-box-white {
  cursor: pointer;
  width: 44;
  background: rgb(255, 255, 255);
  display: inline-block;
  height: 32px;
  overflow: hidden;
  border-radius: 6px;
}
.audio-animation {
  display: inline-block;
  margin-top: -59px;
  margin-left: 14px;
}
/*animation*/
.box {
  width: 120px;
  height: 120px;
  box-sizing: border-box;
  position: relative;
  margin: 50px auto;
}
.wifi-symbol {
  width: 50px;
  height: 50px;
  box-sizing: border-box;
  overflow: hidden;
  transform: rotate(135deg);
}
.wifi-circle {
  border: 3px solid #999999;
  border-radius: 50%;
  position: absolute;
}

.first {
  width: 5px;
  height: 5px;
  background: #cccccc;
  top: 45px;
  left: 45px;
}
.second {
  // width: 25px;
  // height: 25px;
  // top: 35px;
  // left: 35px;
  width: 25px;
  height: 25px;
  top: 38px;
  left: 38px;
}
.secondAnim {
  // width: 25px;
  // height: 25px;
  // top: 35px;
  // left: 35px;
  width: 25px;
  height: 25px;
  top: 38px;
  left: 38px;
  animation: fadeInOut 1s infinite 0.2s;
}

.third {
  // width: 40px;
  // height: 40px;
  // top: 25px;
  // left: 25px;
  width: 36px;
  height: 35px;
  top: 31px;
  left: 31px;
}
.thirdAnim {
  // width: 40px;
  // height: 40px;
  // top: 25px;
  // left: 25px;
  width: 36px;
  height: 35px;
  top: 31px;
  left: 31px;
  animation: fadeInOut 1s infinite 0.4s;
}
@keyframes fadeInOut {
  0% {
    opacity: 0; /*初始状态 透明度为0*/
  }
  100% {
    opacity: 1; /*结尾状态 透明度为1*/
  }
}
.unread-flag {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
}
.item-message-info {
  display: inline-table;
  position: relative;
  top: -10px;
}
</style>