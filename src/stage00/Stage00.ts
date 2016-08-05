module game{
    export class Stage00 extends egret.DisplayObjectContainer{
        private loadingUI:LoadingUI
        private speed:number
        private direction:number
        private boss:egret.Bitmap
        private now:number

        public constructor() {
            super();
            this.speed=0.5
            this.direction=1
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStage, this)
        }

        private addedToStage():void{
            RES.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStage, this)
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.resStage00Progress, this)
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.resStage00Loaded, this)
            this.loadingUI=new LoadingUI()
            this.addChild(this.loadingUI)
            RES.loadGroup('stage00')
        }

        private resStage00Progress(evt:RES.ResourceEvent):void{
            this.loadingUI.update(evt.itemsLoaded,evt.itemsTotal)
        }

        private resStage00Loaded(evt:RES.ResourceEvent):void{
            if ('stage00'!=evt.groupName) return
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.resStage00Progress, this)
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.resStage00Loaded, this)
            this.removeChild(this.loadingUI)
            this.createGameScene()
        }

        private createGameScene():void{
            var bg=new egret.Bitmap()
            bg.texture=RES.getRes('bg0')
            this.addChild(bg)
            
            this.boss=new egret.Bitmap()
            this.boss.texture=RES.getRes('boss')
            this.addChild(this.boss)

            egret.startTick(this.update,this)
            /* alter way
            egret.Tween.get(this.boss).to({
                x:this.stage.stageWidth-this.boss.width,
                y:this.stage.stageHeight/2
            },2000)
            .to({
                x:0,
                y:this.stage.stageHeight-this.boss.height
            },2000)
            */
        }

        private update(t:number):boolean{
            if (!this.now){
                this.now=t
                return false
            }
            var
            d=t-this.now,
            b=this.boss

            if(b.y+b.height < this.stage.stageHeight) b.y+=this.speed*d
            else{
                egret.stopTick(this.update,this)
                // TODO: use dispatch event will be better
                var main=<Main>this.parent
                main.loadStage(1)
                return false
            }

            if (b.x > this.stage.stageWidth-b.width || b.x<0) this.direction*=-1

            b.x+=this.speed*this.direction*d

            this.now=t
            return false
        }
    }
}