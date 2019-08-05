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
var vJoyInterface_1 = __importStar(require("../src/vJoyInterface"));
var gamepad_1 = __importDefault(require("gamepad"));
try {
    if (vJoyInterface_1.default.vJoyEnabled()) {
        // initialize and get basic information
        console.log("vJoy ver. " + vJoyInterface_1.default.GetvJoyVersion() + " enabled.");
        console.log(vJoyInterface_1.default.GetvJoyProductString(), vJoyInterface_1.default.GetvJoyManufacturerString(), vJoyInterface_1.default.GetvJoySerialNumberString());
        var maxDev = vJoyInterface_1.default.GetvJoyMaxDevices();
        var curDev = vJoyInterface_1.default.GetNumberExistingVJD();
        console.log("Devices: " + curDev + "/" + maxDev);
        if (curDev < 1) {
            throw new Error('No devices to test.');
        }
        // get system devices to receive input confirmation
        gamepad_1.default.init();
        var curSys = gamepad_1.default.numDevices();
        if (curSys < 1) {
            throw new Error('No system-recognized devices found.');
        }
        var vDevices_1 = [];
        gamepad_1.default.addListener('move', function (id, _axis, _vNew, _vOld, _timestamp) {
            if (vDevices_1[id]) {
                //process.stdout.write(id.toString())
                process.stdout.write('@');
                //console.log(`axis ${_axis} moved from ${_vOld} to ${_vNew}`)
                ++vDevices_1[id].movements;
            }
        });
        gamepad_1.default.addListener('down', function (id, _button, _timestamp) {
            if (vDevices_1[id]) {
                //process.stdout.write(id.toString())
                process.stdout.write('v');
                ++vDevices_1[id].presses;
            }
        });
        gamepad_1.default.addListener('up', function (id, _button, _timestamp) {
            if (vDevices_1[id]) {
                //process.stdout.write(id.toString())
                process.stdout.write('^');
                ++vDevices_1[id].releases;
            }
        });
        var foundSys = 0;
        for (var d = 0; d < curSys; ++d) {
            var system = gamepad_1.default.deviceAtIndex(d);
            //console.log(system)
            if (system.description.startsWith('vJoy')) {
                console.log(" ... found vJoy Device at id " + system.deviceID);
                ++foundSys;
                var device = {
                    movements: 0,
                    presses: 0,
                    releases: 0,
                    system: system
                };
                vDevices_1[system.deviceID] = device;
            }
        }
        if (foundSys === 0) {
            throw new Error('No vJoy devices found.');
        }
        if (foundSys === 1) {
            console.warn('Integration tests proceeding with only one vJoy device.  Tests will be incomplete.');
        }
        var foundDev = 0;
        var vIdx = 0;
        var tests_1 = [];
        var exp_1 = {
            movements: 0,
            presses: 0,
            releases: 0
        };
        var _loop_1 = function () {
            if (vJoyInterface_1.default.isVJDExists(vIdx)) {
                console.log("Found a device at vJoy index " + vIdx);
                ++foundDev;
                var status_1 = vJoyInterface_1.default.GetVJDStatus(vIdx);
                if (status_1 !== vJoyInterface_1.VJDStatus.VJD_STAT_FREE) {
                    throw new Error("vJoy device is not available.  status code: " + status_1);
                }
                var vjd_1 = vJoyInterface_1.default.AcquireVJD(vIdx);
                vjd_1.reset();
                [
                    vJoyInterface_1.Axis.X, vJoyInterface_1.Axis.Y, vJoyInterface_1.Axis.Z, vJoyInterface_1.Axis.RX, vJoyInterface_1.Axis.RY, vJoyInterface_1.Axis.RZ, vJoyInterface_1.Axis.SL0, vJoyInterface_1.Axis.SL1, vJoyInterface_1.Axis.WHL, vJoyInterface_1.Axis.POV
                ].map(function (axis) {
                    if (vjd_1.axisExists(axis)) {
                        tests_1.push(function () {
                            vjd_1.setAxis(0x6000, axis);
                        });
                        ++exp_1.movements;
                    }
                });
                var bNum = vjd_1.buttonCount;
                for (var b = 0; b < bNum; ++b) {
                    tests_1.push(vjd_1.setBtn.bind(vjd_1, true, b + 1));
                    ++exp_1.presses;
                    tests_1.push(vjd_1.setBtn.bind(vjd_1, false, b + 1));
                    ++exp_1.releases;
                }
                var dNum = vjd_1.discPovCount;
                for (var b = 0; b < dNum; ++b) {
                    tests_1.push(vjd_1.setDiscPov.bind(vjd_1, vJoyInterface_1.DiscretePOVDirection.EAST, b + 1));
                    ++exp_1.movements;
                    tests_1.push(vjd_1.setDiscPov.bind(vjd_1, vJoyInterface_1.DiscretePOVDirection.NEUTRAL, b + 1));
                    ++exp_1.movements;
                }
                /* Skipping continuous POV hats, as the gamepad library
                    we're using to confirm the input doesn't handle them
                    in any expected manner
                const pNum = vjd.contPovCount
                for (let b = 0; b < pNum; ++b) {
                    tests.push(vjd.setContPov.bind(vjd, 9000, b+1))
                    ++exp.movements
                }
                */
            }
            ++vIdx;
        };
        while (foundDev < curDev && vIdx < maxDev) {
            _loop_1();
        }
        if (foundDev < curDev) {
            throw new Error('Not all vJoy devices were accessible.');
        }
        var inputsExpected_1 = tests_1.length;
        console.log("Testing " + inputsExpected_1 + " input events...");
        console.log('. = input fed, input received => @ = axis/pov movement, v = button press, ^ = button release');
        var lineCnt_1 = 0;
        var lineLen_1 = 50;
        var nextTest_1 = function () {
            if (tests_1.length > 0) {
                process.stdout.write('.');
                if (++lineCnt_1 >= lineLen_1) {
                    process.stdout.write('\n');
                    lineCnt_1 = 0;
                }
                var test_1 = tests_1.shift();
                test_1();
                setTimeout(nextTest_1, 33);
            }
            else {
                setTimeout(function () {
                    process.stdout.write('\nAll tests run.\n');
                    clearInterval(updateInterval_1);
                    var inputsReceived = vDevices_1.reduce(function (sum, dev) { return sum += dev.movements + dev.presses + dev.releases; }, 0);
                    var msg = "Received " + inputsReceived + " of " + inputsExpected_1 + " expected input events";
                    if (inputsReceived == 0) {
                        throw new Error(msg);
                    }
                    else {
                        console.log(msg);
                        console.log(" = " + vDevices_1.reduce(function (s, d) { return s + d.movements; }, 0) + " axis/pov movements received -- expected " + exp_1.movements);
                        console.log(" = " + vDevices_1.reduce(function (s, d) { return s + d.presses; }, 0) + " button presses received -- expected " + exp_1.presses);
                        console.log(" = " + vDevices_1.reduce(function (s, d) { return s + d.releases; }, 0) + " button presses releases -- expected " + exp_1.releases);
                        console.log('Integration tests succeeded.');
                    }
                }, 1000);
            }
        };
        var updateInterval_1 = setInterval(gamepad_1.default.processEvents, 16);
        setTimeout(nextTest_1, 33);
    }
    else {
        throw new Error('vJoy not enabled. Install vJoy to run integration tests.');
    }
}
catch (error) {
    console.error('Integration tests failed:');
    console.error(error);
    process.exit(1);
}
//# sourceMappingURL=integrationtest.js.map