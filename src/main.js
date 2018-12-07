// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
// 引入默认的element-ui样式
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
// 多语言切换功能
import i18n from './components/i18n'
// axios
import { fetchGet, fetchPost, fetchPostUpload } from './api/axiosConfig'
import { directives } from './directives'
directives(Vue)
Vue.config.productionTip = false
Vue.prototype.$get = fetchGet
Vue.prototype.$post = fetchPost
Vue.prototype.$postUpload = fetchPostUpload

Vue.use(ElementUI)
// 表情
import './components/emoji/assets/css/iconfont.css';
import { emoji } from './components/emoji/utils/emoji.js';
import { exchangeEmojiStrToAppEmojiStr } from './components/emoji/utils/emoji.js';
Vue.prototype.emoji = emoji
Vue.prototype.exchangeEmojiStrToAppEmojiStr = exchangeEmojiStrToAppEmojiStr
// 将时间戳，转换成 UTC 展示时间，将后台的时间戳转成以下格式，显示在页面上
Vue.prototype.toUTCTime = function time(time) {
  if (time) {
    time = new Date(time);
    let year = time.getUTCFullYear();
    let month = time.getUTCMonth() + 1;
    let day = time.getUTCDate();
    let hours = time.getUTCHours();
    let minutes = time.getUTCMinutes();
    let seconds = time.getUTCSeconds();
    time = year + "/" + num(month) + "/" + num(day) + " " + num(hours) + ":" + num(minutes) + ":" + num(seconds);
  } else {
    time = ''
  }
  function num(n) {
    if (n < 10) { n = "0" + n; }
    return n;
  }
  return time;
}
Vue.prototype.timestampToTime = (timestamp) => {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
