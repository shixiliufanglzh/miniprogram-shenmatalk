// pages/plan/plan.js
const app = getApp();
const apiUrl = require('../../utils/constant.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    planList: []
  },

  deletePlan: function(e){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该计划吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: apiUrl.DEL_PLAN,
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'sessionKey': app.globalData.sessionKey
            },
            data: {
              planId: e.currentTarget.dataset.planId,
            },
            success: function (res) {
              apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
              if (res.data.responseCode == 2000) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1500
                })
                setTimeout(function(){
                  that.onShow();
                },1500)
              }
            },
            fail: function(err){
              console.log('删除计划失败',err)
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.request({
    //   url: apiUrl.ADD_PLAN,
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //     'sessionKey': app.globalData.sessionKey
    //   },
    //   data: {
    //     planName: '第1个计划',
    //     userMarriage: 2,
    //     userMinAge: 27,
    //     userMaxAge: 34,
    //   },
    //   success: function (res) {
    //     apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
    //     if (res.data.responseCode == 2000) {
          
    //     }
    //   }
    // })

    
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
    wx.request({
      url: apiUrl.GET_PLAN_LIST,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {},
      success: function (res) {
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        if (res.data.responseCode == 2000) {
          console.log('计划列表', res)
          that.setData({
            planList: res.data.data
          })
        }
      },
      fail: function (err) {
        console.log('获取计划列表失败: ', err)
      }
    })
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