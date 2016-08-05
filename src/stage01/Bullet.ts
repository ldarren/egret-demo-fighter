module game{
    export class Bullet extends egret.Bitmap{
        private static Pool:Object={}
        public texName:string

        public static Produce(texName:string):game.Bullet{
            var
            pool=game.Bullet.Pool,
            list=pool[texName],
            bullet:game.Bullet

            if (list && list.length) bullet=list.pop()
            else bullet=new game.Bullet(texName)
            return bullet
        }

        public static Reclaim(bullet:game.Bullet):void{
            var
            texName=bullet.texName,
            pool=game.Bullet.Pool,
            list=pool[texName] || []

            list.push(bullet)
            game.Bullet.Pool[texName]=list
        }

        public constructor(texName:string){
            super(RES.getRes(texName))
            this.texName=texName
        }
    }
}