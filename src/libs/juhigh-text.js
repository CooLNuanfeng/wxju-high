import posJson from './juhigh-pos.js';

function Juhigh(canvas,words,type) {

    this.canvas = canvas;
    this.words = words;
    this.base = {};
    this.dimensions = null;
    this.type = type || 'square';
    this.transformed = true;

    this.drawcallback = null;

}
Juhigh.prototype.setSize = function(type) {
    "rectangle" === type ? this.dimensions = posJson.rectangle: "square" === type && (this.dimensions = posJson.square);
}

Juhigh.prototype.init = function(cb) {
    this.setSize(this.type);

    this.canvas.width = this.dimensions.canvas.w;
    this.canvas.height = this.dimensions.canvas.h;

    this.base.tx = this.dimensions.start.text.x;
    this.base.ty = this.dimensions.start.text.y;

    this.tx = this.base.tx;
    this.ty = this.base.ty;

    this.drawCanvas();

    this.drawcallback = cb;
}

Juhigh.prototype.drawCanvas = function(){
    var t = this,lines = 1, color;

    t.words = t.words.replace(/\n/g, "£");

    t.canvas.transform(t.dimensions.text.scaleX, t.dimensions.text.skewH, t.dimensions.text.skewV, t.dimensions.text.scaleY, t.dimensions.text.moveX, t.dimensions.text.moveY);
    t.canvas.rotate(-.5 * Math.PI / 180);

    t.words.split("").forEach((word)=>{
        if(word === "£"){
            t.tx = t.base.tx + t.dimensions.linebreak.text.x * lines;
            t.ty = t.base.ty + t.dimensions.linebreak.text.y * lines;

            lines = lines + 1;
            return;
        }else{
            t.tx = t.tx + t.dimensions.text.gapX;
            t.ty = t.ty + t.dimensions.text.gapY;
            color = "♥" === color ? "#ca2626" : "❤" === color ? "#d92b6d" : "#40210f";
            t.canvas.fillStyle = color;
            t.canvas.textAlign = "center";
            t.canvas.beginPath();

            encodeURIComponent(word).length > 1 ? t.canvas.font = "900 " + t.dimensions.text.fontSizeZh + "px 'LiHei Pro','微软正黑体','Microsoft JhengHei'" : t.canvas.font = "bold " + t.dimensions.text.fontSizeEn + "px 'Conv_ITC Avant Garde Gothic LT Bold', 'Ariel Black', 'Ariel'";
            t.canvas.fillText(word, t.tx, t.ty);
            t.canvas.closePath();
        }

     });

     t.canvas.draw(false,function(){
         t.drawcallback && t.drawcallback();
     });

}



Juhigh.prototype.clearCanvas = function() {
    this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
}


module.exports = Juhigh;
