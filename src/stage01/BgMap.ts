module game{
    export class BgMap extends egret.DisplayObjectContainer{
        private bgList:egret.Bitmap[]
        private last:number
        private speed:number
        private textureHight:number

        public constructor(){
            super()
            this.speed=0.05
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStage, this)
        }
        
        private addedToStage():void{
            RES.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStage, this)
            var
            sw=this.stage.stageWidth,
            sh=this.stage.stageHeight,
            tex:egret.Texture=RES.getRes('bg1'),
            th=tex.textureHeight,
            count=Math.ceil(sh/th)+1,
            arr=[],
            bmp:egret.Bitmap

            for(var i=0; i<count; i++){
                bmp=game.createBitmapByName('bg1')
                bmp.y=th*i-(th*count-sh)
                arr.push(bmp)
                this.addChild(bmp)
            }
            this.bgList=arr
            this.textureHight=th
        }

        public start():void{
            egret.stopTick(this.update,this)
            egret.startTick(this.update,this)
        }

        private update(t:number):boolean{
            if (!this.last){
                this.last=t
                return false
            }
            var 
            d=t-this.last,
            arr=this.bgList,
            count=arr.length,
            s=this.speed,
            th=this.textureHight,
            sh=this.stage.stageHeight,
            bmp:egret.Bitmap

            this.last=t

            for(var i=0; i<count; i++){
                bmp=arr[i]
                bmp.y+=s*d
                if (bmp.y > sh){
                    bmp.y=arr[0].y-th
                    arr.pop()
                    arr.unshift(bmp)
                }
            }
            return false
        }

        public stop():void{
            egret.stopTick(this.update, this)
        }
   }
}