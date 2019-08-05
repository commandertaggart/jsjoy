"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_FRAME = {
    bDevice: 0,
    wThrottle: 0,
    wRudder: 0,
    wAileron: 0,
    wAxisX: 0x4000,
    wAxisY: 0x4000,
    wAxisZ: 0x4000,
    wAxisXRot: 0x4000,
    wAxisYRot: 0x4000,
    wAxisZRot: 0x4000,
    wSlider: 0x4000,
    wDial: 0x4000,
    wWheel: 0,
    wAxisVX: 0,
    wAxisVY: 0,
    wAxisVZ: 0,
    wAxisVBRX: 0,
    wAxisVBRY: 0,
    wAxisVBRZ: 0,
    lButtons: 0,
    bHats: 0,
    bHatsEx1: -1,
    bHatsEx2: -1,
    bHatsEx3: -1,
    lButtonsEx1: 0,
    lButtonsEx2: 0,
    lButtonsEx3: 0
};
var vJoyDevice = /** @class */ (function () {
    function vJoyDevice(_rID, _proxy) {
        this._rID = _rID;
        this._proxy = _proxy;
        this._framerate = 0;
        this._frameTimer = null;
        this._dirty = false;
        this._state = null;
        this.framerate = this.framerate;
        this.reset();
    }
    Object.defineProperty(vJoyDevice.prototype, "framerate", {
        get: function () { return this._framerate; },
        set: function (n) {
            clearInterval(this._frameTimer);
            this._frameTimer = null;
            if (this._framerate > 0) {
                this._frameTimer = setInterval(this._sendFrame.bind(this), 1 / this._framerate);
            }
        },
        enumerable: true,
        configurable: true
    });
    vJoyDevice.prototype.sendFrame = function () {
        if (this._framerate > 0) {
            throw new Error('To manually trigger frames, set framerate to 0');
        }
        this._sendFrame();
    };
    Object.defineProperty(vJoyDevice.prototype, "buttonCount", {
        get: function () {
            return this._proxy.buttonCount(this._rID);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vJoyDevice.prototype, "discPovCount", {
        get: function () {
            return this._proxy.discPovCount(this._rID);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vJoyDevice.prototype, "contPovCount", {
        get: function () {
            return this._proxy.contPovCount(this._rID);
        },
        enumerable: true,
        configurable: true
    });
    vJoyDevice.prototype.axisExists = function (axis) {
        return this._proxy.axisExists(this._rID, axis);
    };
    vJoyDevice.prototype.axisMax = function (axis) {
        return this._proxy.axisMax(this._rID, axis);
    };
    vJoyDevice.prototype.axisMin = function (axis) {
        return this._proxy.axisMin(this._rID, axis);
    };
    Object.defineProperty(vJoyDevice.prototype, "ownerPid", {
        get: function () {
            return this._proxy.getOwnerPid(this._rID);
        },
        enumerable: true,
        configurable: true
    });
    vJoyDevice.prototype.relinquish = function () {
        this._proxy.relinquish(this._rID);
        this._proxy = undefined;
        this._rID = undefined;
        this.framerate = 0;
    };
    vJoyDevice.prototype.reset = function () {
        this._state = Object.assign({}, DEFAULT_FRAME, { bDevice: this._rID });
        this._dirty = false;
        this._proxy.reset(this._rID);
    };
    vJoyDevice.prototype.resetButtons = function () {
        this._state.lButtons =
            this._state.lButtonsEx1 =
                this._state.lButtonsEx2 =
                    this._state.lButtonsEx3 = 0;
        this._proxy.resetButtons(this._rID);
    };
    vJoyDevice.prototype.resetPovs = function () {
        this._state.bHats =
            this._state.bHatsEx1 =
                this._state.bHatsEx2 =
                    this._state.bHatsEx3 = 0;
        this._proxy.resetPovs(this._rID);
    };
    Object.defineProperty(vJoyDevice.prototype, "status", {
        get: function () {
            return this._proxy.status(this._rID);
        },
        enumerable: true,
        configurable: true
    });
    vJoyDevice.prototype.setAxis = function (value, axis) {
        return this._proxy.setAxis(value, this._rID, axis);
    };
    vJoyDevice.prototype.setBtn = function (down, nBtn) {
        return this._proxy.setBtn(down, this._rID, nBtn);
    };
    vJoyDevice.prototype.setDiscPov = function (value, nPov) {
        return this._proxy.setDiscPov(value, this._rID, nPov);
    };
    vJoyDevice.prototype.setContPov = function (value, nPov) {
        return this._proxy.setContPov(value, this._rID, nPov);
    };
    vJoyDevice.prototype._sendFrame = function () {
    };
    return vJoyDevice;
}());
exports.vJoyDevice = vJoyDevice;
//# sourceMappingURL=vJoyDevice.js.map