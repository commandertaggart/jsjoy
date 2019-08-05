import { VJDStatus, Axis, DiscretePOVDirection } from "./vJoyInterface";

interface IvJoyDeviceFrame {
    bDevice: number,
    wThrottle: number,
    wRudder: number,
    wAileron: number,
    wAxisX: number,
    wAxisY: number,
    wAxisZ: number,
    wAxisXRot: number,
    wAxisYRot: number,
    wAxisZRot: number,
    wSlider: number,
    wDial: number,
    wWheel: number,
    wAxisVX: number,
    wAxisVY: number,
    wAxisVZ: number,
    wAxisVBRX: number,
    wAxisVBRY: number,
    wAxisVBRZ: number,
    lButtons: number,
    bHats: number,
    bHatsEx1: number,
    bHatsEx2: number,
    bHatsEx3: number,
    lButtonsEx1: number,
    lButtonsEx2: number,
    lButtonsEx3: number
}

const DEFAULT_FRAME: IvJoyDeviceFrame = {
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
}

export interface IvJoyDeviceProxy {
    buttonCount(rID: number): number,
    discPovCount(rID: number): number,
    contPovCount(rID: number): number,
    axisExists(rID: number, axis: Axis): boolean,
    axisMax(rID: number, axis: Axis): number,
    axisMin(rID: number, axis: Axis): number,
    getOwnerPid(rID: number): number,
    relinquish(rID: number): void,
    reset(rID: number): void,
    resetButtons(rID: number): void,
    resetPovs(rID: number): void,
    status(rID: number): VJDStatus,

    setAxis(value: number, rID: number, axis: Axis): boolean,
    setBtn(down: boolean, rID: number, nBtn: number): boolean,
    setDiscPov(value: DiscretePOVDirection, rID: number, nPov: number): boolean,
    setContPov(value: number, rID: number, nPov: number): boolean
}

export class vJoyDevice {
    private _framerate: number = 0;
    private _frameTimer: NodeJS.Timeout = null;
    private _dirty: boolean = false;
    private _state: IvJoyDeviceFrame = null;

    public get framerate() { return this._framerate }
    public set framerate(n: number) {
        clearInterval(this._frameTimer)
        this._frameTimer = null

        if (this._framerate > 0) {
            this._frameTimer = setInterval(this._sendFrame.bind(this), 1 / this._framerate)
        }
    }

    constructor(private _rID: number, private _proxy: IvJoyDeviceProxy) {
        this.framerate = this.framerate
        this.reset()
    }

    public sendFrame() {
        if (this._framerate > 0) {
            throw new Error('To manually trigger frames, set framerate to 0')
        }

        this._sendFrame();
    }

    public get buttonCount(): number {
        return this._proxy.buttonCount(this._rID)
    }

    public get discPovCount(): number {
        return this._proxy.discPovCount(this._rID)
    }

    public get contPovCount(): number {
        return this._proxy.contPovCount(this._rID)
    }

    public axisExists(axis: Axis): boolean {
        return this._proxy.axisExists(this._rID, axis)
    }

    public axisMax(axis: Axis): number {
        return this._proxy.axisMax(this._rID, axis)
    }

    public axisMin(axis: Axis): number {
        return this._proxy.axisMin(this._rID, axis)
    }

    public get ownerPid(): number {
        return this._proxy.getOwnerPid(this._rID)
    }

    public relinquish(): void {
        this._proxy.relinquish(this._rID)
        this._proxy = undefined
        this._rID = undefined
        this.framerate = 0
    }

    public reset(): void {
        this._state = Object.assign({}, DEFAULT_FRAME, { bDevice: this._rID })
        this._dirty = false
        this._proxy.reset(this._rID)
    }

    public resetButtons(): void {
        this._state.lButtons = 
        this._state.lButtonsEx1 = 
        this._state.lButtonsEx2 = 
        this._state.lButtonsEx3 = 0
        
        this._proxy.resetButtons(this._rID)
    }

    public resetPovs(): void {
        this._state.bHats = 
        this._state.bHatsEx1 =
        this._state.bHatsEx2 =
        this._state.bHatsEx3 = 0

        this._proxy.resetPovs(this._rID)
    }

    public get status(): VJDStatus {
        return this._proxy.status(this._rID)
    }

    public setAxis(value: number, axis: Axis): boolean {
        return this._proxy.setAxis(value, this._rID, axis)
    }

    public setBtn(down: boolean, nBtn: number): boolean {
        return this._proxy.setBtn(down, this._rID, nBtn)
    }

    public setDiscPov(value: DiscretePOVDirection, nPov: number): boolean {
        return this._proxy.setDiscPov(value, this._rID, nPov)
    }

    public setContPov(value: number, nPov: number): boolean {
        return this._proxy.setContPov(value, this._rID, nPov)
    }

    private _sendFrame() {

    }
}