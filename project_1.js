var canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");
//天空背景图像
var bg=new Image();
bg.src="img/background.png";
//创建LOADING图像
var loading=[];
loading[0]=new Image();
loading[0].src="img/game_loading1.png";
loading[1]=new Image();
loading[1].src="img/game_loading2.png";
loading[2]=new Image();
loading[2].src="img/game_loading3.png";
loading[3]=new Image();
loading[3].src="img/game_loading4.png";
//创建HERO图像
var h=[];
h[0]=new Image();
h[0].src="img/hero1.png";
h[1]=new Image();
h[1].src="img/hero2.png";
h[2]=new Image();
h[2].src="img/hero_blowup_n1.png";
h[3]=new Image();
h[3].src="img/hero_blowup_n2.png";
h[4]=new Image();
h[4].src="img/hero_blowup_n3.png";
h[5]=new Image();
h[5].src="img/hero_blowup_n4.png";
//创建小飞机图像
var e1=[];
    e1[0]=new Image();
    e1[0].src="img/enemy1.png";
    e1[1]=new Image();
    e1[1].src="img/enemy1_down1.png";
    e1[2]=new Image();
    e1[2].src="img/enemy1_down2.png";
    e1[3]=new Image();
    e1[3].src="img/enemy1_down3.png";
    e1[4]=new Image();
    e1[4].src="img/enemy1_down4.png";
//创建中飞机图像
var e2=[];
e2[0]=new Image();
e2[0].src="img/enemy2.png";
e2[1]=new Image();
e2[1].src="img/enemy2_down1.png";
e2[2]=new Image();
e2[2].src="img/enemy2_down2.png";
e2[3]=new Image();
e2[3].src="img/enemy2_down3.png";
e2[4]=new Image();
e2[4].src="img/enemy2_down4.png";
//创建大飞机
var e3=[];
e3[0]=new Image();
e3[0].src="img/enemy3_n1.png";
e3[1]=new Image();
e3[1].src="img/enemy3_n2.png";
e3[2]=new Image();
e3[2].src="img/enemy3_down1.png";
e3[3]=new Image();
e3[3].src="img/enemy3_down2.png";
e3[4]=new Image();
e3[4].src="img/enemy3_down3.png";
e3[5]=new Image();
e3[5].src="img/enemy3_down4.png";
e3[6]=new Image();
e3[6].src="img/enemy3_down5.png";
e3[7]=new Image();
e3[7].src="img/enemy3_down6.png";
//声明游戏各个状态，以及当前游戏状态
var START=0;
var STARTING=1;
var RUNNING=2;
var PAUSE=3;
var GAMEOVER=4;
var state=START;
var WIDTH=480;
var HEIGHT=650;
var SCORE=0;
var LIFE=3;
var bulletImg=new Image();
bulletImg.src="img/bullet1.png";
/***数据对象*****/
var SKY={
    image:bg,
    width:480,
    height:852,
    speed:20
};
var LOADING={
    frames:loading,
    width:186,
    height:38,
    speed:400
};
var HERO={
    frames:h,
    width:99,
    height:124,
    speed:20,
    baseFrameCount:2
};
var E1={
    type:1,
    score:1,
    life:1,
    minSpeed:10,
    maxSpeed:30,
    frames:e1,
    width:57,
    height:51,
    baseFrameCount:1
};
var E2={
    type:2,
    score:4,
    life:4,
    minSpeed:30,
    maxSpeed:70,
    frames:e2,
    width:69,
    height:95,
    baseFrameCount:1
};
var E3={
    type:3,
    score:10,
    life:10,
    Speed:100,
    frames:e3,
    width:169,
    height:258,
    baseFrameCount:2
};
var BULLET={
    background:bulletImg,
    width:9,
    height:21,
    speed:50,
};
/****业务对象****/
var Bullet=function (config) {
    this.background=config.background;
    this.width=config.width;
    this.height=config.height;
    this.speed=config.speed;
    this.lastTime=0;
    this.x=hero.x+hero.width/2-this.width;
    this.y=hero.y-this.height;
    this.step=function () {
      var currentTime=new Date().getTime();
      if(currentTime-this.lastTime>=this.speed){
          this.y-=5;
          this.lastTime=currentTime;
      }
  };
    this.paint=function (ctx) {
      ctx.drawImage(this.background,this.x,this.y);
  };
    this.outOfBounds=function () {
      return this.y<-this.height;
  };
    this.canDelete=false;
};
var Loading=function (config) {
    this.frames=config.frames;
    this.width=config.width;
    this.height=config.height;
    this.x=0;
    this.y=HEIGHT-this.height;
    this.speed=config.speed;
    this.lastTime=0;
    this.frameIndex=0;
    this.frame=this.frames[0];
    this.step=function () {
        var currentTime=new Date().getTime();
        if(currentTime-this.lastTime>=this.speed){
            this.frame=this.frames[this.frameIndex];
            this.frameIndex++;
            if(this.frameIndex==this.frames.length){
                state=RUNNING;
            }
            this.lastTime=currentTime;
        }
    };
    this.paint=function (ctx) {
        ctx.drawImage(this.frame,this.x,this.y);
    }
};
var Sky=function(config) {
    this.image=config.image;
    this.width=config.width;
    this.height=config.height;
    this.speed=config.speed;
    this.x1=0;
    this.y1=0;
    this.x2=0;
    this.y2=-this.height;
    this.lastTime=0;
    this.step=function(){
        var currentTime=new Date().getTime();
        if(currentTime-this.lastTime>=this.speed){
            this.y1++;
            this.y2++;
            if(this.y1>=this.height){
                this.y1=-this.height;
            }
            if(this.y2>=this.height){
                this.y2=-this.height;
            }
            this.lastTime=currentTime;
        }
    };
    this.paint=function(ctx) {
      ctx.drawImage(this.image,this.x1,this.y1);
      ctx.drawImage(this.image,this.x2,this.y2);
    };
};
var Hero=function(config) {
    this.frames=config.frames;
    this.width=config.width;
    this.height=config.height;
    this.speed=config.speed;
    this.baseFrameCount=config.baseFrameCount;
    this.lastTime=0;
    this.x=(WIDTH-this.width)/2;
    this.y=HEIGHT-this.height;
    this.down=false;
    this.canDelete=false;
    this.frame=this.frames[0];
    this.frameIndex=0;
    this.bang=function () {
        this.down=true;
        this.frameIndex=this.baseFrameCount;
    };
    this.step=function () {
        var currentTime=new Date().getTime();
        if (currentTime-this.lastTime>=this.speed){
            if(this.down){
                 this.frame=this.frames[this.frameIndex];
                 this.frameIndex++;
                 if (this.frameIndex==this.frames.length){
                     this.canDelete=true;
                 }
            }else {
                this.frame=this.frames[this.frameIndex%this.baseFrameCount];
                this.frameIndex++;
            }
            this.lastTime=currentTime;
        }
    }
    this.paint=function (ctx) {
        ctx.drawImage(this.frame,this.x,this.y);
    }
    this.shootLastTime=0;
    this.shootInterval=500;
    this.shoot=function () {
        var currentTime=new Date().getTime();
        if(currentTime-this.shootLastTime>=this.shootInterval){
            bullets.push(new Bullet(BULLET));
            this.shootLastTime=currentTime;
        }
    };
};
var Enemy=function(config){
    this.down=false;
    this.canDelete=false;
    this.type=config.type;
    this.score=config.score;
    this.life=config.life;
    this.frames=config.frames;
    this.frameIndex=0;
    this.frame=this.frames[0];
    this.baseFrameCount=config.baseFrameCount;
    this.width=config.width;
    this.height=config.height;
    this.lastTime=0;
    if(config.minSpeed && config.maxSpeed){
      this.speed=Math.random()*(config.maxSpeed-config.minSpeed)+config.minSpeed;
  }else if(config.speed){
      this.speed=config.speed;
  }else {
      this.speed=null;
  }
    this.x=Math.random()*(WIDTH-this.width);
    this.y=-this.height;
    this.bang=function(){
        this.life--;
        if(this.life==0){
            this.down=true;
            this.frameIndex=this.baseFrameCount;
        }
    };
    this.step=function () {
      var currentTime=new Date().getTime();
      if(currentTime-this.lastTime>=this.speed){
          if(this.down){
              this.frame=this.frames[this.frameIndex];
              this.frameIndex++;
              if(this.frameIndex==this.frames.length){
                  this.canDelete=true;
                  SCORE+=this.score;
              }
          }else {
              this.frame=this.frames[this.frameIndex%this.baseFrameCount];
              this.frameIndex++;
              this.y++;
          }
          this.lastTime=currentTime;
      }
  };
    this.paint=function (ctx) {
        ctx.drawImage(this.frame,this.x,this.y);
    };
    this.outOfBounds=function () {
      return this.y>HEIGHT;
  };
    this.hit=function (component) {
      var c=component;
      return c.x+c.width/2>this.x-c.width/2&&c.x+c.width/2<this.width+this.x+c.width/2&&c.y+c.height/2>this.y-c.height/2&&c.y+c.height/2<this.y+this.height+c.height/2;
  };
};
var enemies=[];
var bullets=[];
var interval=1000;
var lastTime=0;
var componentEnter=function(){
    var currentTime=new Date().getTime();
    if(currentTime-lastTime>interval){
        var num=Math.floor(Math.random()*11);
        if(num<=7){
            enemies.push(new Enemy(E1));
        }else if(num==9||num==8){
            enemies.push(new Enemy(E2));
        }else if(num==10){
            if(enemies[0]==null||enemies[0].type!=3){
                enemies.splice(0,0,new Enemy(E3));
            }
        }
        lastTime=currentTime;
    }
};
var componentStep=function () {
    for(var i=0;i<enemies.length;i++){
        enemies[i].step();
    }
    for(var i=0;i<bullets.length;i++){
        bullets[i].step();
    }
};
var componentPaint=function (ctx) {
    for(var i=0;i<enemies.length;i++){
        enemies[i].paint(ctx);
    }
    for(var i=0;i<bullets.length;i++){
        bullets[i].paint(ctx);
    }
};
var componentDelete=function () {
    for(var i=0;i<enemies.length;i++){
        if(enemies[i].outOfBounds()||enemies[i].canDelete){
            enemies.splice(i,1);
        }
    }
    for(var i=0;i<bullets.length;i++){
        if(bullets[i].outOfBounds()||bullets[i].canDelete){
            bullets.splice(i,1);
        }
    }
    if(hero.canDelete){
        LIFE--;
        if(LIFE==0){
            state=GAMEOVER;
        }else {
            hero=new Hero(HERO);
        }
    }
};
/*创建对象*/
var l=new Loading(LOADING);
var sky=new Sky(SKY);
var hero=new Hero(HERO);
var checkHit=function(){
    for(var i=0;i<enemies.length;i++){
        if(enemies[i].down||enemies[i].canDelete){
            continue;
        }
        if(enemies[i].hit(hero)){
            enemies[i].bang();
            hero.bang();
        }
        for(var j=0;j<bullets.length;j++){
            if(enemies[i].hit(bullets[j])){
                enemies[i].bang();
                bullets[j].canDelete=true;
            }
        }
    }
};
setInterval(function () {
    sky.step();
    sky.paint(ctx);
    switch(state){
        case START:
            showLogo(ctx);
            break;
        case STARTING:
            l.step();
            l.paint(ctx);
            break;
        case RUNNING:
            componentEnter();
            componentStep();
            componentDelete();
            componentPaint(ctx);
            hero.step();
            hero.paint(ctx);
            hero.shoot();
            checkHit();
            drawText(ctx);
            break;
        case PAUSE:
            drawPause(ctx);
            drawText(ctx);
            hero.paint(ctx);
            componentPaint(ctx);
            break;
        case GAMEOVER:
            drawOver(ctx);
            break;
    }
},1000/100);
/*普通函数*/
var logo=new Image();
logo.src="img/start.png";
function showLogo(ctx){
    ctx.drawImage(logo,(WIDTH-logo.width)/2,(HEIGHT-logo.height)/2);
}
function drawText(ctx) {
    ctx.font="bold 24px Verdana";
    ctx.textAlign="left";
    ctx.textBaseline="hanging";
    ctx.fillText("SCORE:"+SCORE,20,10);
    ctx.fillText("LIFE:"+LIFE,370,10);
}
function drawOver(ctx) {
    ctx.font="bold 48px verdana";
    ctx.textAlign="left";
    var width=ctx.measureText("GAME OVER").width;
    var x=(WIDTH-width)/2;
    var y=(HEIGHT-48)/2;
    ctx.fillText("GAME OVER",x,y);

}
var pause=new Image();
pause.src="img/game_pause_nor.png";
function drawPause(ctx) {
    ctx.drawImage(pause,(WIDTH-pause.width)/2,(HEIGHT-pause.height)/2);
}
/*事件处理*/
canvas.onmouseout=function () {
    if(state==RUNNING){
        state=PAUSE;
    }
};
canvas.onmouseover=function () {
    if(state==PAUSE) {
        state = RUNNING;
    }
};
canvas.onclick=function(){
    if (state==START){
        state=STARTING;
    }
};
canvas.onmousemove=function (e) {
    if(state==RUNNING) {
        hero.x = e.offsetX - hero.width / 2;
        hero.y = e.offsetY - hero.height / 2;
    }
};
