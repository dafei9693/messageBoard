// pages/twitte/index.js
const db=wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    if_border:['border','no_border','no_border','no_border','no_border'],
    colors:['rgba(0, 255, 0, 0.3)','rgba(255, 192, 203,0.7)','rgba(0, 0, 255,0.3)','rgba(100, 149, 237,0.6)','rgba(128, 128, 128,0.3)'],
    userInfo:0,
    color_index:0,
    content:''
  },

  submit:function(e){
    var _this=this
    if(this.data.content.length==0 || this.data.content.length>120){
      wx.showModal({
        title:"提示",
        content:'请输入1到120个字符'
      })
    }
    else{
      var myTime = new Date()
      db.collection('blogs').orderBy('blog_id','desc').get({
        success:function(res){
          wx.showToast({
            title: '发布成功',
            duration:2000,
            mask:true
          })
          db.collection('blogs').add({
            data:{
              content:_this.data.content,
              bg_color:_this.data.colors[_this.data.color_index],
              ava_img:_this.data.userInfo.avator,
              thumbs:0,
              comments:0,
              user_id:_this.data.userInfo.id,
              username:_this.data.userInfo.username,
              blog_id:res.data[0].blog_id+1,
              time:myTime.toLocaleString()
            },
            success:function(res1){
              wx.navigateBack({
                delta: 1,
              })
            }
            
          }) 
        }
      })
     
    }
  },

  choose:function(e){
    var _this=this
    var x=[]
    for(var i=0;i<_this.data.if_border.length;i++){
      x[i]='no_border'
    }
    x[e.target.id] = 'border'
    _this.setData({
      if_border:x,
      color_index:e.target.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
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