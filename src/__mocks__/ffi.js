
let last = null;

let mocks = {}

function Library(file, specs) {
    if (file === 'getlast') {
        // console.log('providing most recent mock library')
        return last
    }
    else if (file && specs) {
        // console.log('mocking library...')
        const lib = {}
        for (name in specs) {
            lib[name] = jest.fn(mocks[name])
        }
        last = lib
        return lib
    }
}

function Callback(spec, fn) {
    return jest.fn()
}

module.exports = {
    Library,
    Callback
}