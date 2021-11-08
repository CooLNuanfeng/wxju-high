// pages/index/index.js
const app = getApp()
import JuhighPeople from '../../libs/juhigh-people.js';
import JuhighText from '../../libs/juhigh-text.js';
import posJson from '../../libs/juhigh-pos.js';
import utils, {getCanvasContext} from '../../libs/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    words : '',
    peopleImg : '',
    textImg : '',
    type : 'square',
    bgColor: 'ffffff',
    resultImg: '',
    textHidden: false,
    awardUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var awardCanvas = wx.createCanvasContext('award-canvas');
      awardCanvas.drawImage('/images/award.jpg', 0, 0, 225, 225);
      awardCanvas.draw();
  },

  changeColor(e){
    let color = e.currentTarget.dataset.color
    this.setData({
      bgColor: color
    })
  },
  inputColor(evt){
      var color = evt.detail.value,
          re = /^[0-9a-fA-F]{6}$/;

      if(re.test(color)){
          this.bgColor = evt.detail.value;
      }else{
          this.bgColor = 'ffffff';
      }
  },
  focusColor(evt){
      var color = evt.detail.value;
      this.bgColor = color;
  },
  blurColor(evt){
      var color = evt.detail.value,
          re = /^[0-9a-fA-F]{6}$/;
      if(!color){
          this.bgColor = 'ffffff';
          return;
      }
      if(!re.test(color)){
          this.bgColor = 'ffffff';
          wx.showModal({
              title: '提示',
              content: '颜色值不正确，已改为默认的白色',
              showCancel: false
          })
      }
  },
  toClear(){
    var peopleCxt = wx.createCanvasContext('people-canvas'),
        textCxt = wx.createCanvasContext('text-canvas'),
          t = this.data,
          platform = app.globalData.platform;
      this.setData({
        words: '',
        bgColor: 'ffffff',
        textHidden: false,
      })
      peopleCxt.clearRect(0, 0, posJson[platform][t.type].canvas.w, posJson[platform][t.type].canvas.w);
      textCxt.clearRect(0, 0, posJson[platform][t.type].canvas.w, posJson[platform][t.type].canvas.w);
      peopleCxt.draw();
      textCxt.draw();
  },
  inputFn(evt) {
      let platform = app.globalData.platform;
      console.log(evt.detail)
      this.setData({
        words: evt.detail.value,
        textHidden: evt.detail.value
      })
      
      if (this.data.words.length >= 50) {
          wx.showModal({
            title: '提示',
            content: '为了图片更加美观，请保持在50个文字以内',
            showCancel: false
          })
      }else{
          // console.log(platform,'input');
          var peopleCxt = wx.createCanvasContext('people-canvas'),
                textCxt = wx.createCanvasContext('text-canvas'),
                t = this.data,
                txtJuhigh = new JuhighText(textCxt,t.words,platform),
                peoJuhigh = new JuhighPeople(peopleCxt,t.words,platform);


          txtJuhigh.init(()=>{
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                // destWidth: txtJuhigh.canvas.width,
                // destHeight: txtJuhigh.canvas.height,
                canvasId: 'text-canvas',
                success: (res) =>{
                    // console.log('end',res.tempFilePath);
                    this.setData({
                      textImg: res.tempFilePath
                    })
                },
                fail: function(){}
              })
          });
          peoJuhigh.init(()=>{
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                // destWidth: peoJuhigh.canvas.width,
                // destHeight: peoJuhigh.canvas.height,
                canvasId: 'people-canvas',
                success: (res) =>{
                    // console.log('end',res.tempFilePath);
                    this.setData({
                      peopleImg: res.tempFilePath
                    })
                },
                fail: function(){}
              })
          });

      }
  },
  toSave(method){

      var t = this.data,
      platform = app.globalData.platform,
      canvas = wx.createCanvasContext('canvas');


      if(!t.words){
          return;
      }

      canvas.width = posJson[platform][t.type].canvas.w;
      canvas.height = posJson[platform][t.type].canvas.h;

      if(t.bgColor !== 'transparent'){
          canvas.setFillStyle('#'+t.bgColor);
          canvas.fillRect(0, 0, canvas.width, canvas.height);
      }

      canvas.drawImage(t.peopleImg, 0,0,canvas.width/2,canvas.height/2);
      canvas.drawImage(t.textImg, 0,0,canvas.width/2,canvas.height/2);


      canvas.draw(false,function(){
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'canvas',
            success: function(res) {
                // console.log('draw end',res.tempFilePath);
                t.resultImg = res.tempFilePath;
                if(method == 'save'){
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function(){
                            wx.showToast({
                                title: '成功',
                                icon: 'success',
                                duration: 2000
                            });
                            setTimeout(()=>{
                                canvas.clearRect(0, 0, canvas.width, canvas.height);
                                canvas.draw();
                            },10);
                        }
                    })
                }else{
                    wx.previewImage({
                        current: t.resultImg,
                        urls: [t.resultImg]
                    });
                    setTimeout(()=>{
                        canvas.clearRect(0, 0, canvas.width, canvas.height);
                        canvas.draw();
                    },10);
                }

            },
            fail: function(){
              console.log('fail');
            }
          })
      })
  },
  toAward(){
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'award-canvas',
        success: function(res) {
            wx.previewImage({
                current: res.tempFilePath,
                urls: [res.tempFilePath]
            });
        }
      });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '举牌表情生成器',
      path: '/pages/index/index'
    }
  }
})