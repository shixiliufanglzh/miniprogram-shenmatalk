// pages/planDetail/planDetail.js
const app = getApp();
const apiUrl = require('../../utils/constant.js');
const regionData = require('../../utils/city.js');
const getUserInfo = require('../../utils/getUserInfo.js');
const WeCropper = require('../assets/we-cropper/we-cropper.js');

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 100

Page({

  /**
   * 页面的初始数据
   */
  data: {
    planId: 0,
    planDetail: {},
    provinceData: regionData.proData,

    ageRange: [],
    gender: '',
    system: '',
    // selectedPro: [],

    agePickArr: [],
    genderPickArr: ['不限','男', '女'],
    systemPickArr: ['不限','android', 'ios'],
    jobList: [
      {value: '教育',selected: false},
      {value: '家居',selected: false},
      {value: '房产',selected: false},
      {value: '美容',selected: false},
      {value: '汽车',selected: false},
      {value: '金融',selected: false},
      {value: '游戏',selected: false},
      {value: '旅游',selected: false},
      {value: '餐饮美食',selected: false},
      {value: '商家服务',selected: false},
      {value: '体育活动',selected: false},
      {value: '医疗健康',selected: false},
      {value: '孕产育儿',selected: false},
      {value: '娱乐休闲',selected: false},
      {value: '生活服务',selected: false},
      {value: '互联网/电子产品',selected: false},
      {value: '服饰鞋帽箱包',selected: false}
    ],
    marryList: [
      {value: '未婚',selected: false},
      {value: '新婚',selected: false},
      {value: '已婚',selected: false},
      {value: '育儿',selected: false}
    ],
    eduList: [
      {value: '小学',selected: false},
      {value: '初中',selected: false},
      {value: '高中',selected: false},
      {value: '大专',selected: false},
      {value: '本科',selected: false},
      {value: '硕士',selected: false},
      {value: '博士',selected: false}
    ],
    interestsList: [
      { value: '教育', selected: false },
      { value: '家居', selected: false },
      { value: '房产', selected: false },
      { value: '美容', selected: false },
      { value: '汽车', selected: false },
      { value: '金融', selected: false },
      { value: '游戏', selected: false },
      { value: '旅游', selected: false },
      { value: '餐饮美食', selected: false },
      { value: '商家服务', selected: false },
      { value: '体育活动', selected: false },
      { value: '医疗健康', selected: false },
      { value: '孕产育儿', selected: false },
      { value: '娱乐休闲', selected: false },
      { value: '生活服务', selected: false },
      { value: '互联网/电子产品', selected: false },
      { value: '服饰鞋帽箱包', selected: false }
    ],

    picUrl: '',
    localPicPath: '',
    hideCropper: true,
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: 0,
        y: (height - 95) / 2,
        width: width,
        height: 95
      }
    }
  },

  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },

  getCropperImage() {
    let that = this;
    this.setData({
      hideCropper: true
    })
    this.wecropper.getCropperImage((tempFilePath) => {
      if (tempFilePath) {
        console.log(tempFilePath)
        wx.showLoading({
          title: '图片上传中...'
        });
        wx.uploadFile({
          url: apiUrl.UPLOAD_FILE,
          filePath: tempFilePath,
          header: {
            'content-type': 'multipart/form-data',
            'sessionKey': app.globalData.sessionKey
          },
          name: 'file',
          formData: {
            'fileType': 1
          },
          success: function (uploadData) {
            const parsrData = JSON.parse(uploadData.data);
            console.log('图片上传成功', parsrData);
            wx.hideLoading();
            apiUrl.responseCodeCallback(parsrData.responseCode, parsrData.responseDesc, parsrData.data);
            if (parsrData.responseCode == 2000) {
              that.setData({
                picUrl: parsrData.data.fileName,
                localPicPath: tempFilePath
              })
            }
          },
          fail: function () {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              duration: 1500,
              image: '../../images/caution.png'
            })
          }
        })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },

  uploadPic: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0];
        that.wecropper.pushOrign(tempFilePath);
        that.setData({
          hideCropper: false
        })
      }
    })
  },

  deletePic: function () {
    this.setData({
      picUrl: '',
      localPicPath: ''
    })
  },

  bindAgeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.detail.value[1] <= e.detail.value[0]){
      wx.showModal({
        title: '提示',
        content: '最大年龄必须大于最小年龄',
        showCancel: false
      })
    }else {
      this.setData({
        ageRange: e.detail.value
      })
    }
  },
  bindGenderChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      gender: this.data.genderPickArr[e.detail.value]
    })
  },
  bindSystemChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      system: this.data.systemPickArr[e.detail.value]
    })
  },
  // selectJob: function (e) {
  //   const newArr = this.data.jobList.map((item, idx) => {
  //     if (idx == e.target.dataset.idx){
  //       return {
  //         ...item,
  //         selected: !item.selected
  //       }
  //     } else {
  //       return {
  //         ...item
  //       }
  //     }
  //   });
  //   this.setData({
  //     jobList: newArr
  //   })
  // },

  selectJob: function (e) {
    let selectedCount = 0;
    const jobList = this.data.jobList;
    for (let i = 0; i < jobList.length; i++) {
      if (jobList[i].selected) selectedCount++
    }
    const newArr = jobList.map((item, idx) => {
      if (idx == e.target.dataset.idx && !item.selected) {
        selectedCount++;
        if (selectedCount > 3) {
          wx.showModal({
            title: '提示',
            content: '职业最多选3项',
            showCancel: false
          })
          return {
            ...item,
            selected: false
          }
        } else {
          return {
            ...item,
            selected: true
          }
        }
      } else if (idx == e.target.dataset.idx && item.selected) {
        return {
          ...item,
          selected: false
        }
      } else {
        return {
          ...item
        }
      }
    });
    this.setData({
      jobList: newArr
    })
  },

  selectMarry: function (e) {
    const newArr = this.data.marryList.map((item, idx) => {
      if (idx == e.target.dataset.idx) {
        return {
          ...item,
          selected: !item.selected
        }
      } else {
        return {
          ...item
        }
      }
    });
    this.setData({
      marryList: newArr
    })
  },
  selectEdu: function (e) {
    const newArr = this.data.eduList.map((item, idx) => {
      if (idx == e.target.dataset.idx) {
        return {
          ...item,
          selected: !item.selected
        }
      } else {
        return {
          ...item
        }
      }
    });
    this.setData({
      eduList: newArr
    })
  },

  selectInterest: function (e) {
    let selectedCount = 0;
    const interestsList = this.data.interestsList;
    for (let i = 0; i < interestsList.length; i++) {
      if (interestsList[i].selected) selectedCount++
    }
    const newArr = interestsList.map((item, idx) => {
      if (idx == e.target.dataset.idx && !item.selected) {
        selectedCount++;
        if (selectedCount > 5) {
          wx.showModal({
            title: '提示',
            content: '兴趣最多选5项',
            showCancel: false
          })
          return {
            ...item,
            selected: false
          }
        } else {
          return {
            ...item,
            selected: true
          }
        }
      } else if (idx == e.target.dataset.idx && item.selected) {
        return {
          ...item,
          selected: false
        }
      } else {
        return {
          ...item
        }
      }
    });
    this.setData({
      interestsList: newArr
    })
  },

  selectCity: function(e){
    // console.log(e);
    let citySelArr = [...this.data.provinceData[e.currentTarget.dataset.pi].selected];
    //检查同一个省份下已有几个城市选中
    let cityCount = 0;
    for (let i = 0; i < citySelArr.length; i++ ){
      if (citySelArr[i]){ cityCount ++ }
    }

    let proCount = 0;
    for (let i = 0; i < provinces.length; i++) {
      if (provinces[i].selectAll || provinces[i].selected.indexOf(true) != -1) proCount++
    }

    if (!citySelArr[e.currentTarget.dataset.ci] && cityCount >=5){
      wx.showModal({
        title: '提示',
        content: '同一个省份下的城市只能全选或者选择任意5项',
        showCancel: false
      })
    // } else if (!citySelArr[e.currentTarget.dataset.ci] && cityCount <= 0 
    //   && !this.data.provinceData[e.currentTarget.dataset.pi].selectAll ) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '同一个省份下的城市只能全选或者选择任意5项',
    //     showCancel: false
    //   })git
    }else {
      citySelArr[e.currentTarget.dataset.ci] = !citySelArr[e.currentTarget.dataset.ci];
      const provinceData = this.data.provinceData.map((item,idx) => {
        if (idx == e.currentTarget.dataset.pi){
          return {
            ...item,
            selected: citySelArr
          }
        }else {
          return {
            ...item
          }
        }
      })
      this.setData({ provinceData })
    }
  },

  selectProvince: function(e){
    console.log(this.data.provinceData[e.currentTarget.dataset.pi].selectAll,e)
    let provinces = this.data.provinceData;
    let count = 0;
    for (let i = 0; i < provinces.length; i++ ){
      if (provinces[i].selectAll || provinces[i].selected.indexOf(true) != -1 ) count ++
    }

    if (!this.data.provinceData[e.currentTarget.dataset.pi].selectAll && count >= 5){
      wx.showModal({
        title: '提示',
        content: '最多只能选择5个省份或直辖市的相关地区',
        showCancel: false
      })
    }else {
      const arr = provinces.map((item,idx) => {
        if (e.currentTarget.dataset.pi == idx){
          return {
            ...item,
            selectAll: !item.selectAll,
            selected: item.selected.map(item => false)
          }
        }else {
          return {
            ...item
          }
        }
      })
      this.setData({
        provinceData: arr
      })
    }
  },
  // checkboxChange: function(e){
  //   console.log('checkbox发生change事件，携带value值为：', e)
    // this.setData({
    //   selectedPro: e.detail.value
    // })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置年龄范围
    let ageArr = [];
    for (let i = 0; i <= 150; i++) {
      ageArr.push(i);
    }
    
    const cities = this.data.provinceData.map((item,idx) => {
      const count = item.cities.length;
      let arr = [];
      for (let i = 0; i < count; i++) { arr.push(false) }
      return {
        ...item,
        selected: arr,
        selectAll: false
      }
    })

    this.setData({
      agePickArr: ageArr,
      provinceData: cities
    })

    // wx.getSystemInfo({
    //   success: function (res) {
    //     console.log('平台',res.platform)
    //   }
    // })

    console.log('options',options);
    let that = this;
    //初始化截图工具
    const { cropperOpt } = this.data
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
      })
      .updateCanvas();

    //获取计划数据
    if(!!options.planId){
      this.setData({
        planId: options.planId
      })
      wx.request({
        url: apiUrl.GET_PLAN_DETAIL,
        method: "GET",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'sessionKey': app.globalData.sessionKey
        },
        data: {
          planId: options.planId
        },
        success: function (res) {
          apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
          if (res.data.responseCode == 2000) {
            console.log('计划详情', res)
            that.setData({
              planDetail: res.data.data,
              localPicPath: res.data.data.adverPic,
              ageRange: [res.data.data.userMinAge, res.data.data.userMaxAge]
            })
          }
        },
        fail: function (err) {
          console.log('获取计划详情失败: ', err)
        }
      })
    }


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