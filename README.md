# jsJoy

A NodeJS wrapper for the vJoy Feeder SDK

## Notes
* Should work for both x64 and x32 architectures.  I have code detecting which NodeJS architecture you're running and picking the appropriate DLL, but I've only tested x64.
* Some of the integration testing may be innaccurate.  I'm using NPM library `gamepad` to verify the fed input, but it doesn't seem to like continuous POV hats and there's still something wonky with the linear axis output.  I'll get to that.
* I did not implement force feedback at all.  Let me know if you want it.
* `GetvJoyProductString`, `GetvJoyManufacturerString` and `GetvJoySerialNumberString` currently return only the first character in the string because I haven't bothered to figure that aspect of `node-ffi` out yet.  Sorry.
* The vJoy SDK docs list two approaches to feeding data.  I'm using the 'robust' version because it was easiest to implement, but I have some code in place to switch to the 'efficient' version, which I will complete in the future.
* Linear axis values are 0-0x8000, Continuous POV hat values are 0-36000.  I may change these to more intuitive values in the future (-1 to 1 and 0-360).
* Button indices are 1-128. POV indices are 1-4.

## Usage

```typescript
import vJoyInterface, { vJoyDevice, Axis, DiscretePOVDirection } from 'jsjoy'

const devices: vJoyDevice[] = [];

if (vJoyInterface.vJoyEnabled() && vJoyInterface.GetNumberExistingVJD() > 0) {
    const max = vJoyInterface.GetvJoyMaxDevices();
    for (let i = 1; i <= max; ++i) {
        try {
            devices.push(vJoyInterface.AcquireVJD(i))
        }
        catch (err: Error) {
            console.warn(`No vJoy device in slot ${i}`)
        }
    }
}

if (devices.length > 0) {
    devices[0].setAxis(0x4000, Axis.X);
    devices[0].setBtn(true, 1);
    devices[0].setDiscPov(DiscretePOVDirect.NORTH, 1);
    devices[0].setContPov(18000, 1);

    devices[0].relinquish();
}
```