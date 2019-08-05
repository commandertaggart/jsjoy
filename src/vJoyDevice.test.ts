import { IvJoyDeviceProxy, vJoyDevice } from './vJoyDevice'
import { Axis, VJDStatus, DiscretePOVDirection } from './vJoyInterface'

describe('vJoyDevice', () => {
    beforeEach(() => {
        const proxy: IvJoyDeviceProxy = {
            buttonCount: jest.fn() as (rID: number) => number,
            discPovCount: jest.fn() as (rID: number) => number,
            contPovCount: jest.fn() as (rID: number) => number,
            axisExists: jest.fn() as (rID: number, axis: Axis) => boolean,
            axisMax: jest.fn() as (rID: number, axis: Axis) => number,
            axisMin: jest.fn() as (rID: number, axis: Axis) => number,
            getOwnerPid: jest.fn() as (rID: number) => number,
            relinquish: jest.fn() as (rID: number) => void,
            reset: jest.fn() as (rID: number) => void,
            resetButtons: jest.fn() as (rID: number) => void,
            resetPovs: jest.fn() as (rID: number) => void,
            status: jest.fn() as (rID: number) => VJDStatus,
        
            setAxis: jest.fn() as (value: number, rID: number, axis: Axis) => boolean,
            setBtn: jest.fn() as (down: boolean, rID: number, nBtn: number) => boolean,
            setDiscPov: jest.fn() as (value: DiscretePOVDirection, rID: number, nPov: number) => boolean,
            setContPov: jest.fn() as (value: number, rID: number, nPov: number) => boolean
        }
        this._proxy = proxy
        this._target = new vJoyDevice(1, proxy)
    })
    it('constructs', () => {
        expect(this._target['_proxy']).toEqual(this._proxy)
    })
    it('gets button count', () => {
        this._target.buttonCount
        expect(this._proxy.buttonCount).toHaveBeenCalledWith(1)
    })
    it('gets disc pov count', () => {
        this._target.discPovCount
        expect(this._proxy.discPovCount).toHaveBeenCalledWith(1)
    })
    it('gets cont pov count', () => {
        this._target.contPovCount
        expect(this._proxy.contPovCount).toHaveBeenCalledWith(1)
    })
    it('gets axis exists', () => {
        this._target.axisExists(Axis.X)
        expect(this._proxy.axisExists).toHaveBeenCalledWith(1, Axis.X)
    })
    it('gets axis min', () => {
        this._target.axisMax(Axis.X)
        expect(this._proxy.axisMax).toHaveBeenCalledWith(1, Axis.X)
    })
    it('gets axis min', () => {
        this._target.axisMin(Axis.X)
        expect(this._proxy.axisMin).toHaveBeenCalledWith(1, Axis.X)
    })
    it('gets owner pid', () => {
        this._target.ownerPid
        expect(this._proxy.getOwnerPid).toHaveBeenCalledWith(1)
    })
    it('resets', () => {
        this._target.reset()
        expect(this._proxy.reset).toHaveBeenCalledWith(1)
    })
    it('resets buttons', () => {
        this._target.resetButtons()
        expect(this._proxy.resetButtons).toHaveBeenCalledWith(1)
    })
    it('resetsPovs', () => {
        this._target.resetPovs()
        expect(this._proxy.resetPovs).toHaveBeenCalledWith(1)
    })
    it('gets status', () => {
        this._target.status
        expect(this._proxy.status).toHaveBeenCalledWith(1)
    })
    it('sets axis value', () => {
        this._target.setAxis(123, Axis.X)
        expect(this._proxy.setAxis).toHaveBeenCalledWith(123, 1, Axis.X)
    })
    it('sets button state', () => {
        this._target.setBtn(true, 3)
        expect(this._proxy.setBtn).toHaveBeenCalledWith(true, 1, 3)
    })
    it('sets disc pov value', () => {
        this._target.setDiscPov(DiscretePOVDirection.EAST, 2)
        expect(this._proxy.setDiscPov).toHaveBeenCalledWith(DiscretePOVDirection.EAST, 1, 2)
    })
    it('sets cont pov value', () => {
        this._target.setContPov(5, 6)
        expect(this._proxy.setContPov).toHaveBeenCalledWith(5, 1, 6)
    })
    it('relinquishes', () => {
        this._target.relinquish();
        expect(this._proxy.relinquish).toHaveBeenCalledWith(1)
        expect(this._target['_proxy']).toBeUndefined()
    })
})