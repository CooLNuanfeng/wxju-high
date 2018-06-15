import posJson from './juhigh-pos.js';

function Juhigh(canvas,words,type) {

    this.canvas = canvas;
    this.words = words;
    this.base = {};
    this.dimensions = null;
    this.type = type || 'square';
    this.imgs = [];
    this.drawcallback = null;

}


Juhigh.prototype.setSize = function(type) {
    "rectangle" === type ? this.dimensions = posJson.rectangle : "square" === type && (this.dimensions = posJson.square);
}

Juhigh.prototype.init = function(cb) {
    this.setSize(this.type);
    this.loadImages();

    this.base.ix = this.dimensions.start.image.x;
    this.base.iy = this.dimensions.start.image.y;

    this.ix = this.base.ix;
    this.iy = this.base.iy;

    this.drawCanvas();

    this.drawcallback = cb;
}

Juhigh.prototype.drawCanvas = function(){
    var t = this,lines = 1;

    t.words = t.words.replace(/\n/g, "£");

    var promise = t.words.split("").reduce((p,word)=>{
        return p.then(()=>{
            return new Promise((resolve,reject)=>{
                if(word === "£"){
                    t.ix = t.base.ix + t.dimensions.linebreak.image.x * lines;
                    t.iy = t.base.iy + t.dimensions.linebreak.image.y * lines;

                    lines = lines + 1;
                    resolve();
                }else{
                    var src, color;
                    " " === word ? src = "../images/401.png" : src = t.randImg();
                    wx.getImageInfo({
                        src: src,
                        success: function (res) {
                            t.ix = t.ix + t.dimensions.image.gapX;
                            t.iy = t.iy + t.dimensions.image.gapY;

                            t.canvas.drawImage('../'+res.path, t.ix, t.iy, t.dimensions.image.w, t.dimensions.image.h);

                            resolve();
                        },
                        fail: function(){
                            console.log('fail');
                            reject();
                        }
                    });
                }
            });
        });
    },Promise.resolve());

    promise.then(()=>{
        t.canvas.draw(false,function(){
            t.drawcallback && t.drawcallback();
        });
    }).catch((err)=>{
        console.log(err);
    })
}

Juhigh.prototype.clearCanvas = function() {
    this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Juhigh.prototype.loadImages = function() {
    for(var i=2;i<27;i++){
        i<10 ? i = '0'+i : i;
        var src = '../images/4'+ i + '.png';
        this.imgs.push(src);
    }
}

Juhigh.prototype.randImg = function() {
    var randArr = this.shuffle(this.imgs);
    return randArr[0];
}
Juhigh.prototype.shuffle = function(arr) {
    return arr.sort(function() {
        return .5 - Math.random()
    })
}


module.exports = Juhigh;
