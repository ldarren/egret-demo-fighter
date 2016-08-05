class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStage, this)
    }

    private addedToStage():void{
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.createGameScene, this)
        RES.loadConfig('resource/default.res.json','resource/')
    }

    private createGameScene():void{
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.createGameScene, this)
        this.loadStage(0)
    }

    public loadStage(level:number):boolean{
        this.removeChildren()
        var stage:egret.DisplayObjectContainer
        switch(level){
        case 0: stage=new game.Stage00(); break
        case 1: stage=new game.Stage01(); break
        }
        if (!stage) return false
        this.addChild(stage)
        return true
    }
}