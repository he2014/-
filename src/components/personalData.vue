<template>
  <div class="personalData-con">
    <div class="upDownShowIds">
      <div class="robotUserIdText">&nbsp; userId: {{this.currentFromUserId}}</div>
      <div class="robotUserIdText">robotId: {{this.currentToUserId}}</div>
    </div>
    <!-- <div style="clear:both"></div> -->
    <!-- <el-button class="deleteBtn" @click.stop="deleteSession">删除会话</el-button> -->
    <div class="upDown" @click.stop="showPersonal()">
      <span>personal data</span><i class="el-icon-caret-bottom" :class="{active: isShow===true}" ></i>
    </div>
    <transition name="fade" mode="">
      <div class="dataCon" v-show="personShow" ref="upDown">
        <ul>
          <li>
            <div class="title">Session user</div>
            <img class="headerImg" :src="personal.fromUser.headPic?$baseUrlUpload+personal.fromUser.headPic:'/static/emojiMine/emoji_amaze.png'" alt="">
            <div class="name">{{personal.fromUser.nickName?personal.fromUser.nickName:''}}</div>
            <div class="length">The other side is {{Math.floor(personal.distance/1000)}} km</div>
            <div class="age"><i class="sex male" v-if="personal.fromUser.sex===1" ></i>
                              <i class="sex female" v-else ></i>
            {{personal.fromUser.birthday?personal.fromUser.birthday:0}}yeas old</div>
            <div class="row" data-commont="情感状态">relationshipState：{{judgeRelationship(personal.fromUser.relationship?personal.fromUser.relationship:'no data')}}</div>
            <div class="row" data-commont="宗教">region：{{judgeRegion(personal.fromUser.religion?personal.fromUser.religion:'no data')}}</div>
            <div class="row" data-commont="家乡">hometown:{{toCountryProviceCity(personal.fromUser.hometown?personal.fromUser.hometown:'no data')}}</div>
            <div class="row" data-commont="现居地">location:{{toCountryProviceCity(personal.fromUser.presentAddress?personal.fromUser.presentAddress:'no data')}}</div>
            <div class="row">school：{{personal.fromUser.school?personal.fromUser.school:'no data'}}</div>
            <div class="row">introduceOneselfTo：{{personal.fromUser.userDesc?personal.fromUser.userDesc:'no data'}}</div>
          </li>
          <li>
            <div class="title">Your identity</div>
           <img class="headerImg" :src="personal.toUser.headPic?$baseUrlUpload+personal.toUser.headPic:'/static/emojiMine/emoji_amaze.png'" alt="">
            <div class="name">{{personal.toUser.nickName?personal.toUser.nickName:''}}</div>
            <div class="length">The other side is{{Math.floor(personal.distance/1000)}} km</div>
            <div class="age"><i class="sex male" v-if="personal.toUser.sex===1" ></i>
                              <i class="sex female" v-else ></i>
            {{personal.toUser.birthday?personal.toUser.birthday:0}}yeas old</div>
            <div class="row" data-commont="情感状态">relationshipState：{{judgeRelationship(personal.toUser.relationship?personal.toUser.relationship:'no data')}}</div>
            <div class="row" data-commont="宗教">region：{{judgeRegion(personal.toUser.religion?personal.toUser.religion:'no data')}}</div>
            <div class="row" data-commont="家乡">hometown：{{toCountryProviceCity(personal.toUser.hometown?personal.toUser.hometown:'no data')}}</div>
            <div class="row" data-commont="现居地">location:{{toCountryProviceCity(personal.toUser.presentAddress?personal.toUser.presentAddress:'no data')}}</div>

            <div class="row">school：{{personal.toUser.school?personal.toUser.school:'no data'}}</div>
            <div class="row">introduceOneselfTo：{{personal.toUser.userDesc?personal.toUser.userDesc:'no data'}}</div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  //user.headPic?$baseUrlUpload+item.user.headPic:'/static/emojiMine/emoji_amaze.png
  name: "personal",
  props: {
    currentToUserId: {
      type: Number
    },
    currentFromUserId: {
      type: Number
    },
    isPersonShow: {
      type: Boolean
    }
  },
  data() {
    return {
      personal: {
        fromUser: {},
        toUser: {},
        distance: 0
      },
      isShow: false
    };
  },
  computed: {
    personShow() {
      return this.isPersonShow;
    }
  },
  mounted() {
    let _this = this;
    document.addEventListener("click", function(e) {
      if (_this.$refs["upDown"] == undefined) {
        _this.isShow = false;
      } else {
        if (!!_this.$refs.upDown.contains(e.target)) return;
        _this.isShow = false;
        if (e.target.dataset.avatar === "100") {
          _this.$emit("reTurnisPersonShow", true);
        } else {
          _this.$emit("reTurnisPersonShow", false);
        }
      }
      //   console.log(e.target);
    });
    // this.getInfoDataById();
  },
  updated() {},

  watch: {
    isPersonShow() {
      if (this.isPersonShow) {
        this.getInfoDataById();
      }
      if (!this.isPersonShow) {
        this.$emit("reTurnisPersonShow", false);
      }
    }
  },
  methods: {
    // 根据 用户id 和 机器人id 请求资料
    getInfoDataById(userId, robotId) {
      let params = {
        userId: this.currentToUserId,
        toUserId: this.currentFromUserId
      };
      this.$get("/chatting/selectUserProfile", params).then(res => {
        if (res.code == 0) {
          let data = res.dataInfo;
          this.personal.distance = data.distance;
          this.personal.fromUser = data.list[0];
          if (this.personal.fromUser.birthday) {
            this.personal.fromUser.birthday = this.getUserbirthday(
              this.personal.fromUser.birthday
            );
          }
          this.personal.toUser = data.list[1];
          if (this.personal.toUser.birthday) {
            this.personal.toUser.birthday = this.getUserbirthday(
              this.personal.toUser.birthday
            );
          }
        }
        console.log(this.personal);
      });
    },
    // 根据数字判断宗教 名字
    judgeRegion (n) {
      let str = 'no data'
      if (n == 0) {str = 'no data'}
      else if (n == 1) {str = 'Hindus'}
      else if (n == 2) {str = 'Muslims'}
      else if (n == 3) {str = 'Christians'}
      else if (n == 4) {str = 'Sikh'}
      else if (n == 5) {str = 'Buddhists'}
      else if (n == 6) {str = 'Jains'}
      else if (n == 7) {str = 'Other'}
      return str
    },
    // 判断情感状态，根据数字
    judgeRelationship (n) {
      let str = 'no data'
      if (n == 1) {
        str = 'single'
      } else if (n == 4) {
        str = 'ask me'
      }
      return str
    },
    // 根据地址字符串，解析成 国家、省、市
    toCountryProviceCity (str) {
      if (str && str!='no data') {
        return JSON.parse(str)['co'] +' '+ JSON.parse(str)['pr'] +' '+ JSON.parse(str)['ci']
      } else {
        return 'no data'
      }
    },
    getUserbirthday(birthday) {
      let date = new Date().getTime();
      let time = date - birthday;
      //一年毫秒数(365 * 86400000 = 31536000000)
      return Math.ceil(time / 31536000000);
    },
    showPersonal() {
      //展示资料

      this.isShow = !this.isShow;
      this.$emit("reTurnisPersonShow", this.isShow);
    },
    deleteSession() {
      //删除会话
      this.$confirm("Do you want to end this conversation??", "tip", {
        confirmButtonText: "confirm",
        cancelButtonText: "cancel",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    }
  }
};
</script>
<style lang="less">
.personalData-con {
  position: relative;
  width: 100%;
  height: 45px;
  text-align: center;
  line-height: 45px;
  box-sizing: border-box;
  .upDown {
    position: relative;
    width: 100px;
    margin: 0 auto;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    .el-icon-caret-bottom.active::before {
      content: "\E60C";
    }
  }
  .deleteBtn {
    float: right;
    margin-top: 6px;
    margin-right: 20px;
    padding: 8px 15px;
    span {
      font-size: 12px;
    }
  }
  .dataCon {
    position: absolute;
    left: 5px;
    top: 45px;
    width: 590px;
    //height: 420px;
    padding-bottom: 20px;
    background: #fff;
    z-index: 101;
    webkit-box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
    max-height: 430px;
    overflow-y: scroll;
    overflow-x: hidden;

    ul {
      width: 100%;
      overflow: hidden;
      //height: 100%;
      li {
        width: 46%;
        height: 100%;
        padding: 0 30px;
        float: left;
        box-sizing: border-box;
        // overflow-y: auto;
        div {
          padding: 0;
          margin: 0;
          text-align: left;
          line-height: 20px;
        }
        .title {
          width: 100%;
          height: 35px;
          line-height: 35px;
          font-size: 14px;
          padding: 0;
          margin: 0;
          text-align: center;
        }
        .headerImg {
          width: 240px;
          height: 200px;
          border-radius: 10px;
        }
        .name {
          margin-top: 10px;
        }
        .length {
          font-size: 12px;
          color: #aaa;
        }
        .age {
          width: 96px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 12px;
          border: 1px solid #000;
          border-radius: 5px;
          position: relative;
          padding-left: 17px;
          margin-bottom: 5px;
        }
        .female::before {
          content: "";
          position: absolute;
          top: 2px;
          left: 5px;
          width: 15px;
          height: 15px;
          background: url(../assets/images/female.png) no-repeat;
          display: inline-block;
        }
        .male::before {
          content: "";
          position: absolute;
          top: 2px;
          left: 5px;
          width: 15px;
          height: 15px;
          background: url(../assets/images/male.png) no-repeat;
          display: inline-block;
        }
        .row {
          font-size: 12px;
        }
        .label {
          width: 100%;
          overflow: hidden;
          margin-top: 5px;
          span {
            display: inline-block;
            height: 25px;
            line-height: 25px;
            border-radius: 25px;
            color: #fff;
            background: #0099ff;
            font-size: 12px;
            padding: 0 15px;
            margin-right: 10px;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
.personalData-con::after {
  content: "";
  height: 1px;
  background: #000;
  position: absolute;
  left: 20px;
  right: 20px;
}
.upDownShowIds {
  // position: absolute;
  // left: 0;
  // top:2px;
  float: left;
  overflow: hidden;
}
.robotUserIdText,
.userIdText {
  line-height: 20px;
}
</style>