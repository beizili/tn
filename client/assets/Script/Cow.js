// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },



    start () {

    },

    onLoad () {

        //随机生成牛类型
        this.cowType = Math.floor(Math.random() * 3 + 1);
        //初始化速度
        this.speed = -(Math.random() * 200 + 100);
        //播放动画
        this._playCowWalk();

        this.gameScene = cc.find("UI_ROOT").getComponent("GameMain");
    },

    /**
     * 运动的牛
     */
    _playCowWalk(){
        var ani = this.getComponent(cc.Animation);
        ani.play("cow_run_0"+this.cowType);
    },
    update (dt) {
        var  s = this.speed * dt;
        this.node.x += s;
        //如果超出屏幕左侧则干掉
        if(this.node.x <= -(cc.winSize.width/2) - (this.node.width/2) ){
            //将当期对象删除
            this.node.removeFromParent();
            this.gameScene.removeCow(this.node);
        }
    }
});
