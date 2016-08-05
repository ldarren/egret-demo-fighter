module game{
    export class Stage01 extends egret.DisplayObjectContainer{
        private loadingUI:LoadingUI
        private bg:game.BgMap
        private btn:egret.Bitmap
        private hero:game.Airplane
        private heroBullets:game.Bullet[]=[]
        private enemies:game.Airplane[]=[]
        private enemyBullets:game.Bullet[]=[]
        private enemyTimer:egret.Timer=new egret.Timer(5000)
        private scorePanel:ScorePanel
        private score:number=0
        private last:number

        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStage, this)
        }

        private addedToStage():void{
            RES.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStage, this)
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.resStage00Progress, this)
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.resStage00Loaded, this)
            this.loadingUI=new LoadingUI()
            this.addChild(this.loadingUI)
            RES.loadGroup('stage01')
        }

        private resStage00Progress(evt:RES.ResourceEvent):void{
            this.loadingUI.update(evt.itemsLoaded,evt.itemsTotal)
        }

        private resStage00Loaded(evt:RES.ResourceEvent):void{
            if ('stage01'!=evt.groupName) return
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.resStage00Progress, this)
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.resStage00Loaded, this)
            this.removeChild(this.loadingUI)
            this.createGameScene()
        }

        private createGameScene():void{
            this.bg=new game.BgMap()
            this.addChild(this.bg)

            var
            sw=this.stage.stageWidth,
            sh=this.stage.stageHeight,
            btn=game.createBitmapByName('btn_start'),
            hero=Airplane.Produce('f1',1000)

            var scorePanel=new ScorePanel()
            scorePanel.x = (sw-scorePanel.width)/2;
            scorePanel.y = 100;
            this.scorePanel=scorePanel

            hero.y=sh-hero.height-50
            hero.addEventListener('fire', this.fire, this)
            this.addChild(hero)
            this.hero=hero

            btn.x=(sw-btn.width)/2
            btn.y=(sh-btn.height)/2
            btn.touchEnabled=true
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this)
            this.btn=btn
            this.addChild(btn)
        }

        private gameStart():void{
            this.score=0
            this.hero.hp=10

            this.removeChild(this.btn)
            if(this.contains(this.scorePanel))this.removeChild(this.scorePanel)
            this.bg.start()

            this.enemyTimer.addEventListener(egret.TimerEvent.TIMER,this.spawnEnemy,this)
            this.enemyTimer.start()

            this.hero.startFire()

            this.touchEnabled=true
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.move, this)

            egret.startTick(this.update,this)
        }

        private spawnEnemy():void{
            var plane=Airplane.Produce('f2',2000)
            plane.x=Math.random()*(this.stage.width-plane.width)
            plane.y=-plane.height-Math.random()*300
            plane.addEventListener('fire', this.fire, this)
            plane.startFire()
            this.addChildAt(plane,this.numChildren-1)
            this.enemies.push(plane)
        }

        private fire(evt:egret.Event):void{
            var
            bullet:game.Bullet,
            plane=evt.target
            if (plane===this.hero){
                for(var i=0; i<2; i++){
                    bullet=game.Bullet.Produce('b1')
                    bullet.x=i ? plane.x+10 : plane.x+plane.width-22
                    bullet.y=plane.y+30
                    this.addChildAt(bullet, this.numChildren-1-this.enemies.length)
                    this.heroBullets.push(bullet)
                }
            }else{
                bullet=game.Bullet.Produce('b2')
                bullet.x=plane.x+28
                bullet.y=plane.y+10
                this.addChildAt(bullet, this.numChildren-1-this.enemies.length)
                this.enemyBullets.push(bullet)
            }
        }

        private update(t:number):boolean{
            if (!this.last){
                this.last=t
                return false
            }

            var
            d=t-this.last,
            i=0,
            h=this.stage.stageHeight,
            l:number,
            bullets:Bullet[],
            bullet:Bullet,
            planes:Airplane[],
            plane:Airplane

            this.last=t

            for(i=0,bullets=this.heroBullets,l=bullets.length; i<l; i++){
                bullet=bullets[i]
                if (bullet.y < -bullet.height){
                    this.removeChild(bullet)
                    Bullet.Reclaim(bullet)
                    bullets.splice(i,1)
                    i--
                    l--
                }
                bullet.y-=0.3*d
            }

            for(i=0,bullets=this.enemyBullets,l=bullets.length; i<l; i++){
                bullet=bullets[i]
                if (bullet.y > h){
                    this.removeChild(bullet)
                    Bullet.Reclaim(bullet)
                    bullets.splice(i,1)
                    i--
                    l--
                }
                bullet.y+=0.2*d
            }

            for(i=0,planes=this.enemies,l=planes.length; i<l; i++){
                plane=planes[i]
                if (plane.y > h){
                    this.removeChild(plane)
                    Airplane.Reclaim(plane)
                    planes.splice(i,1)
                    i--
                    l--
                }
                plane.y+=0.1*d
            }

            this.hitTest()
            return false
        }

        private hitTest():void{
            var i:number,j:number;
            var bullet:Bullet;
            var theFighter:Airplane;
            var myBulletsCount:number = this.heroBullets.length;
            var enemyFighterCount:number = this.enemies.length;
            var enemyBulletsCount:number = this.enemyBullets.length;
            //将需消失的子弹和飞机记录
            var delBullets:Bullet[] = [];
            var delFighters:Airplane[] = [];
            //我的子弹可以消灭敌机
            for(i=0;i<myBulletsCount;i++) {
                bullet = this.heroBullets[i];
                for(j=0;j<enemyFighterCount;j++) {
                    theFighter = this.enemies[j];
                    if(GameUtil.HitTest(theFighter,bullet)) {
                        theFighter.hp -= 2;
                        if(delBullets.indexOf(bullet)==-1)
                            delBullets.push(bullet);
                        if(theFighter.hp<=0 && delFighters.indexOf(theFighter)==-1)
                            delFighters.push(theFighter);
                    }
                }
            }
            //敌人的子弹可以减我血
            for(i=0;i<enemyBulletsCount;i++) {
                bullet = this.enemyBullets[i];
                if(GameUtil.HitTest(this.hero,bullet)) {
                    this.hero.hp -= 1;
                    if(delBullets.indexOf(bullet)==-1)
                        delBullets.push(bullet);
                }
            }
            //敌机的撞击可以消灭我
            for(i=0;i<enemyFighterCount;i++) {
                theFighter = this.enemies[i];
                if(GameUtil.HitTest(this.hero,theFighter)) {
                    this.hero.hp -= 10;
                }
            }
            if(this.hero.hp<=0) {
                this.gameStop();
            } else {
                while(delBullets.length>0) {
                    bullet = delBullets.pop();
                    this.removeChild(bullet);
                    if(bullet.texName=="b1")
                        this.heroBullets.splice(this.heroBullets.indexOf(bullet),1);
                    else
                        this.enemyBullets.splice(this.enemyBullets.indexOf(bullet),1);
                    Bullet.Reclaim(bullet);
                }
                this.score += delFighters.length;
                while(delFighters.length>0) {
                    theFighter = delFighters.pop();
                    theFighter.stopFire();
                    theFighter.removeEventListener("fire",this.fire,this);
                    this.removeChild(theFighter);
                    this.enemies.splice(this.enemies.indexOf(theFighter),1);
                    Airplane.Reclaim(theFighter);
                }
            }
        }

        private move(evt:egret.TouchEvent):void{
            var x=evt.localX
            x=Math.max(0,x)
            x=Math.min(this.stage.stageWidth-this.hero.width,x)
            this.hero.x=x
        }

        private gameStop(){
            this.addChild(this.btn);
            this.bg.stop();
            egret.stopTick(this.update,this)
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.move,this);
            this.hero.stopFire();
            this.enemyTimer.removeEventListener(egret.TimerEvent.TIMER,this.spawnEnemy,this);
            this.enemyTimer.stop();

            //清理子弹
            var i:number = 0;
            var bullet:Bullet;
            while(this.heroBullets.length>0) {
                bullet = this.heroBullets.pop();
                this.removeChild(bullet);
                Bullet.Reclaim(bullet);
            }
            while(this.enemyBullets.length>0) {
                bullet = this.enemyBullets.pop();
                this.removeChild(bullet);
                Bullet.Reclaim(bullet);
            }
            //清理飞机
            var plane:Airplane;
            while(this.enemies.length>0) {
                plane = this.enemies.pop();
                plane.stopFire();
                plane.removeEventListener("fire",this.fire,this);
                this.removeChild(plane);
                Airplane.Reclaim(plane);
            }
            //显示成绩
            this.scorePanel.showScore(this.score);
            this.addChild(this.scorePanel);           
        }
    }
}