"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ffi_1 = require("ffi");
var ref = __importStar(require("ref"));
var ref_struct_1 = __importDefault(require("ref-struct"));
var vJoyDevice_1 = require("./vJoyDevice");
var DWORD = 'uint32';
// Interface Structures
var JOYSTICK_POSITION_V2 = ref_struct_1.default({
    'bDevice': 'byte',
    'wThrottle': 'long',
    'wRudder': 'long',
    'wAileron': 'long',
    'wAxisX': 'long',
    'wAxisY': 'long',
    'wAxisZ': 'long',
    'wAxisXRot': 'long',
    'wAxisYRot': 'long',
    'wAxisZRot': 'long',
    'wSlider': 'long',
    'wDial': 'long',
    'wWheel': 'long',
    'wAxisVX': 'long',
    'wAxisVY': 'long',
    'wAxisVZ': 'long',
    'wAxisVBRX': 'long',
    'wAxisVBRY': 'long',
    'wAxisVBRZ': 'long',
    'lButtons': 'long',
    'bHats': DWORD,
    'bHatsEx1': DWORD,
    'bHatsEx2': DWORD,
    'bHatsEx3': DWORD,
    'lButtonsEx1': 'long',
    'lButtonsEx2': 'long',
    'lButtonsEx3': 'long'
});
var JOYSTICK_POSITION_V2_ptr = ref.refType(JOYSTICK_POSITION_V2);
// Interface Functions
var vJoySDK = null;
function init() {
    var a = process.arch;
    if (a !== 'x32' && a !== 'x64') {
        throw new Error('vJoyInterface supports x32 and x64 (Windows) architectures only');
    }
    vJoySDK = vJoySDK || ffi_1.Library(__dirname + "\\..\\sdk\\lib" + (a === 'x64' ? '\\amd64' : '') + "\\vJoyInterface.dll", {
        // General Driver Data
        // some functions not implemented
        'GetvJoyVersion': ['short', []],
        'vJoyEnabled': ['bool', []],
        'GetvJoyProductString': ['string', []],
        'GetvJoyManufacturerString': ['string', []],
        'GetvJoySerialNumberString': ['string', []],
        'DriverMatch': ['bool', [ref.refType('short'), ref.refType('short')]],
        'RegisterRemovalCB': ['void', ['pointer', 'pointer']],
        'GetvJoyMaxDevices': ['bool', [ref.refType('int')]],
        'GetNumberExistingVJD': ['bool', [ref.refType('int')]],
        // Device Information
        'GetVJDButtonNumber': ['int', ['uint']],
        'GetVJDDiscPovNumber': ['int', ['uint']],
        'GetVJDContPovNumber': ['int', ['uint']],
        'GetVJDAxisExist': ['bool', ['uint', 'uint']],
        //'GetVJDAxisMax': ['bool', ['uint', 'uint', ref.refType('long')]],
        //'GetVJDAxisMin': ['bool', ['uint', 'uint', ref.refType('long')]],
        'GetVJDStatus': ['int', ['uint']],
        'isVJDExists': ['bool', ['uint']],
        'GetOwnerPid': ['int', ['uint']],
        // Device Feeding
        'AcquireVJD': ['bool', ['uint']],
        'RelinquishVJD': ['bool', ['uint']],
        'UpdateVJD': ['bool', ['uint', JOYSTICK_POSITION_V2_ptr]],
        'ResetVJD': ['bool', ['uint']],
        'ResetAll': ['bool', []],
        'ResetButtons': ['bool', ['uint']],
        'ResetPovs': ['bool', ['uint']],
        'SetAxis': ['bool', ['long', 'uint', 'uint']],
        'SetBtn': ['bool', ['bool', 'uint', 'uchar']],
        'SetDiscPov': ['bool', ['int', 'uint', 'uchar']],
        'SetContPov': ['bool', [DWORD, 'uint', 'uchar']]
        // Force Feedback
        // functions and related structs not implemented
    });
}
var Axis;
(function (Axis) {
    Axis[Axis["X"] = 48] = "X";
    Axis[Axis["Y"] = 49] = "Y";
    Axis[Axis["Z"] = 50] = "Z";
    Axis[Axis["RX"] = 51] = "RX";
    Axis[Axis["RY"] = 52] = "RY";
    Axis[Axis["RZ"] = 53] = "RZ";
    Axis[Axis["SL0"] = 54] = "SL0";
    Axis[Axis["SL1"] = 55] = "SL1";
    Axis[Axis["WHL"] = 56] = "WHL";
    Axis[Axis["POV"] = 57] = "POV";
})(Axis = exports.Axis || (exports.Axis = {}));
var DiscretePOVDirection;
(function (DiscretePOVDirection) {
    DiscretePOVDirection[DiscretePOVDirection["NORTH"] = 0] = "NORTH";
    DiscretePOVDirection[DiscretePOVDirection["EAST"] = 1] = "EAST";
    DiscretePOVDirection[DiscretePOVDirection["SOUTH"] = 2] = "SOUTH";
    DiscretePOVDirection[DiscretePOVDirection["WEST"] = 3] = "WEST";
    DiscretePOVDirection[DiscretePOVDirection["NEUTRAL"] = -1] = "NEUTRAL";
})(DiscretePOVDirection = exports.DiscretePOVDirection || (exports.DiscretePOVDirection = {}));
// Interface Constants
var VJDStatus;
(function (VJDStatus) {
    VJDStatus[VJDStatus["VJD_STAT_OWN"] = 0] = "VJD_STAT_OWN";
    VJDStatus[VJDStatus["VJD_STAT_FREE"] = 1] = "VJD_STAT_FREE";
    VJDStatus[VJDStatus["VJD_STAT_BUSY"] = 2] = "VJD_STAT_BUSY";
    VJDStatus[VJDStatus["VJD_STAT_MISS"] = 3] = "VJD_STAT_MISS";
    VJDStatus[VJDStatus["VJD_STAT_UNKN"] = 4] = "VJD_STAT_UNKN";
})(VJDStatus = exports.VJDStatus || (exports.VJDStatus = {}));
function GetvJoyVersion() {
    init();
    return vJoySDK.GetvJoyVersion();
}
exports.GetvJoyVersion = GetvJoyVersion;
function vJoyEnabled() {
    init();
    return vJoySDK.vJoyEnabled();
}
exports.vJoyEnabled = vJoyEnabled;
function GetvJoyProductString() {
    init();
    return vJoySDK.GetvJoyProductString();
}
exports.GetvJoyProductString = GetvJoyProductString;
function GetvJoyManufacturerString() {
    init();
    return vJoySDK.GetvJoyManufacturerString();
}
exports.GetvJoyManufacturerString = GetvJoyManufacturerString;
function GetvJoySerialNumberString() {
    init();
    return vJoySDK.GetvJoySerialNumberString();
}
exports.GetvJoySerialNumberString = GetvJoySerialNumberString;
function DriverMatch() {
    init();
    var pDllVer = ref.alloc('short');
    var pDrvVer = ref.alloc('short');
    var matches = vJoySDK.DriverMatch(pDllVer, pDrvVer);
    return {
        matches: matches,
        DllVer: pDllVer['deref'](),
        DrvVer: pDrvVer['deref']()
    };
}
exports.DriverMatch = DriverMatch;
function RegisterRemovalCB(cb, data) {
    init();
    var pCb = ffi_1.Callback('void', ['bool', 'bool', 'pointer'], function (a, b, _c) {
        cb(a, b, data);
    });
    return vJoySDK.RegisterRemovalCB(pCb, null);
}
exports.RegisterRemovalCB = RegisterRemovalCB;
function vJoyFfbCap() {
    init();
    var Supported = ref.alloc('bool');
    vJoySDK.vJoyFfbCap(Supported);
    return Supported['deref']();
}
exports.vJoyFfbCap = vJoyFfbCap;
function GetvJoyMaxDevices() {
    init();
    var pNum = ref.alloc('int');
    vJoySDK.GetvJoyMaxDevices(pNum);
    return pNum['deref']();
}
exports.GetvJoyMaxDevices = GetvJoyMaxDevices;
function GetNumberExistingVJD() {
    init();
    var pNum = ref.alloc('int');
    vJoySDK.GetNumberExistingVJD(pNum);
    return pNum['deref']();
}
exports.GetNumberExistingVJD = GetNumberExistingVJD;
function isVJDExists(rID) {
    init();
    return vJoySDK.isVJDExists(rID);
}
exports.isVJDExists = isVJDExists;
function GetVJDStatus(rID) {
    init();
    return vJoySDK.GetVJDStatus(rID);
}
exports.GetVJDStatus = GetVJDStatus;
function AcquireVJD(rID) {
    init();
    if (isVJDExists(rID)) {
        if (GetVJDStatus(rID) !== VJDStatus.VJD_STAT_FREE) {
            throw new Error("vJoy device id " + rID + " is not available");
        }
        if (!vJoySDK.AcquireVJD(rID)) {
            throw new Error("vJoy device id " + rID + " could not be acquired");
        }
        var device = new vJoyDevice_1.vJoyDevice(rID, vJoyDeviceProxy);
        return device;
    }
    else {
        throw new Error("vJoy device id " + rID + " does not exist");
    }
}
exports.AcquireVJD = AcquireVJD;
function ResetAll() {
    init();
    return vJoySDK.ResetAll();
}
exports.ResetAll = ResetAll;
var vJoyDeviceProxy = {
    buttonCount: function (rID) {
        return vJoySDK.GetVJDButtonNumber(rID);
    },
    discPovCount: function (rID) {
        return vJoySDK.GetVJDDiscPovNumber(rID);
    },
    contPovCount: function (rID) {
        return vJoySDK.GetVJDContPovNumber(rID);
    },
    axisExists: function (rID, axis) {
        return vJoySDK.GetVJDAxisExist(rID, Axis);
    },
    axisMax: function (rID, axis) {
        return 0x8000; //vJoySDK.GetVJDAxisMax(rID, Axis)
    },
    axisMin: function (rID, axis) {
        return 0x0; //vJoySDK.GetVJDAxisMin(rID, Axis)
    },
    getOwnerPid: function (rID) {
        return vJoySDK.GetOwnerPid(rID);
    },
    relinquish: function (rID) {
        return vJoySDK.RelinquishVJD(rID);
    },
    reset: function (rID) {
        return vJoySDK.ResetVJD(rID);
    },
    resetButtons: function (rID) {
        return vJoySDK.ResetButtons(rID);
    },
    resetPovs: function (rID) {
        return vJoySDK.ResetPovs(rID);
    },
    status: function (rID) {
        return vJoySDK.GetVJDStatus(rID);
    },
    setAxis: function (value, rID, axis) {
        return vJoySDK.SetAxis(value, rID, axis);
    },
    setBtn: function (value, rID, nBtn) {
        return vJoySDK.SetBtn(value, rID, nBtn);
    },
    setDiscPov: function (value, rID, nPov) {
        return vJoySDK.SetDiscPov(value, rID, nPov);
    },
    setContPov: function (value, rID, nPov) {
        return vJoySDK.SetContPov(value, rID, nPov);
    }
};
var vJoyInterface = {
    GetvJoyVersion: GetvJoyVersion,
    vJoyEnabled: vJoyEnabled,
    GetvJoyProductString: GetvJoyProductString,
    GetvJoyManufacturerString: GetvJoyManufacturerString,
    GetvJoySerialNumberString: GetvJoySerialNumberString,
    DriverMatch: DriverMatch,
    RegisterRemovalCB: RegisterRemovalCB,
    vJoyFfbCap: vJoyFfbCap,
    GetvJoyMaxDevices: GetvJoyMaxDevices,
    GetNumberExistingVJD: GetNumberExistingVJD,
    isVJDExists: isVJDExists,
    GetVJDStatus: GetVJDStatus,
    AcquireVJD: AcquireVJD,
    ResetAll: ResetAll
};
exports.default = vJoyInterface;
//# sourceMappingURL=vJoyInterface.js.map