<template>
  <div class="page-login">
     <div class="login-box">
       <div class="login-title">"Accompany you" chat system</div>
       <el-form :label-position="labelPosition" label-width="122px" :model="loginForm" class="login-form">
        <el-form-item label="Account number">
          <el-input v-model="loginForm.account"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item size="large" class="submitBtn">
          <el-button  size="medium" type="primary" @click="login" :loading="loading">login</el-button>
        </el-form-item>
       </el-form>
     </div>
    <!-- <button  @click.stop="login('loginForm')">登录</button> -->
    <!-- <div class="langBox">
          <a class="lang-item" href="?lang=cn">简体中文</a>
          <span class="sep"></span>
          <a class="lang-item" href="?lang=en">English</a>
          <span class="sep"></span>
          <a class="lang-item" href="?lang=id">印度</a>
          <span class="sep"></span>
          <a class="lang-item" href="?lang=tr">土耳其</a>
      </div> -->
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      labelPosition: "left",
      loginForm: {
        account: "12345678",
        password: "111111"
      },
      loading: false
    };
  },
  methods: {
    login: function() {
      let that = this;
      let params = {
        loginName: this.loginForm.account,
        password: this.loginForm.password
      };
      this.$get("chatting/login", params).then(res => {
        sessionStorage.setItem("u_msg", JSON.stringify(res.dataInfo));
        sessionStorage.setItem("token", res.dataInfo.token);
        localStorage.setItem("r_token", res.dataInfo.rongCloudToken);
        localStorage.setItem("userId", res.dataInfo.userId);
        localStorage.setItem("userAccount", that.loginForm.account);
        if (res.code == 0) {
          that.$router.push({ name: "ChatIndex" });
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.page-login {
  width: 100%;
  height: 100%;
  position: relative;
}
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -175px;
  margin-top: -190px;
  width: 398px;
  height: 350px;
  box-sizing: border-box;
  padding: 30px 30px;
  box-shadow: rgb(153, 153, 153) 0px 2px 10px;
  border-radius: 4px;
  background-color: rgb(255, 255, 255);
}
.login-title {
  font-size: 20px;
  font-weight: bold;
}
.login-form {
  margin-top: 50px;
  .el-input__inner {
    width: 200px;
    height: 35px;
    line-height: 35px;
  }
  .el-form-item__content {
    text-align: left;
  }
  .submitBtn {
    margin-top: 40px;
    .el-form-item__content {
      margin-left: 10px !important;
      text-align: center;
    }
    .el-button {
      width: 250px;
      margin: 0 auto;
      background: #000;
      border: 1px solid #000;
    }
  }
}
.langBox {
  position: absolute;
  left: 60px;
  bottom: 60px;
  a {
    text-decoration: none;
    font-size: 12px;
    color: #d3d3d3;
  }
  .sep {
    display: inline-block;
    height: 12px;
    vertical-align: middle;
    margin: 0 10px;
    border-right: 1px solid #d3d3d3;
  }
}

h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
