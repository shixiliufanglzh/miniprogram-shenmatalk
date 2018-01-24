// pages/ranking/ranking.js

const app = getApp();
const getUserInfo = require('../../utils/getUserInfo.js');
const apiUrl = require('../../utils/constant.js');
const pageSize = 20;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendPageNum: 1,
    receivePageNum: 1,
    navTab: ["今日土豪榜", "今日口才榜"],
    currentNavtab: "0",
    userSend: {
      name: "",
      avatar: "",
      money: "",
      rank: ""
    },
    userReceive: {
      name: "",
      avatar: "",
      money: "",
      rank: ""
    },
    sendRank: [],
    receiveRank: []
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
  onLoad: function () {
    
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
    this.setData({
      sendPageNum: 1,
      receivePageNum: 1
    })

    let that = this;
    getUserInfo(app, that, null);

    wx.request({
      url: apiUrl.GET_MY_RANKING,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        type: 1
      },
      success: function (res) {
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        if (res.data.responseCode == 2000) {
          console.log('统计', res)
          that.setData({
            userSend: {
              name: app.globalData.userInfo.nickName,
              avatar: app.globalData.userInfo.avatarUrl,
              money: res.data.data.money,
              rank: res.data.data.rank
            }
          })

          that.getSendList(pageSize, that.data.sendPageNum);
          that.getReceiveList(pageSize, that.data.receivePageNum);
          wx.request({
            url: apiUrl.GET_MY_RANKING,
            method: "GET",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'sessionKey': app.globalData.sessionKey
            },
            data: {
              type: 2
            },
            success: function (res) {
              apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
              if (res.data.responseCode == 2000) {
                console.log('统计', res)
                that.setData({
                  userReceive: {
                    name: app.globalData.userInfo.nickName,
                    avatar: app.globalData.userInfo.avatarUrl,
                    money: res.data.data.money,
                    rank: res.data.data.rank
                  }
                })
              }
            }
          })
        }
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
    let that = this;
    wx.showLoading({
      title: "加载中...",
      mask: true,
      success: function () {
        that.setData({
          sendPageNum: 1,
          receivePageNum: 1
        })
        that.onLoad();
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currentNavtab == 0 && ( this.data.sendRank.length % pageSize) == 0 ) {
      const addSendPageNum = this.data.sendPageNum + 1;
      this.setData({
        sendPageNum: addSendPageNum
      })
      console.log('sendPageNum', addSendPageNum);
      this.getSendList(pageSize, this.data.sendPageNum);
    } else if (this.data.currentNavtab == 1 && ( this.data.receiveRank.length % pageSize) == 0 ) {
      const addReceivePageNum = this.data.receivePageNum + 1;
      this.setData({
        receivePageNum: addReceivePageNum
      })
      this.getReceiveList(pageSize, addReceivePageNum);
      console.log('receivePageNum', addReceivePageNum);
    }
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

  getSendList: function (pageSize, pageNum) {
    let that = this;
    wx.request({
      url: apiUrl.GET_TODAY_LIST,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        pageSize: pageSize,
        pageNum: pageNum,
        type: 1
      },
      success: function (res) {
        console.log(res)
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        if (res.data.responseCode == 2000) {
          const resData = res.data.data;
          const sendList = resData.map(item => {
            return {
              name: item.userName,
              avatar: item.userPortrait,
              money: item.totalMoney
            }
          })
          if (that.data.sendPageNum == 1) {
            that.setData({
              sendRank: sendList
            })
          } else {
            that.setData({
              sendRank: [...that.data.sendRank, ...sendList]
            })
          }
        }
      }
    })
  },

  getReceiveList: function(pageSize, pageNum) {
    let that = this;
    wx.request({
      url: apiUrl.GET_TODAY_LIST,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        pageSize: pageSize,
        pageNum: pageNum,
        type: 2
      },
      success: function (res) {
        console.log(res)
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        if (res.data.responseCode == 2000) {
          const resData = res.data.data;
          const receiveList = resData.map(item => {
            return {
              name: item.userName,
              avatar: item.userPortrait,
              money: item.totalMoney
            }
          })
          if (that.data.receivePageNum == 1) {
            that.setData({
              receiveRank: receiveList
            })
          } else {
            that.setData({
              receiveRank: [...that.data.receiveRank, ...receiveList]
            })
          }
        }
      }
    })
  }
})