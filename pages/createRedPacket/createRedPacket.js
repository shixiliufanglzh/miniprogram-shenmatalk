// pages/createRedPacket/createRedPacket.js
const app = getApp();
const apiUrl = require('../../utils/constant.js');
const getUserInfo = require('../../utils/getUserInfo.js');
const WeCropper = require('../assets/we-cropper/we-cropper.js');
const f_words = require('../../utils/forbid.js');

let recorderManagerCreate = wx.getRecorderManager();
let recordTimer = null;
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 100

Page({
  /**
   * 页面的初始数据
   */
  data: {
    recordTime: 10,
    recordAuth: false,
    hideRecordToast: true,
    pageY: 0,
    recordFileMsg: null,
    recordMode: false,

    navTab: ["口令红包", "问答红包"],
    currentNavtab: "0",
    formId: 0,
    hideCropper: true,
    pointInfo: {},
    optionsState: true,
    tokenArr: [
      "谢谢老板打赏",
      "新婚快乐早生贵子大富大贵",
      "群主你最帅群主你最好群主我们都爱你",
      "祝福发红包的帅哥美女全家安康大吉大利发大财",
      "祝群友们新春快乐阖家欢乐身体健康万事如意不谢",
      "狗年发大财汪汪汪汪汪汪汪汪汪汪汪汪汪汪汪汪汪",
      "红鲤鱼与绿鲤鱼与驴",
      "补破皮褥子不如不补破皮褥子",
      "红凤凰粉凤凰红粉凤凰粉红凤凰",
      "半盆冰棒半盆瓶冰棒碰盆盆碰瓶",
      "抱着灰鸡上飞机飞机起飞灰鸡要飞",
      "妈妈种麻我去放马马吃了麻妈妈骂马",
      "四是四十是十十四是十四四十是四十",
      "牛郎恋刘娘刘娘恋牛郎牛郎年年念刘娘",
      "板凳宽扁担长板凳比扁担宽扁担比板凳长",
      "发废话花费话费会后悔回发废话会费话费",
      "吃葡萄不吐葡萄皮儿不吃葡萄倒吐葡萄皮儿",
      "长城长城墙长长长长城长城墙城墙长长城长长",
      "倒草倒掉稻草倒稻也倒倒草别倒稻倒稻别倒草",
      "板凳宽扁担长扁担没有板凳宽板凳没有扁担长",
      "黑化肥挥发发灰会花飞灰化肥挥发发黑会飞花",
      "一堆肥一堆灰肥混灰灰损肥不要肥混灰防止灰损肥",
      "别着喇叭的哑巴不愿拿喇叭换提着獭犸的喇嘛的獭犸",
      "七巷漆匠用了西巷锡匠的锡西巷锡匠拿了七巷漆匠的漆",
      "门上吊刀刀倒吊着门上吊刀刀倒吊着门上吊刀刀倒吊着",
      "我是单身狗抢我红包的美女快来私信我"
    ],
    selectedToken: "",
    recommendMoney: [
      {
        id: 0,
        value: "5",
        state: "unselected"
      }, {
        id: 1,
        value: "10",
        state: "unselected"
      }, {
        id: 2,
        value: "20",
        state: "unselected"
      }, {
        id: 3,
        value: "50",
        state: "unselected"
      }, {
        id: 4,
        value: "100",
        state: "unselected"
      }
    ],
    selectedMoney: "",
    picUrl: '',
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: 0,
        y: (height - 95) / 2,
        width: width,
        height: 95
      }
    }
  },

  switchTab: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    const curIndex = e.currentTarget.dataset.idx;
    this.setData({
      currentNavtab: curIndex
    });
  },
  changeMode: function(){
    this.setData({
      recordMode: !this.data.recordMode
    });
  },
  
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },

  getCropperImage() {
    let that = this;
    this.setData({
      hideCropper: true
    })
    this.wecropper.getCropperImage((tempFilePath) => {
      if (tempFilePath) {
        console.log(tempFilePath)

        wx.showLoading({
          title: '图片上传中...'
        });
        wx.uploadFile({
          url: apiUrl.UPLOAD_FILE,
          filePath: tempFilePath,
          header: {
            'content-type': 'multipart/form-data',
            'sessionKey': app.globalData.sessionKey
          },
          name: 'file',
          formData: {
            'fileType': 1
          },
          success: function (uploadData) {
            const parsrData = JSON.parse(uploadData.data);
            console.log('图片上传成功', parsrData);
            wx.hideLoading();
            apiUrl.responseCodeCallback(parsrData.responseCode, parsrData.responseDesc, parsrData.data);
            if (parsrData.responseCode == 2000) {
              that.setData({
                picUrl: parsrData.data.fileName
              })
            }
          },
          fail: function () {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              duration: 1500,
              image: '../../images/caution.png'
            })
          }
        })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },

  cancelSelected: function(){
    this.setData({
      hideCropper: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.record']) {
          that.setData({ recordAuth: true })
        }
      }
    })

    const { cropperOpt } = this.data

    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
      
  },

  voiceStartRecordCRP(e) {
    let that = this;
    if (this.data.recordAuth) {
      this.setData({
        pageY: e.changedTouches[0].pageY
      })
      this.setData({
        hideRecordToast: false
      })
      recordTimer = setInterval(function () {
        if (that.data.recordTime > 0){
          that.setData({
            recordTime: that.data.recordTime - 1
          })
        }
      },1000)
      console.log('start record');
      recorderManagerCreate.start({
        duration: 10000,
        format: 'mp3',
        sampleRate: 16000,
        encodeBitRate: 25600,  //75000
        numberOfChannels: 1
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '小程序录音功能需要获取录音权限',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success: function (data) {
                if (data) {
                  if (data.authSetting["scope.record"] == true) {
                    that.setData({
                      recordAuth: true
                    })
                  } else {
                    that.setData({
                      recordAuth: false
                    })
                  }
                }
              }
            })
          }
        }
      })
    }
  },

  voiceEndRecordCRP(e) {
    // console.log(e)
    console.log('stop record');
    this.setData({
      hideRecordToast: true
    })
    clearInterval(recordTimer);
    this.setData({ recordTime: 10 })
    recorderManagerCreate.stop();
  },

  voiceEndRecordMoveCRP(e) {
    if (e.changedTouches[0].pageY > this.data.pageY + 7) {
      // console.log(e)
      console.log('stop record');
      this.setData({
        hideRecordToast: true
      })
      clearInterval(recordTimer);
      this.setData({ recordTime: 10 })
      recorderManagerCreate.stop();
    }
  },
  
  onVoiceStopCRP(voiceInfo) {
    let that = this;
    const { duration, tempFilePath } = voiceInfo;

    console.log(voiceInfo);
    // 不允许小于 1 秒
    if (duration < 1000) {
      wx.showToast({
        title: '录制时间太短',
        duration: 1500,
        mask: true,
        image: '../../images/caution.png'
      })
      return;
    } else {
      that.setData({
        hideRecordToast: true
      })

      wx.showLoading({
        title: '录音上传中...',
        mask: true
      });

      wx.uploadFile({
        url: apiUrl.UPLOAD_FILE,
        filePath: tempFilePath,
        header: {
          'content-type': 'multipart/form-data',
          'sessionKey': app.globalData.sessionKey
        },
        name: 'file',
        formData: {
          'fileType': 2
        },
        success: function (uploadData) {
          const parsrData = JSON.parse(uploadData.data);
          console.log('录音上传成功', JSON.parse(uploadData.data));
          wx.hideLoading();
          apiUrl.responseCodeCallback(parsrData.responseCode, parsrData.responseDesc, parsrData.data);
          if (parsrData.responseCode == 2000) {
            // getUserInfo(app, that, null);
            that.setData({
              recordFileMsg : {
                voice: parsrData.data.fileName,
                voiceTxt: parsrData.data.videoTxt,
                voiceTime: Math.ceil(duration),
                sign: parsrData.data.sign,
              }
            })
            console.log({
              voice: parsrData.data.fileName,
              voiceTxt: parsrData.data.videoTxt,
              voiceTime: Math.ceil(duration),
              sign: parsrData.data.sign,
            })
            
          }
        },
        fail: function (err) {
          wx.hideLoading();
          wx.showModal({
            title: 'wx.saveFile提示',
            content: err,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.onPullDownRefresh()
              }
            }
          })
        }
      })
    }
  },

  selectMoney: function(e){
    const selectedMoney = this.data.recommendMoney[e.target.dataset.id].value;
    const newArr = this.data.recommendMoney.map(item => {
      if (item.id == e.target.dataset.id){
        return {
          ...item,
          state: "selected"
        }
      }else {
        return {
          ...item,
          state: "unselected"
        }
      }
    });
    this.setData({
      recommendMoney: newArr,
      selectedMoney: selectedMoney
    })
  },
  showOptions: function(){
    this.setData({
      optionsState: !this.data.optionsState,
    })
  },
  hideOptions: function(){
    this.setData({
      optionsState: true,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.pointInfo.showStatus != 2) {
      wx.showModal({
        title: '友情提示',
        showCancel: false,
        confirmText: '知道了',
        content: '神马口令仅用于娱乐休闲使用，严禁发布包含污秽、色情、违禁、谣言等不良信息，一经发现永久封号，系统将自动屏蔽删除不良信息。'
      })
    }
    
    let that = this;
    getUserInfo(app, that, null);
    recorderManagerCreate.onStop(this.onVoiceStopCRP);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '这个语音口令红包太好玩了，说语音口令，领现金红包！',
      path: '/pages/square/square?shareId=' + app.globalData.pointInfo.id,
      imageUrl: '../../images/share_cut.jpg',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          image: '../../images/caution.png',
          duration: 2000
        })
      }
    }
  },

  limitInput: (e) => {
    const value = e.detail.value;
    if (value.toString().split(".")[1] && value.toString().split(".")[1].length > 2 ){
      return Number(value).toFixed(2);
    }
  },
  tokenInput: (e) => {
    return e.detail.value.replace(/[^\u4E00-\u9FA5]/g, '')
  },
  answerInput: (e) => {
    return e.detail.value.replace(/[^\u4E00-\u9FA5]/g, '')
  },

  selectToken: function(e){
    this.setData({
      optionsState: true,
      selectedToken: e.currentTarget.dataset.content
    })

  },

  uploadPic: function(){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0];
        that.wecropper.pushOrign(tempFilePath);
        that.setData({
          hideCropper: false
        })
      }
    })
  },

  deletePic: function(){
    this.setData({
      picUrl: ''
    })
  },

  /**
   * 表单提交
   */
  formSubmit: function (e) {
    let that = this;
    console.log('form发生了submit事件：', e.detail.value);
    this.setData({
      formId: e.detail.formId
    })
    const token = e.detail.value.token.replace(/(^\s*)|(\s*$)/g, "");
    const question = e.detail.value.question.replace(/(^\s*)|(\s*$)/g, "");
    const answer = e.detail.value.answer.replace(/(^\s*)|(\s*$)/g, "");
    let isOpen = 2, isAnonymous = 2, useCash = 2;
    if (e.detail.value.checkbox.indexOf('open') != -1){ isOpen = 1 }
    if (e.detail.value.checkbox.indexOf('anonymous') != -1) { isAnonymous = 1 }
    if (e.detail.value.cashCheck.indexOf('cash') != -1) { useCash = 1 }
    
    for (let i = 0; i < f_words.length; i++) {
      if ((!that.data.recordMode && this.data.currentNavtab == 0 && token.indexOf(f_words[i]) != -1 )
        || (this.data.currentNavtab == 1 && (question.indexOf(f_words[i]) != -1 || answer.indexOf(f_words[i]) != -1) )){
        wx.showModal({
          title: '提示',
          content: '内容中疑似包含污秽、色情、违禁、谣言等不良信息，请修改后再发布。',
          showCancel: false
        })

        return;
      }
    }

    let isRight = false;

    if (!token && this.data.currentNavtab == 0 && !that.data.recordMode) {
      wx.showModal({
        title: '提示',
        content: '请输入语音口令',
        showCancel: false
      })
    } else if (!that.data.recordFileMsg && this.data.currentNavtab == 0 && that.data.recordMode) {
      wx.showModal({
        title: '提示',
        content: '请录制语音口令',
        showCancel: false
      })
    } else if (!question && this.data.currentNavtab == 1) {
      wx.showModal({
        title: '提示',
        content: '请输入你的问题',
        showCancel: false
      })
    } else if (!answer && this.data.currentNavtab == 1) {
      wx.showModal({
        title: '提示',
        content: '请输入你的答案',
        showCancel: false
      })
    } else if (!e.detail.value.money) {
      wx.showModal({
        title: '提示',
        content: '请输入红包金额',
        showCancel: false
      })
    } else if (!e.detail.value.count) {
      wx.showModal({
        title: '提示',
        content: '请输入红包数量',
        showCancel: false
      })
    } else {
      if(!!this.data.picUrl){  //广告类型
        if (e.detail.value.money < 100 || (e.detail.value.money / e.detail.value.count) < 0.1){
          wx.showModal({
            title: '提示',
            content: '上传宣传图片的推广红包总金额不少于100元且人均不少于0.1元',
            showCancel: false
          })
        }else {
          isRight = true
        }
      } else {
        if (isOpen == 1 && (e.detail.value.money < 5 || (e.detail.value.money / e.detail.value.count) < 1)) {
          wx.showModal({
            title: '提示',
            content: '广场红包总金额金额不少于5元且人均不少于1元',
            showCancel: false
          })
        } else if (isOpen == 2 && (e.detail.value.money / e.detail.value.count) < 0.1){
          wx.showModal({
            title: '提示',
            content: '普通红包人均不少于0.1元',
            showCancel: false
          })
        } else {
          isRight = true
        }
      }
    }
    
    if(isRight) {
      wx.showModal({
        title: '提示',
        content: !!this.data.picUrl ? '添加宣传图片的推广红包需额外加收10%服务费，普通红包不收取服务费' : '确认支付'+ e.detail.value.money+'元',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '支付中...',
              mask: true
            });
            // if (res.confirm) {
            let submitMsg = {};
            if (that.data.currentNavtab == 0 && !that.data.recordMode){
              submitMsg = {
                content: token,
                money: e.detail.value.money,
                amount: e.detail.value.count,
                isPublic: isOpen,
                isHide: isAnonymous,
                redType: 1,
                payType: useCash,
                adverPic: that.data.picUrl,
                adverLink: that.data.picUrl ? e.detail.value.link : '',
                prepayId: e.detail.formId
              }
            } else if (that.data.currentNavtab == 0 && that.data.recordMode) {
              submitMsg = {
                content: that.data.recordFileMsg.voice,
                convertContent: that.data.recordFileMsg.voiceTxt,
                sign: that.data.recordFileMsg.sign,
                voiceTime: that.data.recordFileMsg.voiceTime,
                money: e.detail.value.money,
                amount: e.detail.value.count,
                isPublic: isOpen,
                isHide: isAnonymous,
                redType: 2,
                payType: useCash,
                adverPic: that.data.picUrl,
                adverLink: that.data.picUrl ? e.detail.value.link : '',
                prepayId: e.detail.formId
              }
            }else {
              submitMsg = {
                content: question,
                questionResult: answer,
                money: e.detail.value.money,
                amount: e.detail.value.count,
                isPublic: isOpen,
                isHide: isAnonymous,
                redType: 3,
                payType: useCash,
                adverPic: that.data.picUrl,
                adverLink: that.data.picUrl ? e.detail.value.link : '',
                prepayId: e.detail.formId
              }
            }
              console.log('发红包参数', submitMsg);

              wx.request({
                url: apiUrl.ADD_TXT_RED,
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded', // 默认值
                  'sessionKey': app.globalData.sessionKey
                },
                data: submitMsg,
                success: function (res) {
                  wx.hideLoading();
                  apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
                  if (res.data.responseCode == 2000) {
                    console.log(res);
                    const payMsg = res.data.data.payResult;
                    const payType = res.data.data.payType;
                    const redId = res.data.data.redId
                    // console.log(payMsg)
                    app.globalData.pointInfo.money = res.data.data.money;
                    that.setData({
                      pointInfo: app.globalData.pointInfo
                    })
                    if (payType == 1) {
                      wx.requestPayment({
                        'timeStamp': payMsg.timeStamp,
                        'nonceStr': payMsg.nonceStr,
                        'package': payMsg.package,
                        'signType': 'MD5',
                        'paySign': payMsg.paySign,
                        'success': function (wxres) {
                          //微信支付成功
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 1500,
                            complete: function () {
                              that.init(e);
                              if (that.data.pointInfo.showStatus && that.data.pointInfo.showStatus == 2){
                                wx.navigateTo({
                                  url: '/pages/redPacketDetail/redPacketDetail?redId=' + redId
                                })
                              } else {
                                wx.showModal({
                                  title: '提示',
                                  content: '红包已支付成功，请等待后台审核，审核通过可在【我的】-【红包记录】查看红包详情',
                                  showCancel:false
                                })
                              }
                            }
                          })
                        },
                        'fail': function (err) {

                        }
                      })
                    } else if (payType == 3) {
                      //余额支付完成
                      wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 1500,
                        mask: true,
                        complete: function () {
                          that.init(e);
                          if (that.data.pointInfo.showStatus && that.data.pointInfo.showStatus == 2) {
                            wx.navigateTo({
                              url: '/pages/redPacketDetail/redPacketDetail?redId=' + redId
                            })
                          } else {
                            wx.showModal({
                              title: '提示',
                              content: '红包已支付成功，请等待后台审核，审核通过可在【我的】-【红包记录】查看红包详情',
                              showCancel: false
                            })
                          }
                        }
                      })
                    }
                  }else {
                    wx.showToast({
                      title: '支付失败',
                      image: '../../images/caution.png',
                      duration: 2000
                    })
                  }
                },
                fail:function(){
                  wx.hideLoading();
                  wx.showToast({
                    title: '支付失败',
                    image: '../../images/caution.png',
                    duration: 2000
                  })
                }
              })
            // } else if (res.cancel) {
            //   console.log('用户点击取消')
            // }
          }
        },
      })

      
    }
  },

  init: function(e){
    console.log(e.detail.value)
    e.detail.value = {
      answer: "",
      cashCheck:[],
      checkbox: [],
      count: "",
      link:"",
      money: "",
      question: "",
      token: ""
    }
    
    this.setData({
      hideRecordToast: true,
      recordFileMsg: null,
      recordMode: false,
      currentNavtab: "0",
      hideCropper: true,
      pointInfo: {},
      optionsState: true,
      selectedToken: "",
      recommendMoney: this.data.recommendMoney.map(item => {
        return {
          ...item,
          state: "unselected"
        }
      }),
      selectedMoney: "",
      picUrl: '',
    })
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  }
})