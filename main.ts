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
let GCAL1_B3 = 6
let GCAL1_B2 = 7
let GCAL1_B1 = 8
let GCAL1_B0 = 9
let OCAL2_B2 = 10
let OCAL2_B1 = 11
let OCAL2_B0 = 12
let GCAL2_B3 = 13
let GCAL2_B2 = 14
let GCAL2_B1 = 15
let GCAL2_B0 = 16
let I2C_Control = 17
let ADCO_B2 = 18
let ADCO_B1 = 19
let ADCO_B0 = 20
let OTP_B1 = 21
let OTP_B0 = 22
let value = 0
deviceAddress = 42
