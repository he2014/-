import data from '../data/emoji-data.js'
// import {responseEmojiStrArr, EmojiStrArr} from '../data/emojiConstArr.js'

let emojiData = {}

Object.values(data).forEach(item => {
  emojiData = { ...emojiData, ...item }
})

/**
 *
 * @export
 * @param {string} value
 * @returns {string}
 */

let responseEmojiStrArr = ['[xiao]','[lau]','[ang]','[cry]','[thu]','[shy]','[sil]','[tir]','[deyi]','[joy]','[sad]','[ama]','[scr]','[vom]','[sle]','[dro]','[pan]','[lov]','[inc]','[cur]','[con]','[tri]','[des]','[gri]','[kis]','[bye]','[sli]']
let EmojiStrArr = [  ':emoji_smile:',  ':emoji_laugh:',  ':emoji_anger:',  ':emoji_cry:',  ':emoji_thumb:',  ':emoji_shy:',  ':emoji_silent:',  ':emoji_tired:',  ':emoji_smug:',  ':emoji_joyful:',  ':emoji_sad:',  ':emoji_amaze:',  ':emoji_scream:',  ':emoji_vomit:',  ':emoji_sleep:',  ':emoji_drool:',  ':emoji_panic:',  ':emoji_lovely:',  ':emoji_incite:',  ':emoji_curse:',  ':emoji_confusion:',  ':emoji_trick:',  ':emoji_pooh:',  ':emoji_grievance:',  ':emoji_kiss:',  ':emoji_bye:',  ':emoji_slight:']
let responseGifStrArr = []
for(let i=0;i<22;i++) {
  responseGifStrArr.push('soogif'+i)
}

// 处理从server传过来的数据，将 含有 [lau] 格式的字符串 转成 对应的表情，展示收到的消息
export function emoji (message, messageType) {
  if (messageType == 'text') {
    // 第一步：替换 中括号格式 为 冒号格式，然后，将冒号格式替换成图片。message格式 [xiao][xiao]
    if (responseEmojiStrArr.forEach(item => {
      if (message.indexOf(item) > -1) {
        let i = responseEmojiStrArr.indexOf(item)
        let replaceStr = EmojiStrArr[i]
        // let e = /\[xiao\]/g
        // 在正则表达式中加变量，只能用正则的构造函数
        item = item.replace('[', '')
        item = item.replace(']', '')
        let e = new RegExp("\\[" + item + "\\]","gim")
        message = message.replace(e, replaceStr)
      }
    }))

    // 第二步：将冒号格式 (:emoji_amaze:) 全局替换成 表情图片 展示在web
    if (!message) return 
    Object.keys(emojiData).forEach(item => {
      message = message.replace(new RegExp(item, 'g'), createIcon(item))
    })
  } else if (messageType == 'gif') {
    // 1. 如果是：后台传过来的数据（1-21 的数字） ，展示为对应动图
    for (let j=0;j<22;j++) {
      if (message == j) {
        let path = '/static/gif/'
        message = `<img src=${path}soogif${message}.gif width="140px" >`
      }
    }

    // 2. 如果是web发送的GIF图，是 :soogif1: 的格式，处理成对应的图片
      // 如果发送的是GIF，是固定的格式：:soogif1:
    let e = /^:soogif[1-21]:$/
    if (e.test(message)) {
      message = message.replace(item, createIconGif(message))
    }
  }
  return message
}

function createIcon (item) {
  // item 格式例如 :emoji_amaze:
  const imgPngName = emojiData[item] // emoji_amaze.png
  let path = '/static/emojiMine/'
    let str = `<img src=${path}${imgPngName} width="20px" height="20px">`
    return str
}
function createIconGif (message) {
  // item 格式例如 :emoji_amaze:
  const imgPngName = emojiData[message] // emoji_amaze.png
  let path = '/static/gif/'
    let str = `<img src=${path}${imgPngName} width="20px" height="20px">`
    return str
}

// 将web端冒号格式（:emoji_amaze:）的表情，转成 符合APP端 [lau] 格式的表情
export function exchangeEmojiStrToAppEmojiStr (message) {
  for (let i=0;i<EmojiStrArr.length;i++) {
    let item = EmojiStrArr[i]
    if (message.indexOf(item) > -1) {
      let index = EmojiStrArr.indexOf(item)
      message = message.replace(new RegExp(item, 'g'), responseEmojiStrArr[index])
    }
  }
  return message
}