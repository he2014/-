<template>
  <div class="outer-box">
     <div 
        data-commont="右键点击出现的弹窗"
        @click="deleteFriends"
        v-if="isShowDeleteFriends" 
        v-bind:style="{top: deletePopTop + 'px',left: deletePopLeft + 'px' }"
        class="rightMouseButton">
        Deleting friends
      </div>
      <div class="pop-chrome-box" data-commont="google-map" style="display:none;">
        <GmapMap
          :center="center"
          :zoom="7"
          ref="mapRef"
          map-type-id="terrain"
          style="width: 100%; height: 100%"
          @click="mapClick"
        >
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            @click="center=m.position"
          />
        </GmapMap>
        <!-- <GmapInfoWindow :position="center"></GmapInfoWindow> -->

      </div>
      <div class="parents-box-all">
        <div id="chatIndex">
          <audio id="chatAudios"  src="/static/cnwav.aac" style="display:none">您的浏览器不支持 audio 标签。</audio>
          <div class="sidebar">
            <div class="card">
              <header data-commont="当前登录的 人工陪聊账号信息：头像、昵称">
                <span>account:{{userAccount}}</span>
                <span class="logout-button" @click="exitAccount">exit</span>
                <div v-show="sessionsCountMsg>0" style="margin-top:5px">
                  <a style="color: blue;margin-top:20px">You have <span style="color:red">{{sessionsCountMsg}}</span> messages</a></div>
              </header>
            </div>
            <div ref="userList">
              <List @showRightClick="showRightClickDiv" @clickHeaderPics="clickHeaderPic" :listData="state.sessions" @getShieldIndex="getShieldIndex" :currentId="state.currentSessionId" @showData="getSession"></List>
            </div>
          </div>
          <div v-if="session.messages" id="main">
            <Personal @reTurnisPersonShow="clickHeaderPic" :currentToUserId="Number(currentToUserId)" :currentFromUserId="Number(currentFromUserId)" :isPersonShow="isPersonShow">
            </Personal>
            <Message class="message-box" :imageList="state.imageAll"  @clickHeaderPic="clickHeaderPic" :messgeData="session" :currentFromUserId="Number(currentFromUserId)" :currentToUserId="Number(currentToUserId)" :currentRobotHeaderPic="currentRobotHeaderPic" :currentUserHeaderPic="currentUserHeaderPic" :currentRobotSex="currentRobotSex">
            </Message>
            <TextCon  :currentId="state.currentSessionId" @sendMessage="getText" @showHistoryData="showHistoryDataFn" :currentFromUserId="Number(currentFromUserId)" :currentToUserId="Number(currentToUserId)" :currentRobotSex="currentRobotSex">
            </TextCon>
          </div>
          <div v-else class="no-message">No chat selected</div>
          <!-- <List :listData="state.sessions"   :currentId="state.currentSessionId"  @showData="getSession"></List> -->
        </div>
        <div v-show="isShowHistory" class="history-box">
          <div class="history-box-title">
            Historical records
            <i class="el-icon-close rt" @click="isShowHistory = false"></i>
          </div>
          <div class="history-list-box">
            <ul>
              <li class="history-li" v-for="(item, index) in historyList" :key="index">
                <div v-if="item.user_Id == currentToUserId" data-commont="用户" class="message-user">
                  <!-- {{item.user_Id}}  -->
                  {{currentUserNickname}}
                  {{toUTCTime(item.send_msg_time)}}
                </div>
                <div v-else data-commont="机器人" class="message-to-user">
                  <!-- {{item.user_Id}}  -->
                  {{currentRobotNickname}}
                  {{toUTCTime(item.send_msg_time)}}
                </div>
                <div v-if="item.message_type == 'text' || item.message_type == 'gif'" v-html="emoji(item.send_msg, item.message_type)">
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div v-else-if="item.message_type == 'img'">
                  <img :src="item.send_msg" alt="img" style="width: 50px;">
                </div>
                <div class="history-audio" v-else data-commont="todo，待处理，将base64 转成音频">
                  历史记录中，语音不同步...
                </div>
              </li>
            </ul>
          </div>
          <el-pagination v-if="historyItemTotal" :page-size="20" :pager-count="5" layout="prev, pager, next" @current-change="handleCurrentChange" :total="historyItemTotal">
          </el-pagination>
        </div>
      </div>
  </div>
 

</template>
<script>
import List from "@/components/list"; //左侧列表
import Personal from "@/components/personalData"; //个人资料
import TextCon from "@/components/text"; //发送聊天内容区域
import Message from "@/components/message"; //展示消息区域
import img1 from "@/assets/images/1.jpg";
import { connectMessage } from "./connectMessage";
import { setInterval } from "timers";

import * as VueGoogleMaps from "vue2-google-maps";
import Vue from "vue";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCYLzwV57HHnSfcH7Ydv3olIrZJe7AH4mo",
    libraries: "places",
    v: "3.26"
    // libraries: 'places', //// If you need to use place input
  }
});
export default {
  data() {
    const now = new Date();
    return {
      // google map
      center: { lat: 10.0, lng: 10.0 },
      markers: [
        { position: { lat: 10.0, lng: 10.0 } },
        { position: { lat: 11.0, lng: 11.0 } }
      ],
      userAccount: "",
      isShowDeleteFriends: false,
      deletePopTop: 0,
      deletePopLeft: 0,
      deleteFriendsMessage: null,
      userAccount: "",
      // 当前机器人 性别
      currentRobotSex: -1,
      // 当前聊天 用户 昵称
      currentUserNickname: "",
      // 当前聊天 机器人 昵称
      currentRobotNickname: "",
      // 当前聊天 机器人 头像
      currentRobotHeaderPic: "",                                                
      // 当前聊天 用户 头像
      currentUserHeaderPic: "",
      // 用户id
      currentToUserId: -1,
      // 机器人id
      currentFromUserId: -1,
      currentPage: 1,
      session: {},
      historyItemTotal: 10,
      sessionsListMessage:null,
      historyList: [
        // {user_Id:102833, to_user_Id: 794, send_msg: "你好", message_type: "text",send_msg_time: 1540022870475},
      ],
      time_r: null,
      state: {
        //照片墙
        imageAll: {},
        imageIndex: 0,
        // 当前用户
        user: {
          name: "coffce",
          img: "dist/images/6.jpeg",
          user_account: "111"
        },
        url: "http://mp3.9ku.com/hot/2009/08-27/186947.mp3",
        // 会话列表
        sessions: [],
        // 当前选中的会话
        currentSessionId: null,
        // 过滤出只包含这个key的会话,
        audioKey: null,
        //
        filterKey: "",
        //会话窗口隐藏状态
        pageChangeStaute: null
      },
      isShowHistory: false,
      // 是否显示资料卡
      isPersonShow: false,
      // 统计未预览会话
      sessionsCountMsg: 0
    };
  },
  created() {
    // 初始化融云sdk
    connectMessage.init(this);
    // 获取当前登录用户的聊天列表
    // 左侧 用户-机器人 会话列表；
    this.$get("chatting/getChattingList", {
      userId: JSON.parse(sessionStorage.getItem("u_msg")).appUserId
    }).then(res => {
      let msg = res.dataInfo;
      msg.forEach(ele => {
        if (ele.userProfileInfo && ele.userProfileInfo.user) {
          this.state.sessions.push({
            message: {
              fromUserId: ele.chattingClientUserId,
              toUserId: ele.chattingServiceUserId
            },
            messages: [],
            user: ele.userProfileInfo.user,
            shield: false,
            messageCount: 0,
            ismessageCount: true //是否展示消息数据统计;
          });
        }
      });
    });
  },
  mounted() {
    // google map
    
    this.$refs.mapRef.$mapPromise.then(map => {
      map.panTo({ lat: 1.38, lng: 103.8 });
    });

    this.userAccount = localStorage.getItem("userAccount");
    //监听融云消息，connectMessage
    connectMessage.message(this.messages); //
    //初始化机器人，连接融云
    connectMessage.connect(localStorage.getItem("r_token"));

    //当前登陆用户保活，
    this.Keepusersactive();
    this.pageChange();
    // this.uploadImage();
    let _this = this;
    document.addEventListener("click", function(e) {
      //  if (!!_this.$refs.userList.contains(e.target)) return;
      _this.isShowDeleteFriends = false;
    });
  },
  methods: {
    mapClick(val, value) {
      console.log(val);

    },
    uploadImage() {
      if(this.sessionsListMessage){
        this.sessionsListMessage.forEach((item, index)=>{
          if(item.key===this.state.currentFromUserId+"_"+this.state.currentToUserId){
            this.censore =  item;
            return;
          }
        })
      }
      // 最大限制是
    },
    showDeletePopBox() {
      this.isShowDeleteFriends = true;
    },
    hideDeletePopBox() {
      this.isShowDeleteFriends = false;
    },
    // 删除好友
    deleteFriends() {
      if (this.deleteFriendsMessage) {
        let value = this.deleteFriendsMessage;
        this.$get("chatting/deleteFriend", {
          userId: value["item"]["message"]["toUserId"],
          toUserId: value["item"]["message"]["fromUserId"]
        }).then(res => {
          if (res.code === 0) {
            this.state.sessions.splice(value.index, 1);
            this.session = {};
          }
        });
      }
      // let params = {
      //   fromUserId: this.fromUserId,
      //   toUserId: this.toUserId
      // };
      // 调用 删除好友接口
    },
    showRightClickDiv(value) {
      this.deletePopTop = value.top;
      this.deletePopLeft = value.left;
      this.isShowDeleteFriends = true;
      this.deleteFriendsMessage = value;
    },
    // 点击播放 语音  - 不用处理，因为历史记录不必展示语音
    // playAudio(item) {
    //      debugger
    //     let that = this;
    //     //playAudio
    //     this.audioUrl = item.message;

    //     console.log(item);
    //     this.$set(item, "isRead", true);
    //     RongIMLib.RongIMVoice.play(item.message);
    //     // 语音时间
    //     that.$set(item, "isAnimationShow", true);
    //     let duration
    //     if (item.duration) {
    //       duration = parseInt(item.duration);
    //     } else {
    //       duration = 5;
    //     }
    //     setTimeout(() => {
    //       that.$set(item, "isAnimationShow", false);
    //     }, duration * 1000);
    // },
    // 账号退出
    exitAccount() {
      let params = {
        userId: localStorage.getItem("userId")
      };
      this.$get("chatting/quitChatting", params).then(res => {
        console.log(res);
        this.$router.push("/");
        window.location.reload(); // Variables are cached and forced to refresh again.
        sessionStorage.clear();
        localStorage.clear();
      });
    },
    // 点击头像触发的整体页面变化
    clickHeaderPic(bool) {
      this.isPersonShow = bool;
    },
    pageChange() {
      let _this = this;
      if (document.addEventListener) {
        document.addEventListener(
          "webkitvisibilitychange",
          () => {
            // 控制资料卡，隐藏、显示
            if (document.webkitVisibilityState === "visible") {
              _this.state.pageChangeStaute = false;
            } else if (document.webkitVisibilityState === "hidden") {
              _this.state.pageChangeStaute = true;
            }
          },
          false
        );
      }
    },
    messageNotice(data) {
      let _this = this;
      Notification.requestPermission(function(status) {
        // 这将使我们能在 Chrome/Safari 中使用 Notification.permission
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
      });
      //消息推送
      console.log(data);
      var n = new Notification("你有新消息", {
        body: data.message.message,
        tag: "avenstar", //代表通知的一个识别标签，相同tag时只会打开同一个通知窗口
        icon: _this.$baseUrlUpload + data.user.headPic,
        requireInteraction: true //通知保持有效不自动关闭，默认为false
      });
    },
    // 点击分页 - 页码
    handleCurrentChange(val) {
      this.currentPage = val;
      let that = this;
      let params = {
        userId: this.currentToUserId,
        toUserId: this.currentFromUserId,
        no: this.currentPage,
        size: 20
      };
      this.$get("chatting/selectChattingHistory", params).then(res => {
        // console.log(res)
        that.historyItemTotal = res.dataInfo.total;
        that.historyList = res.dataInfo.list;
      });
    },
    // 显示历史纪录数据
    showHistoryDataFn(responseObj) {
      this.isShowHistory = true;
      // console.log(responseObj)
      this.historyItemTotal = responseObj.dataInfo.total;
      this.historyList = responseObj.dataInfo.list;
    },

    messages(message) {
      //接收到的消息
      console.log(message);
      if (message) {
        if (message.messageName && message.messageName === "VoiceMessage") {
          let userMsg = JSON.parse(message.extra);
          message["messageType"] = "media";
          message["fromUserId"] = Number(userMsg["fromUserId"]);
          message["toUserId"] = Number(userMsg["toUserId"]);
          message["message"] = message["content"];
          message["st"] = new Date().getTime();
        }
        //将消息push 到消息列表；
        //查询用户或机器人信息
        this.$get("chatting/selectUserInfo", {
          userId: message["fromUserId"]
        }).then(res => {
          //控制当前消息是否是一个新的会话
          let bool = true;
          let closemessageNotice = true;

          //消息与用户信息合并
          if (this.state.sessions.length > 0) {
            this.state.sessions.forEach((ele, index) => {
              if (
                // sessions 中存在这个对话，将这个消息push到 聊天信息列表中
                ele.message.fromUserId === Number(message.fromUserId) &&
                ele.message.toUserId === Number(message.toUserId)
              ) {
                // 如果当前对话聊天记录大于等于50条，删掉第一条
                this.state.sessions[index].user = res["dataInfo"]["user"];
                if (this.state.sessions[index]["messages"].length >= 50) {
                  this.state.sessions[index]["messages"].shift();
                }
                this.state.sessions[index]["messages"].push(message);
                bool = false;

                //  未读消息的统计
                let stateData = this.state.sessions[index];

                if (this.state.currentSessionId === index) {
                  // 重置统计数
                  stateData.messageCount = 0;
                } else {
                  stateData.messageCount += 1;
                }
                //统计未预览会话
                if (stateData.messageCount === 1) {
                  this.sessionsCountMsg += 1;
                }
                this.state.sessions.splice(index, 1, stateData);
                //是否关闭桌面提示
                closemessageNotice = !this.state.sessions[index].shield;
                //是否播放语音提示
                if (!this.state.sessions[index].shield) {
                  document.querySelector("#chatAudios").play();
                }
              }
            });
            if (this.state.pageChangeStaute && closemessageNotice) {
              this.messageNotice({
                message,
                user: res["dataInfo"]["user"]
              });
            }
            if (bool) {
              // 生成新的对话
              this.state.sessions.unshift(
                Object.assign(
                  {
                    message,
                    // 用户-机器人 聊天信息列表
                    messages: [message],
                    //用户信息
                    user: res["dataInfo"]["user"]
                  },
                  {
                    shield: false,
                    messageCount: 1,
                    ismessageCount: true
                  }
                )
              );
              // 生成新对话置顶，被选中下标加一
              if (this.state.currentSessionId !== null) {
                this.state.currentSessionId += 1;
              }
              document.querySelector("#chatAudios").play();
              this.sessionsCountMsg += 1;
            }
          } else {
            //会话列表不存在，直接生成新的会话
            this.state.sessions.unshift(
              Object.assign(
                {
                  message,
                  messages: [message],
                  user: res["dataInfo"]["user"]
                },
                {
                  shield: false,
                  messageCount: 1,
                  ismessageCount: true
                }
              )
            );
            // 生成新对话置顶，被选中下标加一
            if (this.state.currentSessionId !== null) {
              this.state.currentSessionId += 1;
            }
            document.querySelector("#chatAudios").play();
            this.sessionsCountMsg += 1;
          }
        });
      }
    },
    getShieldIndex(val) {
      if (val) {
        console.log(val);
        // 是否进行新消息提示；
        let { index, data } = val;

        // if (data.shield) {
        this.audioKey = index;
        this.state.sessions[index].shield = data.shield;
        // }
        // console.log(data);
        // this.state.sessions.splice(index, 1, data);
      }
    },
    Keepusersactive() {
      this.time_r = setInterval(() => {
        this.$get("chatting/setUserOnline", {
          chattingHostId: JSON.parse(sessionStorage.getItem("u_msg")).appUserId
        }).then(res => {
          if (res.code === 0) {
            // clearTimeout(time_r);
            // this.Keepusersactive();
          }
        });
      }, 3 * 60 * 1000); // 当前登陆用户保活时间为3分钟，每3分钟请求一次
    },
    getSession(data) {
      //获取聊天对话列表
      // this.isPersonShow = false;
      this.currentUserHeaderPic =
        this.$baseUrlUpload + data.session.user.headPic;
      this.currentUserNickname = data.session.user.nickName;
      if (data.currentId != null) {
        this.currentFromUserId = data.session.message.fromUserId;
        this.currentToUserId = data.session.message.toUserId;
      }
      // 根据 user id 查询 information
      let params = {
        // userId: this.currentFromUserId
        userId: this.currentToUserId
      };
      this.$get("/chatting/selectUserInfo", params).then(res => {
        // console.log(res);
        if (res.dataInfo.user.headPic) {
          // 获取机器人id的头像
          this.currentRobotHeaderPic =
            this.$baseUrlUpload + res.dataInfo.user.headPic;
          this.currentRobotNickname = res.dataInfo.user.nickName;
          this.currentRobotSex = res.dataInfo.user.sex;
          
        }
      });

      //console.log(data);
      this.session = data.session;
      this.state.currentSessionId = data.currentId;

      this.state.sessions.forEach((item, index) => {
        //是否统计未读消息
        if (this.state.currentSessionId === index) {
          this.state.sessions[index].ismessageCount = false;
          //当前选中会话未读消息大于零，未读会话减一
          if (this.state.sessions[index].messageCount > 0) {
            this.sessionsCountMsg -= 1;
          }
          // 当前被选中对话数置零；
          this.state.sessions[index].messageCount = 0;
        } else {
          this.state.sessions[index].ismessageCount = true;
        }
      });

      // 判断历史记录弹窗是否，打开状态
      if (this.isShowHistory) {
        // 打开：请求历史记录 接口展示弹窗
        this.handleCurrentChange(1);
      }
    },
    getText(val) {
      // 会话置底
      let imageObj = null;
      let time = setTimeout(() => {
        if (val.index !== this.state.sessions.length - 1) {
          //是否已经是用户列表的最后一个，是：就不用再做操作了。

          let tagSession = this.state.sessions.splice(val.index, 1);
          this.state.sessions.push(tagSession[0]);
          this.state.currentSessionId = this.state.sessions.length - 1;
        }
        clearTimeout(time);
      }, 100);
      //获取发送的内容
      if (val.messageType === "img") {
        //当发送图片，imageAll 管理所有图片
        imageObj = this.state.imageAll[val.toUserId + "_" + val.fromUserId];
        if (!imageObj)
          this.state.imageAll[val.toUserId + "_" + val.fromUserId] = [];
        this.state.imageAll[val.toUserId + "_" + val.fromUserId].push(val);
      }
      const myData = {
        st: new Date(),
        self: true,
        message: val.message,
        messageType: val.messageType,
        url: val.url ? val.url : "",
        //记录当前所发图片的位置
        currentImageIndex:
          val.messageType === "img"
            ? this.state.imageAll[val.toUserId + "_" + val.fromUserId].length -
              1
            : ""
      };
      if (val.sendFail) {
        myData["sendFail"] = true;
      }
      this.session.messages.push(myData);
    }
  },
  destroyed() {
    if (this.time_r) {
      clearInterval(this.time_r);
    }
    // document.removeEventListener();
  },
  components: {
    Personal,
    List,
    TextCon,
    Message
  }
};
</script>
<style lang="less" scoped>
#chatIndex {
  position: absolute;
  left: 0;
  top: 0;
  margin: 0;
  width: 800px;
  height: 645px;
  background: #eee;
  overflow: hidden;
  border-radius: 3px;

  .sidebar,
  .main {
    height: 100%;
  }
  .sidebar {
    float: left;
    width: 200px;
    color: #f4f4f4;
    background-color: #2e3238;
    overflow: hidden;
  }
  #main {
    width: 600px;
    height: 100%;
    float: right;
    position: relative;
    overflow: hidden;
    background-color: #eee;
  }
  .text {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  .message {
    height: ~"calc(100% - 160px)";
  }
}
/*card*/
.card {
  padding: 12px;
  border-bottom: solid 1px #24272c;

  footer {
    margin-top: 10px;
  }

  .avatar,
  .name {
    vertical-align: middle;
  }
  .avatar {
    border-radius: 2px;
  }
  .name {
    display: inline-block;
    margin: 0 0 0 15px;
    font-size: 16px;
  }
  .search {
    padding: 0 10px;
    width: 100%;
    font-size: 12px;
    color: #fff;
    height: 30px;
    line-height: 30px;
    border: solid 1px #3a3a3a;
    border-radius: 4px;
    outline: none;
    background-color: #26292e;
  }
}
.logout-button {
  float: right;
  cursor: pointer;
}
.message-box {
  height: 300px;
  width: 100%;
}
.message-user {
  color: blue;
}
.message-to-user {
  color: green;
}
.message-user + div {
  text-indent: 10px;
}
.message-to-user + div {
  text-indent: 10px;
}
.history-box {
  position: absolute;
  right: 0;
  top: 0;
  margin-left: 400px;
  background: #fff;
  padding: 10px;
  width: 305px;
  height: 644px;
}
.no-message {
  margin: 69px;
  text-align: center;
  font-size: 20px;
}
.history-list-box {
  width: 100%;
  height: 561px;
  margin-top: 10px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.history-box-title {
  border-bottom: 1px solid #aaa;
  padding-bottom: 6px;
}
.el-icon-close {
  cursor: pointer;
}
.history-li {
  margin-bottom: 9px;
}
img {
  max-height: 100%;
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
.history-audio {
  height: 30px;
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
.parents-box-all {
  width: 1105px;
  height: 643px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.rightMouseButton {
  padding: 8px;
  background: #fff;
  position: absolute;
  left: 0;
  width: 120px;
  height: 30px;
  color: black;
  right: 0;
  z-index: 1;
}
.outer-box {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.rightMouseButton:hover {
  background: #eee;
}
.pop-chrome-box {
  position: absolute;
  width: 800px;
  height: 800px;
  left: 50%;
  top: 50%;
  margin-left: -400px;
  margin-top: -400px;
  background: #fff;
  z-index: 2;
}
</style>
