class LoadingUI extends egret.Sprite{
    private label:egret.TextField
    public constructor(){
        super()
        var label=new egret.TextField()
        label.y=300
        label.height=100
        label.width=480
        label.textAlign='center'
        this.addChild(label)
        this.label=label
    }
    public update(current:number, total:number):void{
        this.label.text=`Loading... ${current}/${total}`
    }
}