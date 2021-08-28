function getRegister (registerAddress: number) {
    pins.i2cWriteNumber(
    deviceAddress,
    registerAddress,
    NumberFormat.UInt8BE,
    true
    )
    return pins.i2cReadNumber(registerAddress, NumberFormat.UInt8BE, false)
}
function calibrateAFE () {
    return 0
}
function getBit (bitNumber: number, registerAddress: number) {
    value = getRegister(registerAddress)
    value &= (1 << bitNumber)
return value
}
function setGain (gainValue: number) {
    return 0
}
function setLDO (ldoValue: number) {
    return 0
}
function clearBit (bitNumber: number, registerAddress: number) {
    value = getRegister(registerAddress)
    value &= ~(1 << bitNumber)
return setRegister(registerAddress, value)
}
function begin (initialize: boolean) {
    if (isConnected() == 0) {
        if (isConnected() == 0) {
            return 0
        }
    } else {
        result = 1
    }
    if (initialize) {
        result &= reset()
result &= powerUp()
result &= setLDO(1)
result &= setGain(1)
result &= setSampleRate(1)
result &= setRegister(1, 1)
    }
    return 0
}
function powerUp () {
    return 0
}
function setBit (bitNumber: number, registerAddress: number) {
    value = getRegister(registerAddress)
    value |= (1 << bitNumber)
}
function reset () {
    setBit(PU_CTRL_RR, PU_CTRL)
    basic.pause(1)
    return clearBit(PU_CTRL_RR, PU_CTRL)
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
    return 1
}
function setSampleRate (rate: number) {
    return 0
}
// Test for ACK - dummy for now, casn ubit do this?
function isConnected () {
    return 1
}
let PU_CTRL_RR = 0
let deviceAddress = 0
let PU_CTRL = 0
let result = 0
let value = 0
let CTRL2_CALMOD = 0
PU_CTRL = 0
let CTRL1 = 1
let CTRL1_GAIN = 2
let CTRL1_VLDO = 5
let CTRL1_DRDY_SEL = 6
let CTRL1_CRP = 7
let CTRL2 = 2
let CTRL2_CALS = 2
let CTRL2_CAL_ERROR = 3
let CTRL2_CRS = 4
let CTRL2_CHS = 7
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
deviceAddress = 42
PU_CTRL_RR = 0
