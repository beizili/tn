import initPomelo from './initPomelo';

cc.Class({
    extends: cc.Component,

    properties: {
        ropeCow1: {
            default: null,
            type: cc.Prefab
        },
        ropeCow2: {
            default: null,
            type: cc.Prefab
        },
        ropeCow3: {
            default: null,
            type: cc.Prefab
        },
        cowPrefab: {
            default: null,
            type: cc.Prefab
        },
        ropePrefab: {
            default: null,
            type: cc.Prefab
        },
        toolPrefab: {
            default: null,
            type: cc.Prefab
        },
        timeLable: {
            default: null,
            type: cc.Label
        },
        countLabel: {
            default: null,
            type: cc.Label
        },
        checkOut: {
            default: null,
            type: cc.Node
        },
        toolIsShow: false,
        isStartGame: false,
        tools: null,
        cowArray: [],
        cowsType: [],
        cowsCatchedPosition: [],
        time: 0,
        count: 0,
        ropeNum: 1,
        isRopeAdd: false,
        rope: null
    },

    //打开工具栏
    clickTool() {

        cc.log('点击工具' + this.toolIsShow);
        if (this.toolIsShow) {
            this.tools.destroy();
            this.toolIsShow = false;
        } else {
            this.tools = cc.instantiate(this.toolPrefab);
            this.tools.parent = this.node;
            this.tools.zIndex = 10001;
            this.toolIsShow = true;

        }
    },
    onLoad() {
        cc.log('初始化pomelo前')
        initPomelo().connectService();


        this.ropeNum = 1;
        // 绳子高度
        // let rope = this.node.getChildByName("rope");
        // rope.zIndex = -20;

        // let btn = this.node.getChildByName("btn");
        // btn.zIndex = 3000;
        // let ropePrefab = cc.instantiate(this.ropePrefab)
        // this.node.addChild(ropePrefab);

        this.startGame();


    },
    startGame() {
        if (this.isStartGame) return;
        this.isStartGame = true;

        this.unscheduleAllCallbacks();

        //初始化参数
        this.cowArray = [];
        this.cowsType = [];
        this.cowsCatchedPosition = [];
        this.time = 60;
        this.count = 0;
        this.ropeNum = 1;
        this.isRopeAdd = true;
        this.timeLable.string = this.time + '';
        this.countLabel.string = this.count + '';
        this.checkOut.active = false;


        //开启定时器
        this._onTimer();
        this._getCow();
        this._getRope();
    },
    _onTimer() {
        this.time--;
        this.timeLable.string = "" + this.time;
        //游戏结束时间到
        if (this.time <= 0) {
            this.unscheduleAllCallbacks();
            this.isStartGame = false;
            this._checkOut();
            return;
        }
        this.scheduleOnce(this._onTimer.bind(this), 1);
    },
    _getCow() {
        let cow = cc.instantiate(this.cowPrefab);
        //cow.setPosition(cc.winSize.width,-100);
        cow.x = cc.winSize.width;
        cow.y = -100;
        cow.zIndex = 1000;
        this.node.addChild(cow);
        this.cowArray.push(cow);
        this.scheduleOnce(this._getCow.bind(this), Math.random() * 2 + 3);
    },
    _getRope() {
        this.rope = cc.instantiate(this.ropePrefab);
        this.rope.zIndex = 0.1;
        this.node.addChild(this.rope);
    },

    throwRope() {
        let rope = this.rope;
        rope.y = -60;
        this.hitCow();
        let node = this.node;
        let cowsCatchedPosition = this.cowsCatchedPosition;
        let cowsType = this.cowsType;
        let i = 0;
        for (let cowType of  this.cowsType) {
            let catchedCow;
            switch (cowType) {
                case 1:
                    catchedCow = cc.instantiate(this.ropeCow1);
                    break;
                case 2:
                    catchedCow = cc.instantiate(this.ropeCow2);
                    break;
                case 3:
                    catchedCow = cc.instantiate(this.ropeCow3);
                    break;
                default:
                    break;
            }
            catchedCow.x = cowsCatchedPosition[i];
            node.addChild(catchedCow);
            // this.cowsType.splice( this.cowsType.indexOf(cowType), 1);
            setTimeout(function () {
                node.removeChild(catchedCow);
            }, 1000);

            i++;
        }
        this.cowsCatchedPosition = [];
        this.cowsType = [];
        setTimeout(function () {
            rope.y = -321;
        }, 1000);


    },

    // Math.random() * 2 +3
    hitCow() {
        let cowType = -1;
        let left;
        let right;
        let count = 0;
        switch (this.ropeNum) {
            case 1:
                left = -cc.winSize.width;
                right = cc.winSize.width;
                break;
            case 2:
                left = -cc.winSize.width;
                right = cc.winSize.width;
                break;
            case 3:
                left = -90;
                right = 90;
                break;
            case 4:
                left = -120;
                right = 120;
                break;
            default:
                break;
        }

        for (let cow of this.cowArray) {

            //精确测量值
            if (cow.x >= left && cow.x <= right) {
                count++;
                cowType = cow.getComponent("Cow").cowType;
                cow.removeFromParent();
                // this.cowArray.splice(this.cowArray.indexOf(cow),1);
                this._setCount(1);
                //播放音乐
                cc.audioEngine.play(cc.url.raw("resources/Sound/niu.mp3"), false, 1)
                this.cowsType.push(cowType);
                this.cowsCatchedPosition.push(cow.x);
            }
            if (count >= this.ropeNum) {
                break;
            }
        }
        this.cowArray = [];

    },
    _setCount(count) {
        this.count += count;
        this.countLabel.string = "" + this.count;
    },
    _checkOut() {

        //弹窗结算界面
        this.checkOut.active = true;
        let panelCountLabel = this.checkOut.getChildByName("panel").getChildByName("panelCount").getComponent(cc.Label);
        panelCountLabel.string = '' + this.count;

        let resTitle = this.checkOut.getChildByName("panel").getChildByName("resTitle").getComponent(cc.Label);
        let titleArray = [
            "情场空手",
            "情场新手",
            "情场高手",
            "情场大师",
        ];

        if (this.count <= 0) {
            resTitle.string = titleArray[0];
        }
        else if (this.count <= 3) {
            resTitle.string = titleArray[1];
        }
        else if (this.count <= 6) {
            resTitle.string = titleArray[2];
        }
        else {
            resTitle.string = titleArray[3];
        }

        //清除掉在跑的牛


    },
    removeCow(cow) {
        let index = this.cowArray.indexOf(cow);
        this.cowArray.splice(index, 1);
    }

});
