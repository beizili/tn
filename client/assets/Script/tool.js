cc.Class({
    extends: cc.Component,

    properties: {
        gameScene:null
    },
    addrope(event,data){
        this.gameScene = cc.find("UI_ROOT").getComponent("GameMain");
        this.gameScene.ropeNum++;
        this.gameScene.isRopeAdd = true;
        this.toolsDestory();
    },

    toolsDestory(){
        this.gameScene.tools.destroy();
        this.gameScene.toolIsShow=false;
    },

    start () {

    }

});
