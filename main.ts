function getRegister (registerAddress: number) {
    pins.i2cWriteNumber(
    deviceAddress,
    registerAddress,
    NumberFormat.UInt8BE,
    true
    )
    return pins.i2cReadNumber(registerAddress, NumberFormat.UInt8BE, false)
}
function getBit (bitNumber: number, registerAddress: number) {
    value = getRegister(registerAddress)
    value = value & (1 << bitNumber)
return value
}
function setRegister (registerAddress: number, value: number) {
    pins.i2cWriteNumber(
    deviceAddress,
    registerAddress,
    NumberFormat.UInt8BE,
    true
    )
    pins.i2cWriteNumber(
    deviceAddress,
    value,
    NumberFormat.UInt8BE,
    false
    )
}
let deviceAddress = 0
let PU_CTRL = 0
let CTRL1 = 1
let CTRL2 = 2
let OCAL1_B2 = 3
let OCAL1_B1 = 4
let OCAL1_B0 = 5
let value = 0
deviceAddress = 42
