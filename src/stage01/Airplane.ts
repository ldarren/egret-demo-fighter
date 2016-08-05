module game{
    export class Airplane extends egret.DisplayObjectContainer{
        private static Pool:Object={}

        public static Produce(texName:string,fireDelay:number):game.Airplane{
            var
            pool=game.Airplane.Pool,
            list=pool[texName],
            plane:game.Airplane

            if (list && list.length) plane=list.pop()
            else plane=new game.Airplane(texName,fireDelay)
            plane.hp=10
            return plane
        }

        public static Reclaim(plane:game.Airplane):void{
            var
            texName=plane.texName,
            pool=game.Airplane.Pool,
            list=pool[texName] || []

            list.push(plane)
            game.Airplane.Pool[texName]=list
        }

        public texName:string
        public hp:number
        private fireTimer:egret.Timer

        public constructor(texName:string,fireDelay:number){
            super()
            this.addChild(game.createBitmapByName(texName))
            this.texName=texName
            this.fireTimer=new egret.Timer(fireDelay)
            this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.fire, this)
        }

        public startFire():void{
            this.fireTimer.start()
        }

        public stopFire():void{
            this.fireTimer.stop()
        }

        private fire(evt:egret.TimerEvent):void{
            this.dispatchEventWith('fire')
        }
    }
}