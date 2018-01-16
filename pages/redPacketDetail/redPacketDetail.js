// pages/redPacketDetail/redPacketDetail.js
const app = getApp();
const apiUrl = require('../../utils/constant.js');
const getUserInfo = require('../../utils/getUserInfo.js');
const pageSize = 20;

const recorderManager = wx.getRecorderManager();
let innerAudioContext = null;
let timer = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    redId: 0,
    redPacketDetail: {},
    pointInfo: {},
    animationData: {},
    hideRecordToast: true,
    pointInstruState: false,
    grabList: [],
    pageY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      redId: options.redId
    })
    recorderManager.onStop(this.onVoiceStop);
    // recorderManager.onFrameRecorded(res => {
    //     const { frameBuffer, isLastFrame } = res
        // const jsonString = JSON.stringify(res);
    //     console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    // });
  },

  voiceStartRecord(e) {                
    let that = this;
    this.setData({
      pageY: e.changedTouches[0].pageY
    })
    if (this.data.pointInfo.point > 0){
      this.setData({
        hideRecordToast: false
      })
      console.log('start record');
      recorderManager.start({
        duration: 30000,
        format: 'mp3',
        sampleRate: 16000,
        encodeBitRate: 25600,  //75000
        // frameSize: 2048,s
        numberOfChannels: 1
      });
    }else {
      wx.showModal({
        title: '提示',
        content: '您的神马分不足,点【确定】查看如何获得神马分',
        success: function (res) {
          if (res.confirm) {
            that.showPointInstruction();
          } else if (res.cancel) {
            
          }
        }
      })
    }
  },

  voiceEndRecord(e) {
    // console.log(e)
    console.log('stop record');
    this.setData({
      hideRecordToast: true
    })
    recorderManager.stop();
  },

  voiceEndRecordMove(e) {
    if (e.changedTouches[0].pageY > this.data.pageY + 7){
      // console.log(e)
      console.log('stop record');
      this.setData({
        hideRecordToast: true
      })
      recorderManager.stop();
    }
  },

  onVoiceStop(voiceInfo) {
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
    }else {
      wx.showLoading({
        title: '拼命抢红包中...',
        mask: true
      });
      // wx.saveFile({
      //   tempFilePath: tempFilePath,
      //   success: function (res) {
      //     let savedFilePath = res.savedFilePath
      //     console.log(res.savedFilePath);

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
              console.log('抢红包语言上传成功', JSON.parse(uploadData.data));
              wx.hideLoading();
              apiUrl.responseCodeCallback(parsrData.responseCode, parsrData.responseDesc, parsrData.data);
              if (parsrData.responseCode == 2000) {
                // getUserInfo(app, that, null);
                wx.request({
                  url: apiUrl.WIN_RED_PACKET,
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'sessionKey': app.globalData.sessionKey
                  },
                  data: {
                    redId: that.data.redId,
                    voice: parsrData.data.fileName,
                    voiceTxt: parsrData.data.videoTxt,
                    voiceTime: Math.ceil(duration),
                    sign: parsrData.data.sign, 
                  },
                  success: function (res) {
                    console.log('抢红包返回数据' + JSON.stringify(res))
                    getUserInfo(app, that, null);
                    apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
                    if (res.data.responseCode == 2000) {
                      // console.log(res);
                      wx.showModal({
                        title: '提示',
                        content: '恭喜您说对口令了,获得金额' + res.data.data + '元',
                        showCancel: false,
                        success: function(res){
                          if (res.confirm) {
                            that.onPullDownRefresh()
                          }
                        }                                                                                                                                  
                      })
                    }
                  },
                  fail: function(){
                    wx.hideLoading()
                  }
                })
              }
          //   },
          //   fail: function(err){
          //     wx.hideLoading();
          //     console.log('抢红包',err);
          //   }
          // })

            },
            fail: function(err){
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

  playVoice: function(e){
    if (!!timer){
      clearTimeout(timer);
    }
    if (!!innerAudioContext){
      innerAudioContext.stop();
    }

    let that = this;
    if (that.data.grabList[e.currentTarget.dataset.idx].isPlaying){
      const initialPlayState = that.data.grabList.map(item => {
        return {
          ...item,
          isPlaying: false
        }
      });
      that.setData({
        grabList: initialPlayState
      })
    }else {
      const initialPlayState = that.data.grabList.map((item,index) => {
        return {
          ...item,
          isPlaying: false
        }
      });
      that.setData({
        grabList: initialPlayState
      })

      innerAudioContext = null;
      innerAudioContext = wx.createInnerAudioContext();
      innerAudioContext.src = e.currentTarget.dataset.voiceUrl;
      innerAudioContext.play();

      //真机出现播放不停止的问题，用timeout兼容
      timer = setTimeout(function(){
        innerAudioContext.stop();
      }, (e.currentTarget.dataset.time*1.1+1)*1000)

      innerAudioContext.onPlay(() => {
        initialPlayState[e.currentTarget.dataset.idx].isPlaying = true;
        that.setData({
          grabList: initialPlayState
        })
        console.log('播放')
      })

      innerAudioContext.onStop(() => {
        console.log('停止');
        that.setData({
          grabList: that.data.grabList.map(item => {
            return {
              ...item,
              isPlaying: false
            }
          })
        })
      })

      innerAudioContext.onEnded(()=>{
        console.log('自然停止');
        that.setData({
          grabList: that.data.grabList.map(item => {
            return {
              ...item,
              isPlaying: false
            }
          })
        })
      })
    }
    
  },

  //获取领取人列表
  getGrabList: function (pageSize, pageNum){
    let that = this;
    wx.request({
      url: apiUrl.GET_VOICE_WIN_RECORD,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        pageSize: pageSize,
        pageNum: pageNum,
        redId: that.data.redId
      },
      success: function (res) {
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        if (res.data.responseCode == 2000) {
          const resData = res.data.data.map(item => {
            return {
              ...item,
              isPlaying: false,
              voiceTime: Math.round(item.voiceTime/1000)
            }
          });
          console.log(resData);
          that.setData({
            grabList: resData
          })
        }
      }
    })
  },

  goToEnchash: function(){
    wx.navigateTo({
      url: '../enchashment/enchashment'
    })
  },

  goToCreate: function () {
    wx.reLaunch({
      url: '../createRedPacket/createRedPacket'
    })
  },

  goToShare: function () {
    const redId = this.data.redId;
    wx.navigateTo({
      url: '/pages/share/share?redId=' + redId
    })
  },
  goSuggest: function(){
    wx.navigateTo({
      url: '/pages/suggestion/suggestion'
    })
  },

  //显示神马分说明
  showPointInstruction: function () {
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.bottom(0).step();
    this.setData({
      animationData: animation.export(),
      pointInstruState: true
    })
  },
  //隐藏神马分说明
  hidePointInstruction: function () {
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.bottom("-600rpx").step();
    this.setData({
      animationData: animation.export(),
      pointInstruState: false
    })
  },

  viewAvatar: function (e) {
    if (!!e.currentTarget.dataset.avatar) {
      wx.previewImage({
        current: e.currentTarget.dataset.avatar, // 当前显示图片的http链接
        urls: [e.currentTarget.dataset.avatar] // 需要预览的图片http链接列表
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let that = this;
    getUserInfo(app, that, null);

    wx.request({
      url: apiUrl.GET_VOICE_RED_DETAIL,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        redId: that.data.redId
      },
      success: function (res) {
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data, that);
        if (res.data.responseCode == 2000) {
          const resData = res.data.data;
          console.log(res);
          that.setData({
            redPacketDetail: resData
          })
        }
      }
    })

    this.getGrabList(pageSize, this.data.pageNum)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    if (!!timer) {
      clearTimeout(timer);
    }
    if (!!innerAudioContext) {
      innerAudioContext.stop();
    }
    this.setData({
      grabList: that.data.grabList.map(item => {
        return {
          ...item,
          isPlaying: false
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    if (!!timer) {
      clearTimeout(timer);
    }
    if (!!innerAudioContext) {
      innerAudioContext.stop();
    }
    this.setData({
      grabList: that.data.grabList.map(item => {
        return {
          ...item,
          isPlaying: false
        }
      })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (!!recorderManager){
      this.setData({
        hideRecordToast: true
      })
      recorderManager.stop();
    }

    let that = this;
    wx.showLoading({
      title: "加载中...",
      mask: true,
      success: function () {
        that.setData({
          pageNum: 1
        })
        that.onShow();

        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if ((this.data.grabList.length % pageSize) == 0) {
      const addPageNum = this.data.pageNum + 1;
      this.setData({
        pageNum: addPageNum
      })
      this.getGrabList(pageSize, this.data.pageNum);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.redPacketDetail.userName +'发了一个语音口令红包，赶快去领赏吧！',
      path: '/pages/redPacketDetail/redPacketDetail?redId=' + this.data.redId +'&shareId=' + app.globalData.pointInfo.id,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          mask: true,
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          mask: true,
          image: '../../images/caution.png',
          duration: 2000
        })
      }
    }
  }
})