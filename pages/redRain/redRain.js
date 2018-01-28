// pages/redRain/redRain.js
let timer = null;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    count: 50,
    top: 0,
    left: 50,
    redList:[]
  },

  getRed: function(e){
    // console.log(e.currentTarget.dataset.idx);
    const idx = e.currentTarget.dataset.idx;
    // let redList = [ ...this.data.redList ];
    // const red = { ...redList[idx],open:true };
    // redList[idx] = red;
    const redList = this.data.redList.map((item,index) => {
      if(index == idx){
        return {
          ...item,
          open: true
        }
      }else {
        return item
      }
    })
    this.setData({
      redList
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let redList = [];
    for(let i=0; i<this.data.count; i++){
      const top = -Math.floor(1800 *Math.random());
      const left = Math.floor(650 *Math.random());
      const rotate = Math.floor(60 * Math.random());
      redList.push({
        top,
        left,
        rotate,
        open: false
      })
    }
    this.setData({
      redList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    timer = setInterval(function(){
      const redList = that.data.redList.map(item => {
        if (item.top<=1800){
          return {
            ...item,
            top: item.top + 8
          }
        }else {
          return {
            ...item,
            top: -Math.floor(1800 * Math.random()),
            open: false
          }
        }
      })
      
      that.setData({ redList })
    },16)
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