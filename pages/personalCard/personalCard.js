// pages/personalCard/personalCard.js
const app = getApp();
const apiUrl = require('../../utils/constant.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: {}
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: apiUrl.GET_USER_CARD,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        userId: options.userId,
        redId: options.redId
      },
      success: function (res) {
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        if (res.data.responseCode == 2000) {
          that.setData({
            cardInfo: res.data.data
          })
        }
      },
      fail: function (err) {
        console.log('个人信息保存: ', err)
        wx.hideLoading();
      }
    })
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
  
  }
})