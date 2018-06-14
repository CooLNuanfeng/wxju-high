function Haniboi(canvas,words,type) {
    // this.setSize(),
    // this.preloadImages(),
    // this.init(),
    // this.prepareAndSave(!1),
    // this.groupChosen = "0"


    this.canvas = canvas;
    this.words = words;
    this.base = {};
    this.dimensions = null;
    this.type = type || 'square';
    this.transformed = true;
    this.imgs = [];

}
Haniboi.prototype.setSize = function(type) {
    "rectangle" === type ? this.dimensions = {
        canvas: {
            w: 850,
            h: 315
        },
        start: {
            image: {
                x: 310,
                y: -30
            },
            text: {
                x: 53,
                y: -55.5
            }
        },
        image: {
            gapX: 63,
            gapY: 24,
            w: 90,
            h: 177
        },
        text: {
            gapX: 44,
            gapY: -1.5,
            scaleX: 1.3,
            scaleY: 1,
            skewH: .635,
            skewV: -1.5,
            moveX: 190,
            moveY: 33,
            fontSizeZh: 25,
            fontSizeEn: 27
        },
        linebreak: {
            image: {
                x: -60,
                y: 44
            },
            text: {
                x: .4,
                y: 42.3
            }
        }
    } : "square" === type && (this.dimensions = {
        canvas: {
            w: 500,
            h: 500
        },
        start: {
            image: {
                x: 120,
                y: 40
            },
            text: {
                x: 4,
                y: 34.5
            }
        },
        image: {
            gapX: 50,
            gapY: 22,
            w: 76,
            h: 149
        },
        text: {
            gapX: 37.7,
            gapY: 1.4,
            scaleX: 1.3,
            scaleY: 1,
            skewH: .6,
            skewV: -1.5,
            moveX: 191,
            moveY: 32,
            fontSizeZh: 20,
            fontSizeEn: 23
        },
        linebreak: {
            image: {
                x: -52,
                y: 36
            },
            text: {
                x: -.8,
                y: 35.5
            }
        }
    });
}

Haniboi.prototype.init = function() {
    this.setSize(this.type);
    this.loadImages();

    this.base.ix = this.dimensions.start.image.x;
    this.base.iy = this.dimensions.start.image.y;
    this.base.tx = this.dimensions.start.text.x;
    this.base.ty = this.dimensions.start.text.y;
    this.ix = this.base.ix;
    this.iy = this.base.iy;
    this.tx = this.base.tx;
    this.ty = this.base.ty;

    this.processWords();
}

Haniboi.prototype.clearCanvas = function() {
    this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.init()
}

Haniboi.prototype.processWords = function() {

    var lines = 1,t = this;
    this.words = this.words.replace(/\n/g, "££");

    return this.words.split("").forEach(function(item,i){
        return "££" === item ? (t.ix = t.base.ix + t.dimensions.linebreak.image.x * t.lines,
            t.iy = t.base.iy + t.dimensions.linebreak.image.y * t.lines,
            t.tx = t.base.tx + t.dimensions.linebreak.text.x * t.lines,
            t.ty = t.base.ty + t.dimensions.linebreak.text.y * t.lines,
            t.lines = t.lines + 1) : t.createUnit(item)
    });
}

Haniboi.prototype.setBackground = function(bg, clicker) {

}

Haniboi.prototype.setGroup = function(t) {

}

Haniboi.prototype.getFileNames = function(t) {

}

Haniboi.prototype.loadImages = function() {
    for(var i=2;i<27;i++){
        i<10 ? i = '0'+i : i;
        // var src = 'https://xiaoming.yaoxingfuo.com/xiaoren/xiaoren2/materials/4'+ i + '.png';
        var src = '../images/4'+ i + '.png';
        this.imgs.push(src);
    }
}

Haniboi.prototype.randImg = function() {
    return this.imgs = this.shuffle(this.imgs)
}
Haniboi.prototype.shuffle = function(arr) {
    return arr.sort(function() {
        return .5 - Math.random()
    })
}

Haniboi.prototype.createUnit = function(t) {
    this.createMan(" " === t);
    // this.createText(t);
}

Haniboi.prototype.createText = function(t) {

}

Haniboi.prototype.createMan = function(t) {
    console.log(t);
    var i,_this = this;
    this.ix = this.ix + this.dimensions.image.gapX;
    this.iy = this.iy + this.dimensions.image.gapY;
    this.canvas.beginPath(),
    t ? (i = new Image).src = "../images/401.png" : i = this.randImg();
    console.log(i[1],'src');
    wx.getImageInfo({
        src: i[1],
        success: function (res) {
            console.log(res,'getImageInfo');
            _this.canvas.drawImage('../'+res.path, 0,0,500,500);
            _this.canvas.draw();
        },
        fail: function(){
            console.log('fail');
        }
    });
}


Haniboi.prototype.prepareAndSave = function(t) {

}


module.exports = Haniboi;
