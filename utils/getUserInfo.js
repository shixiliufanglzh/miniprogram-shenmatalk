// const app = getApp();
const apiUrl = require('constant.js');

module.exports = (app, that, callBack) => {
  wx.request({
    url: apiUrl.GET_USER_INFO,
    method: "GET",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'sessionKey': app.globalData.sessionKey
    },
    success: function (res) {
      apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
      if (res.data.responseCode == 2000) {
        console.log('pointInfo', res);
        app.globalData.pointInfo = {
          aliAccount: res.data.data.aliAccount,
          point: res.data.data.userPoint,
          money: res.data.data.userMoney,
          id: res.data.data.id
        }
        that.setData({
          pointInfo: app.globalData.pointInfo,
        })

        if (!!callBack){
          callBack();
        }
      }
    }
  })
}