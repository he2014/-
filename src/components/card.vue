<template>
<div class="card">
    <header data-commont="当前登录的 人工陪聊账号信息：头像、昵称">
        <!-- <img class="avatar" width="40" height="40" :alt="user.name" :src="user.img"> -->
        <!-- <p class="name">{{user.name}}</p> -->
        <span>客服账号:{{user_account}}</span>
        <span class="logout-button">退出</span>
    </header>
    <!-- <footer data-commont="左侧用户列表搜索框，">
        <input class="search" type="text" placeholder="search user..." @keyup="onKeyup | debounce 150">
    </footer> -->
</div>
</template>
<script>
// import { actions } from '../store';

export default {
  data () {
    return {
      user_account: '111111',
    }
  }
    // vuex: {
    //     actions: actions,
    //     getters: {
    //         user: ({ user }) => user,
    //         filterKey: ({ filterKey }) => filterKey
    //     }
    // },
    // methods: {
    //     onKeyup (e) {
    //         this.search(e.target.value);
    //     }
    // }
};
</script>
<style scoped lang="less">
.card {
  padding: 12px;
  border-bottom: solid 1px #24272C;

  footer {
      margin-top: 10px;
  }

  .avatar, .name {
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
      background-color: #26292E;
  }
}
</style>