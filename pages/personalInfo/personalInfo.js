// pages/personalInfo/personalInfo.js
const app = getApp();
const apiUrl = require('../../utils/constant.js');
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
    pointInfo: {},

    agePickArr : [],
    genderPickArr : ['男','女'],
    careerPickArr : ['工作1','工作2'],
    marryPickArr: ['未婚','新婚','已婚','育儿'],
    eduPickArr: ['小学', '初中', '高中', '大专', '本科', '硕士', '博士'],
    interestsList: [
      {
        value: '教育',
        selected: false
      },
      {
        value: '家居',
        selected: false
      },
      {
        value: '房产',
        selected: false
      },
      {
        value: '美容',
        selected: false
      },
      {
        value: '汽车',
        selected: false
      },
      {
        value: '金融',
        selected: false
      },
      {
        value: '游戏',
        selected: false
      },
      {
        value: '旅游',
        selected: false
      },
      {
        value: '餐饮美食',
        selected: false
      },

      {
        value: '商家服务',
        selected: false
      },
      {
        value: '体育活动',
        selected: false
      },
      {
        value: '医疗健康',
        selected: false
      },
      {
        value: '孕产育儿',
        selected: false
      },
      {
        value: '娱乐休闲',
        selected: false
      },
      {
        value: '生活服务',
        selected: false
      },
      {
        value: '互联网/电子产品',
        selected: false
      },
      {
        value: '服饰鞋帽箱包',
        selected: false
      }
    ],
    
    age: '',
    gender: '',
    career: '',
    marry: '',
    edu: '',
    region: ['','',''],
    interests: '',

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
        y: (height - 375) / 2,
        width: width,
        height: 375
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

  cancelSelected: function () {
    this.setData({
      hideCropper: true
    })
  },

  inputAccount: function (e) {
    const value = e.detail.value.replace(/[^\x00-\xff]/g, '').replace(/(^\s*)|(\s*$)/g, "");
    this.setData({
      curInputAliAcc: value
    })
    return value
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindAgeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      age: this.data.agePickArr[e.detail.value]
    })
  },
  bindGenderChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      gender: this.data.genderPickArr[e.detail.value]
    })
  },
  bindMarryChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      marry: this.data.marryPickArr[e.detail.value]
    })
  },
  bindCareerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      career: this.data.careerPickArr[e.detail.value]
    })
  },
  bindEduChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      edu: this.data.eduPickArr[e.detail.value]
    })
  },
  selectInterest: function (e) {
    let selectedCount = 0;
    const interestsList = this.data.interestsList;
    for (let i = 0; i < interestsList.length; i++){
      if (interestsList[i].selected) selectedCount++
    }
    const newArr = interestsList.map((item,idx) => {
      if (idx == e.target.dataset.idx && !item.selected) {
        selectedCount ++;
        if (selectedCount > 5){
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

  formSubmit: function (e) {
    let that = this;
    console.log('form发生了submit事件：', e.detail.value);
    const sendPara = {}
    //名片信息
    if(this.data.picUrl){
      sendPara.userPortrait = this.data.picUrl;
    }
    if (e.detail.value.nickname) {
      sendPara.userName = e.detail.value.nickname;
    }
    if (e.detail.value.company) {
      sendPara.companyName = e.detail.value.company;
    }
    if (e.detail.value.phone) {
      sendPara.contact = e.detail.value.phone;
    }
    if (e.detail.value.wechat) {
      sendPara.wxAccount = e.detail.value.wechat;
    }
    if (e.detail.value.present) {
      sendPara.introduce = e.detail.value.present;
    }
    //完善信息
    wx.getSystemInfo({
      success: function (res) {
        sendPara.phoneSys = res.platform;
      }
    })
    if (e.detail.value.age) {
      sendPara.userAge = e.detail.value.age;
    }
    if (e.detail.value.gender) {
      sendPara.userSex = e.detail.value.gender;
    }
    if (e.detail.value.career) {
      sendPara.userJob = e.detail.value.career;
    }
    if (e.detail.value.marry) {
      if (e.detail.value.marry == "未婚") { sendPara.marriageStatus = 1}
      else if (e.detail.value.marry == "新婚") { sendPara.marriageStatus = 2 }
      else if (e.detail.value.marry == "已婚") { sendPara.marriageStatus = 3 }
      else if (e.detail.value.marry == "育儿") { sendPara.marriageStatus = 4 }
      else { sendPara.marriageStatus = 0 }
      // sendPara.marriageStatus = e.detail.value.marry;
    }
    if (e.detail.value.edu) {
      sendPara.education = e.detail.value.edu;
    }
    if (this.data.region) {
      sendPara.province = this.data.region[0];
      sendPara.city = this.data.region[1];
      sendPara.district = this.data.region[2];
    }
    if (this.data.interestsList.length > 0) {
      let addInterests = [];
      for (let i = 0; i < this.data.interestsList.length; i++){
        if (this.data.interestsList[i].selected){
          addInterests.push(this.data.interestsList[i].value);
        }
      }
      sendPara.interest = addInterests.join(',');
    }
    console.log(sendPara);
    wx.showLoading({
      title: '保存中...',
      mask: true
    });
    wx.request({
      url: apiUrl.EDIT_USER_INFO,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: sendPara,
      success: function (res) { 
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        wx.hideLoading();
        if (res.data.responseCode == 2000) {
          console.log('提交成功',res)
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500,
            mask: true,
            complete: function () {
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                })
              },1500)
            }
          })
        }
      },
      fail:function(err){
        console.log('个人信息保存: ',err)
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ageArr = [];
    for(let i=1; i<=150; i++){
      ageArr.push(i);
    }
    const pointInfo = app.globalData.pointInfo;
    const interets = !!pointInfo.interest ? pointInfo.interest.split(',') : '';
    this.setData({
      agePickArr: ageArr,
      pointInfo: pointInfo,
      localPicPath: pointInfo.userPortrait,
      age: !!pointInfo.userAge ? pointInfo.userAge : '',
      gender: !!pointInfo.userSex ? pointInfo.userSex : '',
      career: !!pointInfo.userJob ? pointInfo.userJob : '',
      marry: !!pointInfo.marriageStatus ? this.state.marryPickArr[pointInfo.marriageStatus - 1] : '',
      edu: !!pointInfo.education ? pointInfo.education : '',
      region: !!pointInfo.city ? [pointInfo.province, pointInfo.city, pointInfo.district] : '',
      interests: interets,
    })

    if (!!interets){
      const newArr = this.data.interestsList.map((item, idx) => {
        if (interets.indexOf(item.value) != -1) {
            return {
              ...item,
              selected: true
            }
        } else {
          return {
            ...item,
            selected: false
          }
        }
      });
      this.setData({
        interestsList: newArr
      })
    }

    const { cropperOpt } = this.data

    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
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