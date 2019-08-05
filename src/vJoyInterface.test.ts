
jest.mock('ffi')
import * as mock_ffi from 'ffi'
import vJoyInterface from './vJoyInterface'
import { vJoyDevice } from './vJoyDevice';

describe('vJoyInterface', () => {
    afterEach(() => {
        mock_ffi.Library('reset', null)
    })

    it('initializes (once)', () => {
        vJoyInterface.vJoyEnabled()
        const mock = mock_ffi.Library('getlast', null)

        expect(mock).not.toBeUndefined()
        expect(mock.vJoyEnabled).toHaveBeenCalled()

        vJoyInterface.GetvJoyVersion()
        const mock2 = mock_ffi.Library('getlast', null)

        expect(mock).toEqual(mock2)
    })

    ;[
        'GetvJoyVersion',
        'vJoyEnabled',
        'GetvJoyProductString',
        'GetvJoyManufacturerString',
        'GetvJoySerialNumberString',
        'DriverMatch',
        'GetvJoyMaxDevices',
        'GetNumberExistingVJD',
        'ResetAll'
    ].forEach(method => {
        it(`calls method ${method}`, () => {
            vJoyInterface[method]()
            const mock = mock_ffi.Library('getlast', null)

            expect(mock[method]).toHaveBeenCalled()
        })
    })

    it(`calls method RegisterRemovalCb`, () => {
        vJoyInterface.RegisterRemovalCB((a, b, c) => void(0), {})
        const mock = mock_ffi.Library('getlast', null)

        expect(mock.RegisterRemovalCB).toHaveBeenCalled()
    })

    it(`calls method isVJDExists`, () => {
        vJoyInterface.isVJDExists(0)
        const mock = mock_ffi.Library('getlast', null)

        expect(mock.isVJDExists).toHaveBeenCalled()
    })

    it(`calls method GetVJDStatus`, () => {
        vJoyInterface.GetVJDStatus(0)
        const mock = mock_ffi.Library('getlast', null)

        expect(mock.GetVJDStatus).toHaveBeenCalled()
    })

    it(`calls method AcquireVJD`, () => {
        const mock = mock_ffi.Library('getlast', null)
        mock.isVJDExists.mockImplementationOnce(() => true)
        mock.GetVJDStatus.mockImplementationOnce(() => 1)
        mock.AcquireVJD.mockImplementationOnce(() => true)
        const vjd = vJoyInterface.AcquireVJD(0)

        expect(vjd).toBeInstanceOf(vJoyDevice)
    })

    it('has vJoyDevice call methods', () => {
        const mock = mock_ffi.Library('getlast', null)
        mock.isVJDExists.mockImplementationOnce(() => true)
        mock.GetVJDStatus.mockImplementationOnce(() => 1)
        mock.AcquireVJD.mockImplementationOnce(() => true)
        const vjd = vJoyInterface.AcquireVJD(0)

        vjd.buttonCount
        expect(mock.GetVJDButtonNumber).toHaveBeenCalled()
        vjd.axisExists(0)
        expect(mock.GetVJDAxisExist).toHaveBeenCalled()
        vjd.status
        expect(mock.GetVJDStatus).toHaveBeenCalled()
        vjd.ownerPid
        expect(mock.GetOwnerPid).toHaveBeenCalled()
        vjd.reset()
        expect(mock.ResetVJD).toHaveBeenCalled()
        vjd.resetButtons()
        expect(mock.ResetButtons).toHaveBeenCalled()
        vjd.resetPovs()
        expect(mock.ResetPovs).toHaveBeenCalled()
        vjd.setAxis(0, 0)
        expect(mock.SetAxis).toHaveBeenCalled()
        vjd.setBtn(true, 0)
        expect(mock.SetBtn).toHaveBeenCalled()
        vjd.setDiscPov(0, 0)
        expect(mock.SetDiscPov).toHaveBeenCalled()
        vjd.setContPov(0, 0)
        expect(mock.SetContPov).toHaveBeenCalled()
    })
})