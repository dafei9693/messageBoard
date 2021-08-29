
// pages/setting/index.js
const db=wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
    if_hidden:1,
    nameText:"请输入昵称"
  },

  confirm:function(){
    var _this=this
    _this.setData({
      if_hidden:!_this.data.if_hidden,
    })
    if(_this.data.nameText.length>10 || _this.data.nameText.length==0){
      wx.showModal({
        title: '提示',
        content: '请输入1到10个字符',
      })
      _this.setData({
        nameText:'请输入昵称'
      })
    }
    else{
      db.collection('users').where({
        username:_this.data.nameText
      }).get({
        success:function(res){
          if(res.data.length == 1){
            wx.showModal({
              cancelColor: '提示',
              content:'昵称已被占用',
            })
            _this.setData({
              nameText:'请输入昵称'
            })
          }
          else{
            db.collection('users').where({
              openid:_this.data.userInfo.openid
            }).update({
              data:{
                username:_this.data.nameText
              },
              success:function(res){
                wx.showToast({
                  title: '修改成功',
                })
                db.collection('blogs').where({
                  user_id:_this.data.userInfo.id
                }).update({
                  data:{
                    username:_this.data.nameText
                  },
                  success:function(res11){
                    _this.setData({
                      'userInfo.username':_this.data.nameText,
                      nameText:'请输入昵称'
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  },

  showModel:function(){
    this.setData({
      if_hidden:!this.data.if_hidden
    })
  },

  changeAvator:function(){
    var _this=this
    var timestamp = Date.parse(new Date())
    wx.chooseImage({
      count: 1,
      success:function(res){
        wx.showToast({
          title: '上传中...',
          icon:'loading',
          mask:true,
          duration:2000
        })
        wx.cloud.deleteFile({
          fileList:[_this.data.userInfo.avator],
          success:function(res9){
            wx.cloud.uploadFile({
              cloudPath:'avators/'+_this.data.userInfo.id+'_'+timestamp+'.png',
              filePath: res.tempFilePaths[0],
              success:function(res1){
                db.collection('users').where({
                  openid:_this.data.userInfo.openid
                }).update({
                  data:{
                    avator:res1.fileID
                  },
                  success:function(res2){
                    _this.setData({
                      'userInfo.avator':res1.fileID
                    })
                    db.collection('blogs').where({
                      user_id:_this.data.userInfo.id
                    }).update({
                      data:{
                        ava_img:res1.fileID
                      },
                      success:function(res11){
                        console.log(res11)
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  clickImage:function(){
    wx.previewImage({
      urls: [this.data.userInfo.avator],
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    db.collection('users').where({
      openid:options.openid
    }).get({
      success:function(res){
        _this.setData({
          userInfo:res.data[0]
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