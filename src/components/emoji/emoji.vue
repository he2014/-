<template>
  <div class="emoji">
    <ul class="emoji-controller">
      <li v-for="(pannel,index) in pannels" :key="index"    @click="changeActive(index)"  :class="{'active': index === activeIndex}">{{ pannel }}</li>
    </ul>
    <ul v-if="activeIndex == 0" class="emoji-container" data-commont="表情">
      <li 
        v-for="(item, index) in emojiData"
        :key="index"
        style="padding: 0;"
         >
         <a 
          href="javascript:;"
          @click="selectItem(item.name)">
          <img :src="require('@/assets/images/emoji/'+item.img)" :alt="item.name">
        </a>
      </li>
    </ul>
    <ul v-else class="emoji-container" data-commont="gif">
       <!-- <li 
        v-for="(item, index) in emojiData2"
        :key="index"
        @click="clickGif(item)"
        style="padding: 0;" 
         >
         <a 
          href="javascript:;"
          @click="selectItem(item.name)">
          <img :src="require('@/assets/images/gif/'+item.img)" :alt="item.name"
          style="width:100%;height: 100%;">
        </a>
      </li> -->
      <li 
        v-for="(item, index) in emojiData2"
        :key="index"
        @click="clickGif(item, index)"
        style="padding: 0;" 
         >
         <a 
          href="javascript:;">
          <img :src="require('@/assets/images/gif/'+item.img)" :alt="item.name"
          style="width:100%;height: 100%;">
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
// import emojiArr from '../emoji/data/emoji-data.js'

export default {
  name: 'emoji',
  props: {
    currentToUserId: {
      type: Number
    },
    currentFromUserId: {
      type: Number
    },
    currentRobotSex: {
      type: Number
    }
  },
  data () {
    return {
      emojiData: [
        {name: ':emoji_amaze:', img: 'emoji_amaze.png'},
        {name: ':emoji_anger:', img: 'emoji_anger.png'},
        {name: ':emoji_bye:', img: 'emoji_bye.png'},
        {name: ':emoji_confusion:', img: 'emoji_confusion.png'},
        {name: ':emoji_cry:', img: 'emoji_cry.png'},
        {name: ':emoji_curse:', img: 'emoji_curse.png'},
        {name: ':emoji_grievance:', img: 'emoji_grievance.png'},
        {name: ':emoji_hate:', img: 'emoji_hate.png'},
        {name: ':emoji_incite:', img: 'emoji_incite.png'},
        {name: ':emoji_joyful:', img: 'emoji_joyful.png'},
        {name: ':emoji_kiss:', img: 'emoji_kiss.png'},
        {name: ':emoji_laugh:', img: 'emoji_laugh.png'},
        {name: ':emoji_lovely:', img: 'emoji_lovely.png'},
        {name: ':emoji_panic:', img: 'emoji_panic.png'},
        {name: ':emoji_pooh:', img: 'emoji_pooh.png'},
        {name: ':emoji_sad:', img: 'emoji_sad.png'},
        {name: ':emoji_scream:', img: 'emoji_scream.png'},
        {name: ':emoji_shy:', img: 'emoji_shy.png'},
        {name: ':emoji_silent:', img: 'emoji_silent.png'},
        {name: ':emoji_sleep:', img: 'emoji_sleep.png'},
        {name: ':emoji_slight:', img: 'emoji_slight.png'},
        {name: ':emoji_smile:', img: 'emoji_smile.png'},
        {name: ':emoji_smug:', img: 'emoji_smug.png'},
        {name: ':emoji_thumb:', img: 'emoji_thumb.png'},
        {name: ':emoji_tired:', img: 'emoji_tired.png'},
        {name: ':emoji_trick:', img: 'emoji_trick.png'},
        {name: ':emoji_vomit:', img: 'emoji_vomit.png'},
      ],
      emojiData2: [
        {name: ':soogif1:', img: 'soogif1.gif'},
        {name: ':soogif2:', img: 'soogif2.gif'},
        {name: ':soogif3:', img: 'soogif3.gif'},
        {name: ':soogif4:', img: 'soogif4.gif'},
        {name: ':soogif5:', img: 'soogif5.gif'},
        {name: ':soogif6:', img: 'soogif6.gif'},
        {name: ':soogif7:', img: 'soogif7.gif'},
        {name: ':soogif8:', img: 'soogif8.gif'},
        {name: ':soogif9:', img: 'soogif9.gif'},
        {name: ':soogif10:', img: 'soogif10.gif'},
        {name: ':soogif11:', img: 'soogif11.gif'},
        {name: ':soogif12:', img: 'soogif12.gif'},
        {name: ':soogif13:', img: 'soogif13.gif'},
        {name: ':soogif14:', img: 'soogif14.gif'},
        {name: ':soogif15:', img: 'soogif15.gif'},
        {name: ':soogif16:', img: 'soogif16.gif'},
        {name: ':soogif17:', img: 'soogif17.gif'},
        {name: ':soogif18:', img: 'soogif18.gif'},
        {name: ':soogif19:', img: 'soogif19.gif'},
        {name: ':soogif20:', img: 'soogif20.gif'},
        {name: ':soogif21:', img: 'soogif21.gif'},
      ],
      pannels: ['表情', 'gif'],
      // pannels: ['表情', 'gif'],
      activeIndex: 0,
    }
  },
  mounted () {
    // console.log(this.emojiData)
    // console.log(this.emojiData2)
  },
  methods: {
    // 点击 动图 直接发送消息
    clickGif (item, index) {
      console.log(item)
      this.$emit('selectGif', item)
      // 调用发送消息接口
      let params = {
        userId: this.currentToUserId,
        toUserId: this.currentFromUserId,
        // 格式是带有[],转义
        // msg: this.exchangeEmojiStrToAppEmojiStr(msgContent),
        msg: (index + 1),
        // 对话框颜色 1男 2 女
        extern: '{sex: '+this.currentRobotSex+'}',
        // 文字和上传图片是text 动图是gif
        messageType: 'gif'
      }
      this.$get('/chatting/sendMsg', params).then(res => {
        console.log(res)
        if (res.code == 0) {
          console.log('ok')
          // that.$emit("sendMessage",data)
        } else if (res.code == 12000009) {
          alert('Speak too fast')
        } else if (res.code == 12000001) {
          alert('Unknown error in message system')
        } else if (res.code == 12000002) {
          alert('Not a friend')
        }
      }).catch(res => {
        // 标志发送失败
        // data['sendFail'] = true
        // that.$emit("sendMessage",data)
      })
      return false
    },
    changeActive (index) {
      this.activeIndex = index
    },
    getPureName (name) {
      return name.replace(/:/g, '')
    },
    selectItem (emoji) {
      this.$emit('select', emoji)
    }
  },
  computed: {
    emojis () {
      return this.pannels.map(item => {
        return Object.keys(this.emojiData[item])
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import '../emoji/assets/less/emoji-sprite.less';

.emoji {
  width: 380px;
  height: 186px;
  bottom: 30px;
  background: #fff;
  z-index: 10;
  padding: 10px;
  margin-right: 10px;
  .emoji-controller {
    height: 36px;
    overflow: hidden;
    margin-bottom: 0;
    li {
      float: left;
      width: 76px;
      font-size: 12px;
      line-height: 36px;
      cursor: pointer;
      text-align: center;
      position: relative;
      &.active::after{
        content: '';
        width: 100%;
        height: 1px;
        background: #0689dd;
        left: 0;
        bottom: 4px;
        position: absolute;
      }
    }
  }
  .emoji-container {
    height: 140px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    li {
      font-size: 0;
      padding: 5px;
      a {
        float: left;
        overflow: hidden;
        height: 35px;
        width: 35px;
        transition: all ease-out .2s;
        border-radius: 4px;
        &:hover {
          background-color: #d8d8d8;
          border-color: #d8d8d8;
        }
        span {
          width: 25px;
          height: 25px;
          display: inline-block;
          border: 1px solid transparent;
          cursor: pointer;
        }
      }
    }
  }
}
.emoji-image{
  width: 100%;
  height: 100%;
}
</style>
