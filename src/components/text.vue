<template>
<div>
  <div class="VueCropperIMG" v-show="VueCropperIMG">
    <div class="cropperBnt">
       <a href="javascript:" @click.stop="cancelcropperImage">cancel</a>
       <a href="javascript:" @click.stop="cropperImage">OK</a>
    </div>
    <VueCropper v-if="VueCropperIMG"
      ref="cropper"
      :img="VueCropperIMG"
      :outputSize="0.1"
      outputType="jpeg"
      :autoCrop="true"
      :autoCropWidth="200"
      :autoCropHeight="200"
      :info="false"
      :canMove="false"
      :centerBox="true"
    />
  </div>
<div class="textCon">
   <div class="handle">
     <input style="display:none" type="file" id="file-Id" ref="uploadFile" value="upload-file" />
     <i class="icon iconfont icon-face" @click="showEmoji = !showEmoji" title="表情"></i>
     <span class="rt checkHistoryRecord" @click="checkHistoryRecord">view historical records</span>
    <el-upload
      accept="image/png,image/jpeg,image/jpg"
      class="avatar-uploader icon-pic"
      :action="uploadImgAction"
      :data="needOtherParams"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :on-error="uploadError"
      :before-upload="beforeAvatarUpload">
      <i class=""></i>
    </el-upload>
    &nbsp;
    <div class="upload-audio-box">
      <label class="upload-audio-label" for="upload-audio" style="display: inline-block;">
        <div class="audio-animation" style="display: inline-block;">
          <div class="box" style="display: inline-block;">
            <div class="wifi-symbol" style="display: inline-block;">
              <div class="wifi-circle first" data-commont="第一个点" style="display: inline-block;"></div>
              <div class="wifi-circle second" data-commont="第二个曲线" style="display: inline-block;"></div>
              <div class="wifi-circle third" data-commont="第二个曲线" style="display: inline-block;"></div>
            </div>
          </div>
        </div>
      </label>
      <input accept="audio/amr" type="file" id="upload-audio" style="display:none;" @change="uploadAudio($event)"/>
    </div>
    <div class="sendAddress" style="display:none;">
      <span class="el-icon-location-outline"></span>
    </div>
   </div>
    <textarea maxlength="250" v-model="content" @keyup="onKeyup" autofocus="autofocus" ref="textarea" :dataindex="currentId" ></textarea>
    <div class="box-ft">
      <!-- <span  class="desc">按下Cmd + Enter换行</span> -->
      <el-button  class="btn_send" @click="sendText">send</el-button>
    </div>
   
    <!-- 表情框 -->
    <transition name="fade" mode="">
      <div class="emoji-box" v-if="showEmoji">
        <el-button 
          class="pop-close" 
          :plain="true" 
          type="danger" 
          size="mini" 
          icon="el-icon-close"
          @click="showEmoji = false"></el-button>
          <vue-emoji
            @select="selectEmoji" 
            @selectGif="selectGif"
            @continueEmit="continueEmit"
            :currentToUserId="currentToUserId"
            :currentFromUserId="currentFromUserId"
            :currentRobotSex="currentRobotSex"
            >
          </vue-emoji>
        <span class="pop-arrow arrow"></span>
      </div>       
    </transition>
</div>
</div>
</template>
<script>
import { actions } from "../store";
// 表情
import vueEmoji from "../components/emoji/emoji";
import { VueCropper } from "vue-cropper";
// Vue.prototype.emoji = emoji;
export default {
  vuex: {
    actions: actions
  },
  props: {
    currentFromUserId: {
      type: Number
    },
    currentToUserId: {
      type: Number
    },
    currentRobotSex: {
      type: Number
    },
    currentId: {
      type: Number
    }
  },
  data() {
    return {
      // currentToUserIdDoc: this.currentToUserId,
      // currentFromUserIdDoc: this.currentFromUserId,
      uploadImgAction: this.$baseUrl1 + "/chatting/upload",
      content: "",
      VueCropperIMG: null,
      VueCropperIMGBase64: null,
      showEmoji: false,
      fileList: [],
      // 其他需要上传图片的参数
      needOtherParams: {
        token: sessionStorage.getItem("token")
      },

      gifArr: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21
      ]
    };
  },
  methods: {
    // upload audio
    uploadAudio(event) {
      let that = this;
      let form_user_id = this.currentFromUserId;
      let to_user_id = this.currentToUserId;
      let current_sex = this.currentRobotSex;
      let thisDom = event.currentTarget;
      console.log("upload audio");
      let file = thisDom.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let base64Str = "";
      reader.onload = function() {
        base64Str = reader.result;

        var messageName = "VoiceMessage"; // 消息名称。
        var objectName = "s:audio"; // 消息内置名称，请按照此格式命名。
        var mesasgeTag = new RongIMLib.MessageTag(true, true); // 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
        let prototypes = [
          "fromUserId",
          "toUserId",
          "sex",
          "messageType",
          "message"
        ]; // 消息类中的属性名。
        RongIMClient.registerMessageType(
          messageName,
          objectName,
          mesasgeTag,
          prototypes
        );

        // 2. send message
        var conversationType = RongIMLib.ConversationType.PRIVATE; //单聊,其他会话选择相应的消息类型即可。
        var targetId = to_user_id; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
        var msg = new RongIMClient.RegisterMessage.VoiceMessage({
          fromUserId: form_user_id,
          toUserId: to_user_id,
          sex: current_sex,
          messageType: "media",
          message: base64Str
        });
        RongIMClient.getInstance().sendMessage(
          conversationType,
          targetId,
          msg,
          {
            onSuccess: function(message) {
              console.log(message);
              let params = {
                userId: form_user_id,
                toUserId: to_user_id
              };
              // push the audio message to history record
              that.$get("/chatting/saveHistoryMsg", params).then(res => {
                // push this audio message on the page
                let data = {
                  duration: 5,
                  fromUserId: form_user_id,
                  toUserId: to_user_id,
                  sex: current_sex,
                  messageType: "media",
                  extra: "{'sex':" + current_sex + "}",
                  message: base64Str
                };
                that.$emit(
                  "sendMessage",
                  Object.assign(data, { index: that.currentId })
                );
              });
            },
            onError: function(errorCode) {}
          }
        );
      };
    },
    // 继续提交GIF图片，展示在页面
    continueEmit(value) {},
    // 查看历史纪录
    checkHistoryRecord() {
      let that = this;
      let params = {
        userId: this.currentToUserId,
        toUserId: this.currentFromUserId,
        no: 1,
        size: 20
      };
      this.$get("chatting/selectChattingHistory", params).then(res => {
        // console.log(res)
        that.$emit("showHistoryData", res);
      });
    },
    uploadError(err, file, fileList) {
      alert("Please check your network! Upload failure");
    },
    onKeyup() {
      this.showEmoji = false;
    },
    sendText() {
      // debugger
      let that = this;
      //发送文本
      if (this.content !== "") {
        let message_type = "text";
        const data = {
          messageType: "text",
          message: this.content
        };
        let msgContent = this.exchangeEmojiStrToAppEmojiStr(this.content);
        if (typeof msgContent == "string") {
          message_type = "text";
          msgContent = encodeURI(
            this.exchangeEmojiStrToAppEmojiStr(this.content)
          );
        } else if (
          this.gifArr.indexOf(Number(msgContent)) > 0 ||
          this.gifArr.indexOf(Number(msgContent)) == 0
        ) {
          message_type = "gif";
          msgContent = this.exchangeEmojiStrToAppEmojiStr(this.content);
        }
        let params = {
          userId: this.currentToUserId,
          toUserId: this.currentFromUserId,
          // 格式是带有[],转义
          msg: msgContent,
          // 对话框颜色 1男 2 女
          extern: "{sex: " + this.currentRobotSex + "}",
          // 文字和上传图片是text 动图是gif
          messageType: message_type
        };
        this.$get("/chatting/sendMsg", params)
          .then(res => {
            // console.log(res);
            if (res.code == 0) {
              that.$emit(
                "sendMessage",
                Object.assign(data, { index: that.currentId })
              );
            } else if (res.code == 12000009) {
              that.$message("Speak too fast");
              console.log("Speak too fast");
            } else if (res.code == 12000001) {
              that.$message("Unknown error in message system");
              console.log("Unknown error in message system");
            } else if (res.code == 12000002) {
              that.$message("Not a friend");
              console.log("Not a friend");
            }
          })
          .catch(res => {
            // 标志发送失败
            data["sendFail"] = true;
            that.$emit("sendMessage");
          });

        this.content = "";
      }
    },
    selectEmoji(code) {
      //选择表情
      this.showEmoji = false;
      this.content += code;
    },
    selectGif(obj) {
      const data = {
        messageType: "gif",
        message: obj.name
      };
      //选择表情
      this.showEmoji = false;
      this.$emit("sendMessage", data);
      // 将选中的图片，对应的text放在输入框中
      // this.content += code
    },
    cancelcropperImage() {
      this.VueCropperIMG = null;
      this.VueCropperIMGBase64 = null;
    },
    cropperImage() {
      this.$refs.cropper.startCrop();
      this.$refs.cropper.getCropData(data => {
        // console.log(data);
        this.VueCropperIMGBase64 = data;
        this.sendImage();
      });
    },
    sendImage() {
      let that = this;
      let data = {
        messageType: "img",
        message: this.VueCropperIMGBase64,
        url: this.VueCropperIMG,
        toUserId: that.currentToUserId,
        fromUserId: that.currentFromUserId,
        index: that.currentId
      };
      let params = {
        userId: this.currentToUserId,
        toUserId: this.currentFromUserId,
        // 格式是带有[],转义
        msg: this.VueCropperIMG,
        // 对话框颜色 1男 2 女
        extern: "{sex: " + this.currentRobotSex + "}",
        // 文字和上传图片是text 动图是gif
        messageType: "img"
      };
      this.$get("/chatting/sendMsg", params)
        .then(res => {
          // console.log(res);
          if (res.code == 0) {
            let base64Str = this.VueCropperIMGBase64;
            let imageUri = this.VueCropperIMG; // 上传到自己服务器的 URL。
            let msg = new RongIMLib.ImageMessage({
              content: base64Str,
              imageUri: imageUri
            });
            let conversationtype = RongIMLib.ConversationType.PRIVATE; // 单聊,其他会话选择相应的消息类型即可。
            let targetId = this.currentFromUserId; // 目标用户 Id
            RongIMClient.getInstance().sendMessage(
              conversationtype,
              targetId,
              msg,
              {
                onSuccess: function(message) {
                  console.log(message);
                  that.$emit("sendMessage", data);
                  // that.VueCropperIMGIndex++;
                  that.VueCropperIMG = null;
                  that.VueCropperIMGBase64 = null;
                  //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                  console.log("Send successfully");
                },
                onError: function(errorCode, message) {
                  var info = "";
                  switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                      info = "超时";
                      break;
                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                      info = "未知错误";
                      break;
                    case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                      info = "在黑名单中，无法向对方发送消息";
                      break;
                    case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                      info = "不在讨论组中";
                      break;
                    case RongIMLib.ErrorCode.NOT_IN_GROUP:
                      info = "不在群组中";
                      break;
                    case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                      info = "不在聊天室中";
                      break;
                    default:
                      info = "";
                      that.$message("Message delivery failed");
                      break;
                  }
                  console.log("发送失败:" + info);
                }
              }
            );
          } else if (res.code == 12000009) {
            that.$message("Speak too fast");
            console.log("Speak too fast");
          } else if (res.code == 12000001) {
            that.$message("Unknown error in message system");
            console.log("Unknown error in message system");
          } else if (res.code == 12000002) {
            that.$message("Not a friend");
            console.log("Not a friend");
          }
        })
        .catch(res => {
          // 标志发送失败
          data["sendFail"] = true;
          that.$emit("sendMessage");
        });
    },
    handleAvatarSuccess(res, file) {
      let that = this;
      if (res.code == 0) {
        // console.log(res);
        //发送图片成功
        this.VueCropperIMG = this.$baseUrlUpload + res.dataInfo;
      }
    },
    beforeAvatarUpload(file) {
      //发送图片以前
      const isJPG = file.type === "image/jpeg" || "image/jpg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 0.5;

      if (!isJPG) {
        this.$message.error("upload pictures can only be JPG or PNG format!");
      }
      if (!isLt2M) {
        this.$message.error("upload image size can not exceed 0.5MB!");
      }
      return isJPG && isLt2M;
    }
  },

  components: {
    vueEmoji,
    VueCropper
  },
  updated() {
    this.$refs.textarea.focus();
  },
  computed: {
    currentToUserIdDoc: function() {
      console.log(this.currentToUserId);
      return this.currentToUserId;
    },
    currentFromUserIdDoc: function() {
      console.log(this.currentFromUserId);
      return this.currentFromUserId;
    }
  }
};
</script>
<style lang="less">
.VueCropperIMG {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  .cropperBnt {
    position: absolute;
    left: 0;
    top: 0;
    height: 50px;
    width: 100%;
    z-index: 1001;
    background: #ddd;
    display: flex;
    justify-content: space-around;
    align-items: center;
    a {
      padding: 5px 10px;
      background: #4da2fd;
      color: #fff;
      border-radius: 5px;
    }
  }
}
.textCon {
  height: 160px;
  border-top: solid 1px #ddd;
  position: relative;
  background: #fff;
  padding: 10px 20px;
  .handle {
    width: 100%;
    height: 20px;
    background: #fff;
  }
  textarea {
    width: 100%;
    height: 80px;
    border: none;
    outline: none;
    font-family: "Micrsofot Yahei";
    resize: none;
    color: #323232;
  }
  .icon-face {
    cursor: pointer;
    color: #aaa;
    float: left;
  }
  .icon-pic {
    float: left;
    cursor: pointer;
    width: 18px;
    height: 18px;
    margin-left: 10px;
    background: url(../assets/images/img-icon.png) no-repeat;
    background-size: 100% 100%;
    .el-upload {
      width: 100%;
      height: 100%;
    }
  }
  .box-ft {
    width: 100%;
    height: 30px;
    text-align: right;
    .desc {
      color: #888;
      font-size: 12px;
      margin-left: 10px;
      margin-right: 7px;
    }
    .btn_send {
      background-color: #fff;
      color: #222;
      width: 90px;
      height: 30px;
      line-height: 30px;
      padding: 0;
    }
  }
  .emoji-box {
    position: absolute;
    z-index: 10;
    left: 10px;
    top: -190px;
    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
    background: white;
    .el-button {
      position: absolute;
      border: none;
      color: #ff4949;
      background: #fff;
      right: 6px;
      top: 8px;
      z-index: 10;
      .el-icon-close {
        font-size: 16px;
      }
    }
    .arrow {
      left: 10px;
    }
  }
}
.button-description {
  text-align: right;
}
.button-description {
  background: #fff;
  width: 100%;
}
.lt {
  float: left;
}
.tools-box {
  width: 100%;
  overflow: hidden;
  background: #fff;
}
.rt {
  float: right;
  color: blue;
}
.checkHistoryRecord {
  cursor: pointer;
}
.upload-audio-box,
.sendAddress {
  float: left;
  cursor: pointer;
}
.upload-audio-box {
  overflow: hidden;
  width: 20px;
  height: 20px;
}
.el-icon-location-outline {
  font-size: 23px;
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
  border: 2px solid #999999;
  border-radius: 50%;
  position: absolute;
}

.first {
  width: 4px;
  height: 4px;
  background: #cccccc;
  top: 45px;
  left: 45px;
}
.second {
  width: 25px;
  height: 25px;
  top: 39px;
  left: 39px;
}

.third {
  width: 31px;
  height: 31px;
  top: 35px;
  left: 35px;
}
/*animation end*/
.upload-audio-label {
  margin-top: -66px;
  margin-left: 15px;
}
.sendAddress {
  margin-left: 8px;
}
.avatar-uploader {
  margin-right: 5px;
}
</style>