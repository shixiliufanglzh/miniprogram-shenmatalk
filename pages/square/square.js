// pages/square/square.js
const app = getApp();
const apiUrl = require('../../utils/constant.js');
const pageSize = 50;
Page({

  /**
   * 页面的初始数据
   */

  data: {
    pageNum: 1,
    showPart: false,
    redPacketsList: [],
    animationData: {},
    pointInstruState: false,
    pointInfo: {}
  },

  toggleCheck: function(){
    const showPart = !this.data.showPart;
    console.log(showPart);
    const redStatus = showPart ? 2 : 1;
    this.getRedList(pageSize, this.data.pageNum, redStatus);
    
    this.setData({
      showPart: showPart,
      pageNum: 1
    })
    
  },

  //显示芝麻分说明
  showPointInstruction: function(){
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
  //隐藏芝麻分说明
  hidePointInstruction: function () {
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.bottom("-570rpx").step();
    this.setData({
      animationData: animation.export(),
      pointInstruState: false
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   pointInfo: app.globalData.pointInfo,
    // })
    // const redStatus = this.data.showPart ? 2 : 1;
    // this.getRedList(pageSize, this.data.pageNum, redStatus);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    console.log('初始化广场红包数据')
    this.setData({
      pointInfo: app.globalData.pointInfo,
    })
    const redStatus = this.data.showPart ? 2 : 1;
    this.getRedList(pageSize, this.data.pageNum, redStatus);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉刷新事件')
    let that = this;
    wx.showLoading({
      title: "加载中...",
      mask: true,
      success: function () {
        that.setData({
          pageNum: 1
        })
        const redStatus = that.data.showPart ? 2 : 1;
        that.getRedList(pageSize, 1, redStatus);
        // setTimeout(function () {
          wx.hideLoading()
          wx.stopPullDownRefresh()
        // }, 1000)
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // if ((this.data.redPacketsList.length % pageSize) == 0) {
    //   const addPageNum = this.data.pageNum + 1;
    //   this.setData({
    //     pageNum: addPageNum
    //   })

    //   const redStatus = this.data.showPart ? 2 : 1;
    //   this.getRedList(pageSize, this.data.pageNum, redStatus);
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '这个语音口令红包太好玩了，说语音口令，领现金红包！',
      path: '/pages/square/square?id=' + app.globalData.pointInfo.id,
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

  getRedList: function (pageSize, pageNum, redStatus){
    let that = this;
    wx.request({
      url: apiUrl.GET_PUBLIC_VOICE_RED,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        pageSize: pageSize,
        pageNum: pageNum,
        redStatus: redStatus
      },
      success: function (res) {
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data, that);
        if (res.data.responseCode == 2000) {
          const resData = res.data.data;
          console.log('获取红包第' + pageNum + '页列表', redStatus,resData);
          if (pageNum == 1){
            that.setData({
              redPacketsList: resData
            })
          }else {
            that.setData({
              redPacketsList: [...that.data.redPacketsList, ...resData]
            })
          }
        }
      }
    })
  },

  goToDetail: function(e){
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../redPacketDetail/redPacketDetail?redId=' + e.currentTarget.dataset.id
    })
  }
})