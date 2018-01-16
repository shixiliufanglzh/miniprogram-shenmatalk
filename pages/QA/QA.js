// pages/q&a/q&a.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listContent: [
      {
        q: "语音口令怎么玩？",
        a: "一款利用语音识别技术开发的说口令娱乐小程序，您可以设置领取奖励的语音口令，好友说对口令才能领到奖励。",
        showAnswer: false
      },
      {
        q: "好友可以转发我的口令吗？",
        a: "可以的，您分享给好友或者转发到微信群的口令红包，其他好友均可再次转发。",
        showAnswer: false
      },
      {
        q: "我支付了但没有发出去怎么办？",
        a: " 请在【我的】-【红包记录】找对应口令记录，点击进入详情页，点击【去分享】把口令红包发送给好友或微信群。",
        showAnswer: false
      },
      {
        q: "未领取的红包金额会怎么处理？",
        a: "未领取的红包金额会在120小时后，自动退回神马说说的账户余额中。",
        showAnswer: false
      },
      {
        q: "账户余额如何提现？",
        a: "请在【我的】-【余额提现】页面进行提现，每次至少1元，每天最多3次，提现收取2%的服务费；申请提现后会在1-5个工作日内到账。",
        showAnswer: false
      }, 
      {
        q: "神马分有什么用？",
        a: "神马分用于抢广场红包，每抢一次广场红包将消耗1个神马分。",
        showAnswer: false
      },
      {
        q: "如何获得神马分？",
        a: "分享口令红包或红包广场页面到群聊邀请朋友来玩，每当有一个新用户点进来您可以获得3个神马分；每发1元广场红包（非推广红包）奖励1神马分；每日凌晨将为神马分不足10个的用户补满10个神马分，即每人每天最多可获得10个神马分的奖励。",
        showAnswer: false
      },
      {
        q: "如何联系我们？",
        a: "点击【我的】-【在线客服】咨询，在线时间9:00-21:00，或者拨打客服电话021-54438577。",
        showAnswer: false
      }
    ]
  },

  toggleAnswer: function(e){
    const listContent = this.data.listContent.map((item,index) => {
      if (index == e.currentTarget.dataset.idx){
        return {
          ...item,
          showAnswer: !item.showAnswer
        }
      }else {
        return item
      }
    })
    this.setData({ listContent })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  }
})