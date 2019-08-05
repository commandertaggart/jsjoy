import { Library, Callback } from 'ffi';
import * as ref from 'ref';
import Struct from 'ref-struct';
import { vJoyDevice, IvJoyDeviceProxy } from './vJoyDevice';

const DWORD = 'uint32';

// Interface Structures
const JOYSTICK_POSITION_V2 = Struct({
    'bDevice':     'byte',
    'wThrottle':   'long',
    'wRudder':     'long',
    'wAileron':    'long',
    'wAxisX':      'long',
    'wAxisY':      'long',
    'wAxisZ':      'long',
    'wAxisXRot':   'long',
    'wAxisYRot':   'long',
    'wAxisZRot':   'long',
    'wSlider':     'long',
    'wDial':       'long',
    'wWheel':      'long',
    'wAxisVX':     'long',
    'wAxisVY':     'long',
    'wAxisVZ':     'long',
    'wAxisVBRX':   'long',
    'wAxisVBRY':   'long',
    'wAxisVBRZ':   'long',
    'lButtons':    'long',
    'bHats':        DWORD,
    'bHatsEx1':     DWORD,
    'bHatsEx2':     DWORD,
    'bHatsEx3':     DWORD,
    'lButtonsEx1': 'long',
    'lButtonsEx2': 'long',
    'lButtonsEx3': 'long'
});
const JOYSTICK_POSITION_V2_ptr = ref.refType(JOYSTICK_POSITION_V2);
  
// Interface Functions
let vJoySDK = null;
function init() {
    const a = process.arch;
    if (a !== 'x32' && a !== 'x64') {
        throw new Error('vJoyInterface supports x32 and x64 (Windows) architectures only')
    }

    vJoySDK = vJoySDK || Library(`${__dirname}\\..\\sdk\\lib${a === 'x64' ? '\\amd64' : ''}\\vJoyInterface.dll`, {
        // General Driver Data
        // some functions not implemented
        'GetvJoyVersion': ['short', []],
        'vJoyEnabled':    ['bool',  []],
        'GetvJoyProductString': ['string', []],
        'GetvJoyManufacturerString': ['string', []],
        'GetvJoySerialNumberString': ['string', []],
        'DriverMatch': ['bool', [ref.refType('short'), ref.refType('short')]],
        'RegisterRemovalCB': ['void', ['pointer', 'pointer']],
        'GetvJoyMaxDevices': ['bool', [ref.refType('int')]],
        'GetNumberExistingVJD': ['bool', [ref.refType('int')]],
        // Device Information
        'GetVJDButtonNumber':  ['int',  ['uint']],
        'GetVJDDiscPovNumber': ['int',  ['uint']],
        'GetVJDContPovNumber': ['int',  ['uint']],
        'GetVJDAxisExist':     ['bool', ['uint', 'uint']],
        //'GetVJDAxisMax': ['bool', ['uint', 'uint', ref.refType('long')]],
        //'GetVJDAxisMin': ['bool', ['uint', 'uint', ref.refType('long')]],
        'GetVJDStatus':        ['int',  ['uint']],
        'isVJDExists': ['bool', ['uint']],
        'GetOwnerPid': ['int', ['uint']],
        // Device Feeding
        'AcquireVJD':    ['bool', ['uint']],
        'RelinquishVJD': ['bool', ['uint']],
        'UpdateVJD':     ['bool', ['uint', JOYSTICK_POSITION_V2_ptr]],
        'ResetVJD':      ['bool', ['uint']],
        'ResetAll':      ['bool', []],
        'ResetButtons':  ['bool', ['uint']],
        'ResetPovs':     ['bool', ['uint']],
        'SetAxis':       ['bool', ['long', 'uint', 'uint']],
        'SetBtn':        ['bool', ['bool', 'uint', 'uchar']],
        'SetDiscPov':    ['bool', ['int',  'uint', 'uchar']],
        'SetContPov':    ['bool', [DWORD,  'uint', 'uchar']]
        // Force Feedback
        // functions and related structs not implemented
    });
}

export enum Axis {
    X   = 0x30,
    Y   = 0x31,
    Z   = 0x32,
    RX  = 0x33,
    RY  = 0x34,
    RZ  = 0x35,
    SL0 = 0x36,
    SL1 = 0x37,
    WHL = 0x38,
    POV = 0x39
}

export enum DiscretePOVDirection {
    NORTH   = 0,
    EAST    = 1,
    SOUTH   = 2,
    WEST    = 3,
    NEUTRAL = -1
}

// Interface Constants
export enum VJDStatus {
    VJD_STAT_OWN  = 0,
    VJD_STAT_FREE = 1,
    VJD_STAT_BUSY = 2,
    VJD_STAT_MISS = 3,
    VJD_STAT_UNKN = 4
}

export function GetvJoyVersion(): number {
    init()
    return vJoySDK.GetvJoyVersion()
}

export function vJoyEnabled(): boolean {
    init()
    return vJoySDK.vJoyEnabled()
}

export function GetvJoyProductString(): string {
    init()
    return vJoySDK.GetvJoyProductString()
}

export function GetvJoyManufacturerString(): string {
    init()
    return vJoySDK.GetvJoyManufacturerString()
}

export function GetvJoySerialNumberString(): string {
    init()
    return vJoySDK.GetvJoySerialNumberString()
}

export interface DriverMatchResults {
    matches: boolean,
    DllVer: number,
    DrvVer: number
}

export function DriverMatch(): DriverMatchResults {
    init()
    const pDllVer = ref.alloc('short')
    const pDrvVer = ref.alloc('short')
    const matches = vJoySDK.DriverMatch(pDllVer, pDrvVer)
    return {
        matches,
        DllVer: pDllVer['deref'](),
        DrvVer: pDrvVer['deref']()
    }
}

export type ConfChangedCallback = (removed: boolean, first: boolean, data: any) => void
export function RegisterRemovalCB(cb: ConfChangedCallback, data: any): void {
    init()
    const pCb = Callback('void', ['bool', 'bool', 'pointer'], 
        (a: boolean, b: boolean, _c: any) => {
            cb(a, b, data)
        }
    )
    return vJoySDK.RegisterRemovalCB(pCb, null)
}

export function vJoyFfbCap(): boolean {
    init()
    const Supported = ref.alloc('bool')
    vJoySDK.vJoyFfbCap(Supported)
    return Supported['deref']()
}

export function GetvJoyMaxDevices(): number {
    init()
    const pNum = ref.alloc('int')
    vJoySDK.GetvJoyMaxDevices(pNum)
    return pNum['deref']()
}

export function GetNumberExistingVJD(): number {
    init()
    const pNum = ref.alloc('int')
    vJoySDK.GetNumberExistingVJD(pNum)
    return pNum['deref']()
}

export function isVJDExists(rID: number): boolean {
    init()
    return vJoySDK.isVJDExists(rID)
}

export function GetVJDStatus(rID: number): VJDStatus {
    init()
    return vJoySDK.GetVJDStatus(rID)
}

export function AcquireVJD(rID: number): vJoyDevice {
    init()
    if (isVJDExists(rID)) {
        if (GetVJDStatus(rID) !== VJDStatus.VJD_STAT_FREE) {
            throw new Error(`vJoy device id ${rID} is not available`)
        }

        if (!vJoySDK.AcquireVJD(rID)) {
            throw new Error(`vJoy device id ${rID} could not be acquired`)
        }

        const device = new vJoyDevice(rID, vJoyDeviceProxy);
        return device;
    }
    else {
        throw new Error(`vJoy device id ${rID} does not exist`)
    }
}

export function ResetAll(): void {
    init()
    return vJoySDK.ResetAll()
}

const vJoyDeviceProxy: IvJoyDeviceProxy = {
    buttonCount(rID: number): number {
        return vJoySDK.GetVJDButtonNumber(rID)
    },
    discPovCount(rID: number): number {
        return vJoySDK.GetVJDDiscPovNumber(rID)
    },
    contPovCount(rID: number): number {
        return vJoySDK.GetVJDContPovNumber(rID)
    },
    axisExists(rID: number, axis: Axis): boolean {
        return vJoySDK.GetVJDAxisExist(rID, Axis)
    },
    axisMax(rID: number, axis: Axis): number {
        return 0x8000 //vJoySDK.GetVJDAxisMax(rID, Axis)
    },
    axisMin(rID: number, axis: Axis): number {
        return 0x0 //vJoySDK.GetVJDAxisMin(rID, Axis)
    },
    getOwnerPid(rID: number): number {
        return vJoySDK.GetOwnerPid(rID)
    },
    relinquish(rID: number): void {
        return vJoySDK.RelinquishVJD(rID)
    },
    reset(rID: number): void {
        return vJoySDK.ResetVJD(rID)
    },
    resetButtons(rID: number): void {
        return vJoySDK.ResetButtons(rID)
    },
    resetPovs(rID: number): void {
        return vJoySDK.ResetPovs(rID)
    },
    status(rID: number): VJDStatus {
        return vJoySDK.GetVJDStatus(rID) as VJDStatus
    },
    setAxis(value: number, rID: number, axis: Axis): boolean {
        return vJoySDK.SetAxis(value, rID, axis)
    },
    setBtn(value: boolean, rID: number, nBtn: number): boolean {
        return vJoySDK.SetBtn(value, rID, nBtn)
    },
    setDiscPov(value: DiscretePOVDirection, rID: number, nPov: number): boolean {
        return vJoySDK.SetDiscPov(value, rID, nPov)
    },
    setContPov(value: number, rID: number, nPov: number): boolean {
        return vJoySDK.SetContPov(value, rID, nPov)
    }
}

const vJoyInterface = {
    GetvJoyVersion,
    vJoyEnabled,
    GetvJoyProductString,
    GetvJoyManufacturerString,
    GetvJoySerialNumberString,
    DriverMatch,
    RegisterRemovalCB,
    vJoyFfbCap,
    GetvJoyMaxDevices,
    GetNumberExistingVJD,
    isVJDExists,
    GetVJDStatus,
    AcquireVJD,
    ResetAll
}

export default vJoyInterface;