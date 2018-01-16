// pages/share/share.js

const app = getApp();
const apiUrl = require('../../utils/constant.js');
const ctx = wx.createCanvasContext('sharePage');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    redId: 0,
    sharePic: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    this.setData({
      userInfo: app.globalData.userInfo,
      redId: options.redId
    })
    this.createsharePic(options.redId);

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  showPic: function(e){
    console.log(e.currentTarget.dataset.picUrl)
    wx.previewImage({
      current: e.currentTarget.dataset.picUrl, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.picUrl] // 需要预览的图片http链接列表
    })
    // wx.hideLoading();
    // this.setData({
    //   showSharePic: !this.data.showSharePic
    // })
  },

  goSuggest: function () {
    wx.navigateTo({
      url: '/pages/suggestion/suggestion'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let that = this;
    // this.onLoad({
    //   redId: that.data.redId
    // });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // let that = this;
    // this.createsharePic(that.data.redId);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '这个语音口令红包太好玩了，说语音口令，领现金红包！',
      path: '/pages/redPacketDetail/redPacketDetail?redId=' + this.data.redId + '&shareId=' + app.globalData.pointInfo.id,
      // imageUrl: '../../images/share_cut.jpg',
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

  createsharePic: function(redId){
    wx.showLoading({
      title: '加载中...',
    })

    let that = this;
    wx.request({
      url: apiUrl.GET_VOICE_RED_DETAIL,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        redId: redId
      },
      success: function (res) {
        wx.hideLoading();
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        if (res.data.responseCode == 2000) {
          const resData = res.data.data;
          console.log(resData)
          that.setData({
            sharePic: resData.sharePic
          })
        }
      },
      fail: function(){
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '获取分享图片出错，请重新获取',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    })
  }
})