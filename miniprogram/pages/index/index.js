//index.js
const app = getApp()
const { envList } = require('../../envList.js')
const db = wx.cloud.database()
const _ = db.command


Page({
  data:{
    navbarActiveIndex: 0,
    colors:['rgba(0,255,255,0.3)','rgba(0,144,144,0.3)','rgba(122,232,0,0.3)','rgba(96,0,255,0.3)'],
    blogs:[],
    navbarTitle: ["广场","我的"],
    tags:[],
    userInfo:0
  },

  switchToSettings:function(){
    wx.navigateTo({
      url: '../setting/index?'+
        'openid='+this.data.userInfo.openid,
    })
  },

  switchToTwitte:function(){
    wx.navigateTo({
      url: '../twitte/index?'+
        'openid='+this.data.userInfo.openid,
    })
  },


  onNavBarTap: function (event) {
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    this.setData({
      navbarActiveIndex: navbarTapIndex      
    })
  },

  loadnew:function(){
    
  },

  onBindAnimationFinish: function ({detail}) {
     this.setData({
      navbarActiveIndex: detail.current
    })
  },



  loadInfos:function(){
    var _this=this
    db.collection('tags').get({
      success:function(res){
        _this.setData({
          tags:res.data,
        })
      }
    })
    db.collection('blogs').orderBy('blog_id','desc').limit(10).get({
      success:function(res){
        _this.setData({
          blogs:res.data
        })
      }
    })  
  },

  loadmore:function(){
    var _this=this
    db.collection('tags').get({
      success:function(res){
        _this.setData({
          tags:res.data,
        })
      }
    })
    db.collection('blogs').orderBy('blog_id','desc').where({
      blog_id:_.lt(_this.data.blogs[_this.data.blogs.length-1].blog_id)
    }).limit(10).get({
      success:function(res){
        if(res.data.length){
          wx.showToast({
            title: '加载中',
            duration:800,
            mask:true,
            icon:'loading'
          })
        }
        var start = _this.data.blogs.length
        var end = _this.data.blogs.length+res.data.length
        var index = 0
        for(var i=start;i<end;i++){
          _this.setData({
            ['blogs['+i+']']:res.data[index]
          })
          index++
        }
      }
    })
  },

  checkUserInfo:function(){
    var _this = this
    wx.cloud.callFunction({
      name:'getOpenId'
    }).then(res => {
      db.collection('users').where({
        openid:res.result.openid
      }).get({
        success:function(res1){
          if(res1.data.length){
            app.globalData.openid = res.result.openid
            _this.setData({
              userInfo:res1.data[0]
            })
          }
          else{
            app.globalData.openid = res.result.openid
            db.collection('users').orderBy('id','desc').get({
              success:function(res2){
                db.collection('users').add({
                  data:{
                    openid:res.result.openid,
                    id:res2.data[0].id+1,
                    avator:'https://636c-cloud1-0g6qpnmt12dd3f17-1306623159.tcb.qcloud.la/avators/8b49e4dddb7447abc6cff3bf6d6cb3dc.jpeg?sign=264717b7501bc64513858b45e49535e6&t=1629875953',
                    username:(res2.data[0].id+1)+""
                  },
                  success:function(res3){
                    _this.setData({
                      userInfo:{
                        openid:res.result.openid,
                        id:res2.data[0].id+1,
                        avator:'https://636c-cloud1-0g6qpnmt12dd3f17-1306623159.tcb.qcloud.la/avators/8b49e4dddb7447abc6cff3bf6d6cb3dc.jpeg?sign=264717b7501bc64513858b45e49535e6&t=1629875953',
                        username:res2.data[0].id+1
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    })
  },


  async loadAll(){
    await this.checkUserInfo()
    await this.loadInfos()
  },
  
  onLoad:function(){
    this.loadAll()
  },

  onShow:function(){
  },
  onReady:function(){

  },

  onPullDownRefresh:function(){
    this.loadAll()
  }
})