module game{
    export class GameUtil{
        public static HitTest(o1:egret.DisplayObject,o2:egret.DisplayObject):boolean{
            var
            r1:egret.Rectangle=o1.getBounds(),
            r2:egret.Rectangle=o2.getBounds()

            r1.x=o1.x,r1.y=o1.y,r2.x=o2.x,r2.y=o2.y
            return r1.intersects(r2)
        }
    }
    export function createBitmapByName(name:string):egret.Bitmap{
        var ret:egret.Bitmap=new egret.Bitmap()
        ret.texture=RES.getRes(name)
        return ret
    }
}