
cc.Class({
    extends: cc.Component,

    properties: {
        gameScene:null
    },
    onLoad () {

        //播放动画
        this.ropeNum(1);

    },
    /**
     * 播放绳子动画
     */
    ropeNum(num){
        let ani = this.getComponent(cc.Animation);
        ani.play("rope"+num);
    },

    start () {

    },
    update (dt) {
        this.gameScene = cc.find("UI_ROOT").getComponent("GameMain");
        if(this.gameScene.isRopeAdd){
            this.ropeNum(this.gameScene.ropeNum);
            this.gameScene.isRopeAdd = false;
        }
    }
});
