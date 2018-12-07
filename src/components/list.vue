<template>
  <div class="list">
    <!-- <div 
      v-if="isShowDeleteFriends" 
      v-bind:style="{top: deletePopTop + 'px',left: deletePopLeft + 'px' }"
      class="rightMouseButton">
      Deleting friends
    </div> -->
    <ul class="user-list">
      <li 
        @mousedown="userLiMouseRi(index,item, $event)"
        data-commont="左侧 - 用户"
        v-for="(item,index) in sessions" 
        :class="{ active:index === currentId }"
        class="user-li-item"
        @click="selectSession(index)" :key="index">
        <div class="li-left-img">
          <img class="avatar" @click.stop="showInfoData(index)" width="30" height="30" 
            :alt="item.user?item.user.nickName: ''" 
            :src="item.user.headPic?$baseUrlUpload+item.user.headPic:'/static/emojiMine/emoji_amaze.png'">
        </div>
        <div class="li-center-content">
          <span class="message-num" v-show="item.messageCount&&item.ismessageCount">{{item.messageCount}}</span>
          <p class="name">{{item.user?item.user.nickName: ''}}</p>
          <div class="latest-message">
            <p class="lt" 
              v-show="item.messages.length>0&&item.messages[item.messages.length-1].messageType == 'img'" 
              data-commont="图片">
              【picture】
            </p>
            <p class="lt" 
              v-show="item.messages.length>0&&item.messages[item.messages.length-1].messageType == 'media'" 
              data-commont="语音">
              【voice】
            </p>
            <p class="lt" 
              v-show="item.messages.length>0&&item.messages[item.messages.length-1].messageType == 'gif'" 
              data-commont="gif">
              【gif】
            </p>
            <div v-show="(item.messages[item.messages.length-1]) && (item.messages[item.messages.length-1]).hasOwnProperty('sendFail')" class="fail-icon-tip" data-commont="发送失败的提示 icon">！</div>
            <p 
              class="lt overflow-show-point"
              v-show="item.messages.length>0&&item.messages[item.messages.length-1].messageType == 'text'" 
              v-html="emoji(item.messages.length>0&&item.messages[item.messages.length-1].messageType == 'text'?item.messages[item.messages.length-1].message:'', 'text')">
            </p>
            <!-- <p v-else data-commont="草稿"> 草稿：test</p> -->
          </div>
        </div>
        <!-- 提醒或屏蔽 -->
         <div class="li-right-content">
            <!-- <div>{{getTime(item.messages[item.messages.length-1])}}</div> -->
            <i class="notice"  :class="{'shield':item.shield}" @click.stop="isShield(item,index)"></i>
         </div>
      </li>
    </ul>
  </div>
</template>
<script>
// import { actions } from "../store";

export default {
  name: "list",
  props: {
    listData: {
      type: Array
    },
    currentId: {
      type: Number
    }
  },
  data() {
    return {
      sessions: [],
      currentSessionId: 0,
      session: {},
      isShowDeleteFriends: false
      // deletePopTop: 500,
      // deletePopLeft: 500,
    };
  },
  mounted() {
    // 阻止 右键 默认出来的系统弹窗
    document.oncontextmenu = function(e) {
      return false;
    };

    this.$nextTick(() => {
      // console.log(this.listData);
      // console.log(this.currentId)
      this.currentSessionId = this.currentId;
      this.sessions = this.listData;
      //console.log(this.sessions);
      //  this.getSession();
    });
  },
  methods: {
    userLiMouseRi(index, item, e) {
      console.log("e:", e);
      if (e.button == 2) {
        // 点击的是鼠标右键
        this.isShowDeleteFriends = true;

        // this.deletePopTop = e.layerY
        // this.deletePopLeft = e.layerX

        // this.deletePopTop = e.clientY
        // this.deletePopLeft = e.clientX
        let positionObj = {
          top: e.clientY,
          left: e.clientX,
          index,
          item
        };

        this.$emit("showRightClick", positionObj);
      } else if (e.button == 1) {
        // 鼠标中键
      } else if (e.button == 0) {
        // 鼠标左键
      }
    },
    showInfoData(num) {
      // console.log(e);
      // console.log(item)
      if (this.currentId === num) {
        this.$emit("clickHeaderPics", true);
      }
    },
    getTime(date) {
      // if (typeof date === "string") {
      //   date = new Date(date);
      // }
      // return (
      //   this.PrefixInteger(date.getHours()) +
      //   ":" +
      //   this.PrefixInteger(date.getMinutes())
      // );
    },
    PrefixInteger(num) {
      num = Number(num);
      return (Array(2).join("0") + num).slice(-2);
    },
    selectSession(id) {
      this.currentSessionId = id;
      this.getSession();
    },
    getSession() {
      this.sessions.forEach((element, index) => {
        if (index === Number(this.currentSessionId)) {
          this.session = element;
        }
      });
      let data = {
        currentId: this.currentSessionId,
        session: this.session
      };
      this.$emit("showData", data);
    },
    isShield(data, index) {
      //是否屏蔽通知
      data["shield"] = !data["shield"];
      this.$emit("getShieldIndex", { index, data });
    }
  }
  // watch: {
  //   // sessions: {
  //   //   handler(newName, oldName) {}
  //   // }
  // }
};
</script>
<style scoped lang="less">
.list {
  li {
    padding: 12px 5px 12px 15px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #292c33;
    cursor: pointer;
    transition: background-color 0.1s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
    &.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
  .rt {
    float: right;
  }
  .lt {
    float: left;
  }
  .latest-message {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .overflow-show-point {
    width: 77px;
    /* border:1px solid #ddd; */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0;
    float: right;
  }
  .fail-icon-tip {
    float: left;
    color: red;
    width: 5px;
    height: 20px;
  }
  // .sendFailBg{
  //   padding-left: 10px;
  //   box-sizing: border-box;
  // }
  .li-left-img {
    float: left;
    width: 30px;
    height: 100%;
    margin-right: 5px;
  }
  .li-center-content {
    float: left;
    width: 95px;
    overflow: hidden;
  }
  .user-li-item {
    width: 200px;
    overflow: hidden;
    position: relative;
  }
  .message-num {
    position: absolute;
    left: 35px;
    top: 0;
    background: red;
    color: white;
    border-radius: 5px;
    padding: 3px 5px;
    font-weight: 700;
    font-size: 18px;
  }
  p {
    margin: 0;
  }
  .message-img-img {
    width: 100px;
  }
  .li-right-content {
    float: right;
    width: 50px;
    height: 100%;
    text-align: center;
    .notice {
      display: block;
      width: 15px;
      height: 15px;
      margin: 4px auto;
      background: url(../assets/images/remind.png) no-repeat;
    }
    .notice.shield {
      background: url(../assets/images/shield.png) no-repeat;
    }
  }
}
.user-list {
  overflow: scroll;
  height: 616px;
  overflow-x: hidden;
  width: 240px;
}

// .rightMouseButton{
//   padding: 5px;
//   background: #fff;
//   position: absolute;
//   left: 0;
//   width:120px;
//   height: 30px;
//   color:black;
//   right: 0;
//   z-index: 1;
// }
</style>
