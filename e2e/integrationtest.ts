
import vJoyInterface, { Axis, DiscretePOVDirection, VJDStatus } from '../src/vJoyInterface'
import Gamepad from 'gamepad'

try {
    if (vJoyInterface.vJoyEnabled()) {
        // initialize and get basic information
        console.log(`vJoy ver. ${vJoyInterface.GetvJoyVersion()} enabled.`)
        console.log(
            vJoyInterface.GetvJoyProductString(),
            vJoyInterface.GetvJoyManufacturerString(),
            vJoyInterface.GetvJoySerialNumberString()
        )
        const maxDev = vJoyInterface.GetvJoyMaxDevices()
        const curDev = vJoyInterface.GetNumberExistingVJD()
        console.log(`Devices: ${curDev}/${maxDev}`)
        if (curDev < 1) {
            throw new Error('No devices to test.')
        }

        // get system devices to receive input confirmation
        Gamepad.init()
        const curSys = Gamepad.numDevices();
        if (curSys < 1) {
            throw new Error('No system-recognized devices found.')
        }

        const vDevices = [];
        Gamepad.addListener('move', (id, _axis, _vNew, _vOld, _timestamp) => {
            if (vDevices[id]) {
                //process.stdout.write(id.toString())
                process.stdout.write('@')
                //console.log(`axis ${_axis} moved from ${_vOld} to ${_vNew}`)
                ++vDevices[id].movements
            }
        })
        Gamepad.addListener('down', (id, _button, _timestamp) => {
            if (vDevices[id]) {
                //process.stdout.write(id.toString())
                process.stdout.write('v')
                ++vDevices[id].presses
            }
        })
        Gamepad.addListener('up', (id, _button, _timestamp) => {
            if (vDevices[id]) {
                //process.stdout.write(id.toString())
                process.stdout.write('^')
                ++vDevices[id].releases
            }
        })

        let foundSys = 0
        for (let d = 0; d < curSys; ++d) {
            const system = Gamepad.deviceAtIndex(d)
            //console.log(system)
            if (system.description.startsWith('vJoy')) {
                console.log(` ... found vJoy Device at id ${system.deviceID}`)
                ++foundSys
                const device = {
                    movements: 0,
                    presses: 0,
                    releases: 0,
                    system
                }
                vDevices[system.deviceID] = device
            }
        }
        if (foundSys === 0) {
            throw new Error('No vJoy devices found.')
        }
        if (foundSys === 1) {
            console.warn('Integration tests proceeding with only one vJoy device.  Tests will be incomplete.')
        }

        let foundDev = 0
        let vIdx = 0
        let tests = []
        const exp = {
            movements: 0,
            presses: 0,
            releases: 0
        }
        while (foundDev < curDev && vIdx < maxDev) {
            if (vJoyInterface.isVJDExists(vIdx)) {
                console.log(`Found a device at vJoy index ${vIdx}`)
                ++foundDev

                const status = vJoyInterface.GetVJDStatus(vIdx)
                if (status !== VJDStatus.VJD_STAT_FREE) {
                    throw new Error(`vJoy device is not available.  status code: ${status}`)
                }

                const vjd = vJoyInterface.AcquireVJD(vIdx)
                vjd.reset()

                ;[
                    Axis.X, Axis.Y, Axis.Z, Axis.RX, Axis.RY, Axis.RZ, Axis.SL0, Axis.SL1, Axis.WHL, Axis.POV
                ].map(axis => {
                    if (vjd.axisExists(axis)) {
                        tests.push(() => {
                            vjd.setAxis(0x6000, axis)
                        })
                        ++exp.movements
                    }
                })

                const bNum = vjd.buttonCount
                for (let b = 0; b < bNum; ++b) {
                    tests.push(vjd.setBtn.bind(vjd, true, b+1))
                    ++exp.presses
                    tests.push(vjd.setBtn.bind(vjd, false, b+1))
                    ++exp.releases
                }

                const dNum = vjd.discPovCount
                for (let b = 0; b < dNum; ++b) {
                    tests.push(vjd.setDiscPov.bind(vjd, DiscretePOVDirection.EAST, b+1))
                    ++exp.movements
                    tests.push(vjd.setDiscPov.bind(vjd, DiscretePOVDirection.NEUTRAL, b+1))
                    ++exp.movements
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
            ++vIdx
        }

        if (foundDev < curDev) {
            throw new Error('Not all vJoy devices were accessible.')
        }

        const inputsExpected = tests.length
        console.log(`Testing ${inputsExpected} input events...`)
        console.log('. = input fed, input received => @ = axis/pov movement, v = button press, ^ = button release')
        let lineCnt = 0
        const lineLen = 50
        const nextTest = () => {
            if (tests.length > 0) {
                process.stdout.write('.')
                if (++lineCnt >= lineLen) {
                    process.stdout.write('\n')
                    lineCnt = 0
                }
                const test = tests.shift()
                test()
                setTimeout(nextTest, 33)
            }
            else {
                setTimeout(() => {
                    process.stdout.write('\nAll tests run.\n')
                    clearInterval(updateInterval)
                    const inputsReceived = vDevices.reduce((sum, dev) => sum += dev.movements + dev.presses + dev.releases, 0)
                    const msg = `Received ${inputsReceived} of ${inputsExpected} expected input events`
                    if (inputsReceived == 0) {
                        throw new Error(msg)
                    }
                    else {
                        console.log(msg)
                        console.log(` = ${vDevices.reduce((s, d) => s + d.movements, 0)} axis/pov movements received -- expected ${exp.movements}`)
                        console.log(` = ${vDevices.reduce((s, d) => s + d.presses, 0)} button presses received -- expected ${exp.presses}`)
                        console.log(` = ${vDevices.reduce((s, d) => s + d.releases, 0)} button presses releases -- expected ${exp.releases}`)
                        console.log('Integration tests succeeded.')
                    }
                }, 1000)
            }
        }

        const updateInterval = setInterval(Gamepad.processEvents, 16)
        setTimeout(nextTest, 33)
    }
    else {
        throw new Error('vJoy not enabled. Install vJoy to run integration tests.')
    }
}
catch (error) {
    console.error('Integration tests failed:')
    console.error(error)
    process.exit(1)
}