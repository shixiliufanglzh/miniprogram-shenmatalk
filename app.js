//app.js
const reLogin = require('utils/login.js');
const apiUrl = require('utils/constant.js');

App({
  onLaunch: function (msg) {
    console.log('页面onLaunch')
    wx.setEnableDebug({
      enableDebug: true
    })

    let that = this;
    that.globalData.shareTicket = msg.shareTicket;
    if (msg.id){
      that.globalData.shareId = msg.query.id;
    }
    console.log('分享人ID:', msg.query.id);

    wx.showShareMenu({
      withShareTicket: true
    })

    wx.checkSession({
      success: function () {
        wx.getStorage({
          key: 'sessionKey',
          success: function (res) {
            that.globalData.sessionKey = res.data
          }
        })
        //session 未过期，并且在本生命周期一直有效
        // 获取用户信息
        wx.showLoading({
          title: "登录中..."
        });

        wx.login({
          success: function (loginData) {
            wx.hideLoading();
            wx.getSetting({
              success: res => {
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    data: { lang: 'zh_CN'},
                    success: res => {
                      console.log('微信后台拉取用户信息',res)
                      // 可以将 res 发送给后台解码出 unionId
                      that.globalData.userInfo = res.userInfo

                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      // if (that.userInfoReadyCallback) {
                      //   that.userInfoReadyCallback(res)
                      // }
                    }
                  })

                  wx.request({
                    url: apiUrl.GET_USER_INFO,
                    method: "GET",
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                      'sessionKey': that.globalData.sessionKey
                    },
                    success: function (res) {
                      apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
                      if (res.data.responseCode == 2000) {
                        console.log('自己后台拉取用户信息pointInfo', res);
                        that.globalData.pointInfo = {
                          aliAccount: res.data.data.aliAccount,
                          point: res.data.data.userPoint,
                          money: res.data.data.userMoney,
                          id: res.data.data.id
                        }
                      }
                    }
                  })
                } 
              }
            })
          },
          fail: function(){
            wx.hideLoading();
            wx.showToast({
              title: '登录失败',
              duration: 1500,
              image: 'images/caution.png'
            })
          }
        })
      },
      fail: function () {
        console.log('checkSession失败fail');        
        //登录态过期，调用登录接口
        reLogin(that, apiUrl);
        
      }
    })

    
  },

  // userInfoReadyCallback: (options) => {
    // console.log('没有及时获取');
  // },

  globalData:{
    shareId: 0,
    shareTicket: "",
    userInfo:null,
    sessionKey: "",
    pointInfo: ""
  }
})