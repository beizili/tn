cc.Class({
    extends: cc.Component,

    properties: {
        gameScene:null
    },



    addrope(event,data){
        let MAX_ROPE_NUMX = 5;//最大绳子数
        this.gameScene = cc.find("UI_ROOT").getComponent("GameMain");
        if(this.gameScene.ropeNum < MAX_ROPE_NUMX){
            this.gameScene.ropeNum++;
        }
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
