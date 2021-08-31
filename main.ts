function getRegister (registerAddress: number) {
    // line 384
    pins.i2cWriteNumber(
    deviceAddress,
    registerAddress,
    NumberFormat.UInt8BE,
    true
    )
    return pins.i2cReadNumber(registerAddress, NumberFormat.UInt8BE, false)
}
function getRevisionCode () {
    // line 228
    revisionCode = getRegister(DEVICE_REV)
    return (revisionCode & 0x0F)
}
function calibrateAFE () {
    // line 86
    beginCalibrateAFE()
    return waitForCalibrateAFE(1000)
}
function getBit (bitNumber: number, registerAddress: number) {
    // line 376
    value = getRegister(registerAddress)
    value &= (1 << bitNumber)
return value
}
function setGain (gainValue: number) {
    // line 215
    value = gainValue
    if (gainValue > 7) {
        value = 7
    }
    value |= 0b11111000
return setRegister(CTRL1, value)
}
function setZeroOffset (newZeroOffset: number) {
    // line 299
    _zeroOffset = newZeroOffset
}
// line 199
function setLDO (ldoValue: number) {
    let PU_CTRL_AVDDS: null = null
    value = getRegister(CTRL1)
    value &= 0b11000111
value |= ldoValue << 3
setRegister(CTRL1, value)
    return setBit(PU_CTRL_AVDDS, PU_CTRL)
}
function clearBit (bitNumber: number, registerAddress: number) {
    // line 368
    value = getRegister(registerAddress)
    value &= ~(1 << bitNumber)
return setRegister(registerAddress, value)
}
function setIntPolarityHigh () {
    // line 348
    return clearBit(CTRL1_CRP, CTRL1)
}
function getWeight (allowNegativeWeights: boolean, samplesToTake: number) {
    // line 330
    onScale = getAverage(samplesToTake)
    if (!(allowNegativeWeights)) {
        if (onScale < _zeroOffset) {
            onScale = _zeroOffset
        }
    }
    return (onScale - _zeroOffset) / _calibrationFactor
}
function beginCalibrateAFE () {
    // line 94
    setBit(CTRL2_CALS, CTRL2)
}
function calAFEStatus () {
    // line 100
    if (getBit(CTRL2_CALS, CTRL2) == 1) {
        return CAL_IN_PROGRESS
    } else if (getBit(CTRL2_CAL_ERROR, CTRL2) == 1) {
        return CAL_FAILURE
    } else {
        return CAL_SUCCESS
    }
}
function available () {
    return getBit(PU_CTRL_CR, PU_CTRL)
}
function calculateZeroOffset (averageAmount: number) {
    // line 293
    setZeroOffset(getAverage(averageAmount))
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
result &= setLDO(LDO_3V3)
result &= setGain(GAIN_128)
result &= setSampleRate(SPS_10)
result &= setRegister(ADC, 0x30)
result &= setBit(PGA_PWR_PGA_CAP_EN, PGA_PWR)
result &= calibrateAFE()
    }
    return result
}
function powerUp () {
    setBit(PU_CTRL_PUD, PU_CTRL)
    setBit(PU_CTRL_PUA, PU_CTRL)
    counter = 0
    while (true) {
        let PU_CTRL_PUR: null = null
        if (getBit(PU_CTRL_PUR, PU_CTRL) == 1) {
            basic.pause(1)
            counter += 1
            if (counter > 100) {
                return 0
            }
        }
    }
    return 1
}
function getAverage (averageAmount: number) {
    // line 269
    total = 0
    samplesAquired = 0
    startTime = input.runningTime()
    while (true) {
        if (available() == 1) {
            total += getReading()
            samplesAquired += 1
            if (samplesAquired == averageAmount) {
                break;
            }
        } else if (input.runningTime() - startTime > 1000) {
            return 0
        }
        basic.pause(1)
    }
    total /= averageAmount
return total
}
function setCalibrationFactor (newCalFactor: number) {
    // line 319
    _calibrationFactor = newCalFactor
}
// line 155
function setChannel (channelNumber: number) {
    let CHANNEL_1: null = null
    if (channelNumber == CHANNEL_1) {
        // Channel 1 default
        return clearBit(CTRL2_CHS, CTRL2)
    } else {
        return setBit(CTRL2_CHS, CTRL2)
    }
}
function getZeroOffset () {
    // line 304
    return _zeroOffset
}
function getCalibrationFactor () {
    // line324
    return _calibrationFactor
}
function setBit (bitNumber: number, registerAddress: number) {
    // line 360
    value = getRegister(registerAddress)
    value |= (1 << bitNumber)
return setRegister(registerAddress, value)
}
function setIntPolarityLow () {
    // line 353
    return setBit(CTRL1_CRP, CTRL1)
}
function powerDown () {
    // line 183
    clearBit(PU_CTRL_PUD, PU_CTRL)
    return clearBit(PU_CTRL_PUA, PU_CTRL)
}
function getReading () {
    // Send register address
    pins.i2cWriteNumber(
    deviceAddress,
    ADCO_B2,
    NumberFormat.UInt8BE,
    false
    )
    valueRaw = pins.i2cReadNumber(deviceAddress, NumberFormat.UInt8BE, false) << 16
valueRaw |= pins.i2cReadNumber(deviceAddress, NumberFormat.UInt8BE, false) << 8
valueRaw |= pins.i2cReadNumber(deviceAddress, NumberFormat.UInt8BE, false)
let valueShifted = valueRaw << 8
return valueShifted >> 8
}
function reset () {
    let PU_CTRL_RR: null = null
    // line 190
    setBit(PU_CTRL_RR, PU_CTRL)
    basic.pause(1)
    return clearBit(PU_CTRL_RR, PU_CTRL)
}
function setRegister (registerAddress: number, value: number) {
    // line 401
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
    // line 142
    value = getRegister(CTRL2)
    value &= 0b10001111
value |= rate << 4
return setRegister(CTRL2, value)
}
function calculateCalibrationFactor (weightOnScale: number, averageAmount: number) {
    // line 310
    onScale = getAverage(averageAmount)
    newCalFactor = (onScale - _zeroOffset) / weightOnScale
    setCalibrationFactor(newCalFactor)
}
// Test for ACK - dummy for now, casn ubit do this?
function isConnected () {
    // line 69
    return 1
}
function waitForCalibrateAFE (timeout_ms: number) {
    // line 119
    t_begin = input.runningTime()
    Cal_Status = 0
    while (true) {
        cal_ready = calAFEStatus()
        if (cal_ready == CAL_IN_PROGRESS) {
            if (timeout_ms > 0) {
                if (input.runningTime() - t_begin > timeout_ms) {
                    break;
                }
            }
        }
        basic.pause(1)
    }
    if (cal_ready == CAL_SUCCESS) {
        return 1
    }
    return 0
}
/**
 * variables
 */
/**
 * 10 samples/second
 */
/**
 * register addresses
 */
/**
 * register bits
 */
let cal_ready: null = null
let Cal_Status: null = null
let t_begin: null = null
let newCalFactor: null = null
let startTime: null = null
let samplesAquired: null = null
let counter: null = null
let CAL_SUCCESS: null = null
let _calibrationFactor: null = null
let onScale: null = null
let PU_CTRL: null = null
let _zeroOffset: null = null
let CAL_IN_PROGRESS: null = null
let CAL_FAILURE: null = null
let CTRL2_CHS: null = null
let CTRL2_CAL_ERROR: null = null
let CTRL2_CALS: null = null
let CTRL1_CRP: null = null
let PU_CTRL_CR: null = null
let PU_CTRL_PUA: null = null
let PU_CTRL_PUD: null = null
let DEVICE_REV: null = null
let ADCO_B2: null = null
let CTRL2: null = null
let CTRL1: null = null
let total = 0
let revisionCode = 0
let result = 0
let value = 0
let SPS_10 = 0
let PGA_CHIP_DIS = 0
let CHANNEL_12 = 0
let PGA_PWR_PGA_CURR = 0
let deviceAddress = 0
let valueRaw = 0
let LDO_3V3 = 4
let GAIN_128 = 7
let CHANNEL_2 = 1
// I2C addresses
deviceAddress = 42
CTRL1 = 1
CTRL2 = 2
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
ADCO_B2 = 18
let ADCO_B1 = 19
let ADCO_B0 = 20
// shared with OTP_B1
let ADC = 21
let OTP_B1 = 21
let OTP_B0 = 22
let PGA_PWR = 28
DEVICE_REV = 31
PU_CTRL_PUD = 1
PU_CTRL_PUA = 2
let PU_CTRL_CS = 4
PU_CTRL_CR = 5
let PU_CTRL_OSCS = 6
let PU_CTRL_AVDDS2 = 7
let CTRL1_GAIN = 2
let CTRL1_VLDO = 5
CTRL1_CRP = 7
let CTRL2_CALMOD = 1
CTRL2_CALS = 2
let CTRL2_CRS = 6
CTRL2_CAL_ERROR = 3
CTRL2_CHS = 7
let PGA_PWR_ADC_CURR = 2
let PGA_INV = 3
let PGA_PWR_PGA_CAP_EN = 7
// status codes
CAL_FAILURE = 2
CAL_IN_PROGRESS = 1
