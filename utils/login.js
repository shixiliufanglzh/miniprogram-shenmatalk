// const app = getApp();
// const apiUrl = require('constant.js');

module.exports = (app, apiUrl, that) => {
  let _app = app;
  if(!app){
    _app = getApp();
  }

  wx.showLoading({
    title: "登录中..."
  });

  wx.login({
    success: function (loginData) {
      if (loginData.code) {
        console.log('wx.login返回数据',loginData)
        //登录
        wx.request({
          url: apiUrl.LOGIN,
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            code: loginData.code
          },
          success: function (res) {
            wx.hideLoading();
            console.log('自己后台登录返回数据', res.data.data)
            apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data, that);
            if (res.data.responseCode == 2000) {
              console.log('_app.globalData', _app.globalData)
              _app.globalData.sessionKey = res.data.data;
              //设置缓存保存sessionKey
              wx.setStorage({
                key: "sessionKey",
                data: res.data.data
              })
              //判断用户是否已经授权获取用户信息
              wx.getSetting({
                success: (scope) => {
                  console.log(scope);
                  if (!scope.authSetting["scope.userInfo"]) {
                    //如果没有授权
                    wx.getUserInfo({
                      data: {
                        lang: 'zh_CN',
                        withCredentials: true
                      },
                      success: function (userMsg) {
                        console.log(userMsg)
                        _app.globalData.userInfo = userMsg.userInfo
                        console.log('_app.globalData.shareId', _app.globalData.shareId)
                        wx.request({
                          url: apiUrl.REGISTER,
                          method: "POST",
                          header: {
                            'content-type': 'application/x-www-form-urlencoded', // 默认值
                            'sessionKey': _app.globalData.sessionKey
                          },
                          data: {
                            encryptedData: userMsg.encryptedData,
                            iv: userMsg.iv,
                            shareUserId: _app.globalData.shareId
                          },
                          success: function (regData) {
                            console.log(regData, _app.globalData.sessionKey)
                            apiUrl.responseCodeCallback(regData.data.responseCode, regData.data.responseDesc, regData.data.data, that);
                            if (regData.data.responseCode == 2000) {
                              wx.request({
                                url: apiUrl.GET_USER_INFO,
                                method: "GET",
                                header: {
                                  'content-type': 'application/x-www-form-urlencoded',
                                  'sessionKey': _app.globalData.sessionKey
                                },
                                success: function (res) {
                                  apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data, that);
                                  if (res.data.responseCode == 2000) {
                                    console.log('login页面pointInfo', res);
                                    _app.globalData.pointInfo = {
                                      aliAccount: res.data.data.aliAccount,
                                      point: res.data.data.userPoint,
                                      money: res.data.data.userMoney,
                                      id: res.data.data.id
                                    }
                                    console.log('login页面',that);
                                    if (that && that.onShow) that.onShow();
                                  }
                                }
                              })
                            }
                          }
                        })
                      },
                      fail: function (err) {
                        console.log(err)
                      }
                    })
                  } else {
                    //已授权
                    wx.getUserInfo({
                      data: { lang: 'zh_CN' },
                      success: function (userMsg) {
                        console.log(userMsg)
                        _app.globalData.userInfo = userMsg.userInfo
                      },
                      fail: function (err) {
                        console.log(err)
                      }
                    })

                    wx.request({
                      url: apiUrl.GET_USER_INFO,
                      method: "GET",
                      header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'sessionKey': _app.globalData.sessionKey
                      },
                      success: function (res) {
                        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data, that);
                        if (res.data.responseCode == 2000) {
                          console.log('login页面pointInfo', res);
                          _app.globalData.pointInfo = {
                            aliAccount: res.data.data.aliAccount,
                            point: res.data.data.userPoint,
                            money: res.data.data.userMoney,
                            id: res.data.data.id
                          }
                          console.log('login页面',that);
                          if (that && that.onShow) that.onShow();
                        }
                      }
                    })
                  }
                },
                fail: function(){
                  wx.hideLoading();
                  wx.showToast({
                    title: '登录失败',
                    duration: 1500,
                    image: '../images/caution.png'
                  })
                }
              })
            }else {
              wx.hideLoading();
            }
          },
          fail: function(){
            wx.hideLoading();
            wx.showToast({
              title: '登录失败',
              duration: 1500,
              image: '../images/caution.png'
            })
          }
        })

      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    },
    fail: function(){
      wx.hideLoading();
      wx.showToast({
        title: '登录失败',
        duration: 1500,
        image: '../images/caution.png'
      })
    }
  })
}