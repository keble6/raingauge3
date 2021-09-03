function available() {
    //line 77
    if (getBit(PU_CTRL_CR, PU_CTRL)) {
        return true
    } else {
        return false
    }

}
function begin(initialize: boolean) {
    //line 30
    if (isConnected() == false) {
        if (isConnected() == false) { //2nd try
            return false
        }
    }
    let result = true
    if (initialize) {
        result = result && reset()
        serial.writeLine("init1 =" + result)
        result = result && powerUp()
        serial.writeLine("init2 =" + result)
        result = result && setLDO(LDO_3V3)
        serial.writeLine("init3 =" + result)
        result = result && setGain(GAIN_128)
        serial.writeLine("init4 =" + result)
        result = result && setSampleRate(SPS_10)
        serial.writeLine("init5 =" + result)
        result = result && setRegister(ADC, 0x30)
        serial.writeLine("init6 =" + result)
        result = result && setBit(PGA_PWR_PGA_CAP_EN, PGA_PWR)
        serial.writeLine("init7 =" + result)
        result = result && calibrateAFE()
        serial.writeLine("init8 =" + result)
    }

    return result
}
function beginCalibrateAFE() {
    // line 94
    setBit(CTRL2_CALS, CTRL2)
}
function calculateCalibrationFactor(weightOnScale: number, averageAmount: number) {
    // line 310
    let onScale = getAverage(averageAmount)
    let newCalFactor = (onScale - _zeroOffset) / weightOnScale
    setCalibrationFactor(newCalFactor)
}

function calculateZeroOffset(averageAmount: number) {
    // line 293
    setZeroOffset(getAverage(averageAmount))
}
function calibrateAFE() {
    // line 86
    beginCalibrateAFE()
    return waitForCalibrateAFE(1000)
}
function clearBit(bitNumber: number, registerAddress: number) {
    // line 368
    let value = getRegister(registerAddress)
    value &= ~(1 << bitNumber)
    return setRegister(registerAddress, value)
}
function getAverage(averageAmount: number) {
    // line 269
    let total = 0
    let samplesAquired = 0
    let startTime = input.runningTime()
    while (true) {
        if (available() == true) {
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
function getBit(bitNumber: number, registerAddress: number) {
    // line 376
    let value = getRegister(registerAddress)
    value &= (1 << bitNumber)
    value = value >>> bitNumber // added because original returns a number, not a boolean!
    return value
}
function getCalibrationFactor() {
    // line324
    return _calibrationFactor
}
function getReading() {
    // Send register address
    pins.i2cWriteNumber(
        deviceAddress,
        ADCO_B2,
        NumberFormat.UInt8BE,
        false
    )
    let valueRaw = pins.i2cReadNumber(deviceAddress, NumberFormat.UInt8BE, false) << 16
    valueRaw |= pins.i2cReadNumber(deviceAddress, NumberFormat.UInt8BE, false) << 8
    valueRaw |= pins.i2cReadNumber(deviceAddress, NumberFormat.UInt8BE, false)
    let valueShifted = valueRaw << 8
    return valueShifted >> 8
}
function getRegister (registerAddress: number) {
    // line 384
    pins.i2cWriteNumber(deviceAddress,registerAddress,
    NumberFormat.UInt8BE,false)
    return pins.i2cReadNumber(deviceAddress, NumberFormat.UInt8BE, false)
}
function getRevisionCode () {
    // line 228
    let revisionCode = getRegister(DEVICE_REV)
    return (revisionCode)
}
function getWeight(allowNegativeWeights: boolean, samplesToTake: number) {
    // line 330
    let onScale = getAverage(samplesToTake)
    if (!(allowNegativeWeights)) {
        if (onScale < _zeroOffset) {
            onScale = _zeroOffset
        }
    }
    return (onScale - _zeroOffset) / _calibrationFactor
}
function getZeroOffset() {
    // line 304
    return _zeroOffset
}
// Test for ACK - dummy for now, can ubit do this?
function isConnected() {
    // line 69
    return true
}
function powerDown() {
    // line 183
    clearBit(PU_CTRL_PUD, PU_CTRL)
    return clearBit(PU_CTRL_PUA, PU_CTRL)
}
function powerUp() {
    //line 164
    setBit(PU_CTRL_PUD, PU_CTRL) //power up digital
    setBit(PU_CTRL_PUA, PU_CTRL) //power up analog
    //debug - bit 3 should be 1
    let result = getRegister(PU_CTRL)
    //serial.writeLine("PU_CTRL =" + result)
    //result = getBit(PU_CTRL_PUR, PU_CTRL)
    //serial.writeLine("PU_PUR =" + result)
    //end debug
    let counter = 0
    while (true) {
        if (getBit(PU_CTRL_PUR, PU_CTRL) == 1) { //read ready bit
            break
        }
        basic.pause(1)
        counter += 1
        if (counter > 100) {
            return false
        }
    }
    return true
}
function reset() {
    // line 190
    setBit(PU_CTRL_RR, PU_CTRL)
    basic.pause(1)
    return clearBit(PU_CTRL_RR, PU_CTRL)
}
function setBit(bitNumber: number, registerAddress: number) {
    // line 360
    let value = getRegister(registerAddress)
    value |= (1 << bitNumber)
    return setRegister(registerAddress, value)
}

function setCalibrationFactor(newCalFactor: number) {
    // line 319
    _calibrationFactor = newCalFactor
}
// line 155
function setChannel(channelNumber: number) {
    let CHANNEL_1: null = null
    if (channelNumber == CHANNEL_1) {
        // Channel 1 default
        return clearBit(CTRL2_CHS, CTRL2)
    } else {
        return setBit(CTRL2_CHS, CTRL2)
    }
}
function setGain (gainValue: number) {
    // line 215
    if (gainValue > 7) {
        gainValue = 7
    }
    let value = getRegister(CTRL1)
    value &= 0b11111000
    value |= gainValue
return setRegister(CTRL1, value)
}
function setIntPolarityHigh() {
    // line 348
    return clearBit(CTRL1_CRP, CTRL1)
}
function setIntPolarityLow() {
    // line 353
    return setBit(CTRL1_CRP, CTRL1)
}
// line 199
function setLDO(ldoValue: number) {
    if (ldoValue > 0b111) {
        ldoValue = 0b111
    }
    let value = getRegister(CTRL1)
    value &= 0b11000111
    value |= ldoValue << 3
    setRegister(CTRL1, value)
    return setBit(PU_CTRL_AVDDS, PU_CTRL)
}
function setRegister(registerAddress: number, value: number) {
    // line 401
    let buf = pins.createBuffer(2)
    buf[0] = registerAddress
    buf[1] = value
    pins.i2cWriteBuffer(deviceAddress, buf)
    return true
}
function setSampleRate(rate: number) {
    // line 142
    if (rate > 0b111) {
        rate = 0b111
    }
    let value = getRegister(CTRL2)
    value &= 0b10001111 ///clear CRS bits
    value |= rate << 4  //Mask in new CRS bits
    return setRegister(CTRL2, value)
}
function waitForCalibrateAFE (timeout_ms: number) {
    // line 119
    let t_begin = input.runningTime()
    let cal_ready = 0
    while ((cal_ready = getBit(CTRL2_CALS, CTRL2)) == CAL_IN_PROGRESS) {
        if ((timeout_ms > 0) && ((input.runningTime() - t_begin) > timeout_ms)) {
            break;
        }
        basic.pause(1)
    }
    if (cal_ready == CAL_SUCCESS) {
        return true
    }
    return false
}
/**
 * variables
 */
let _zeroOffset:any = 1
let _calibrationFactor:any = 1
let LDO_3V3 = 4
let GAIN_128 = 7
let CHANNEL_2 = 1
// I2C addresses
let deviceAddress = 42
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
// shared with OTP_B1
let ADC = 21
let OTP_B1 = 21
let OTP_B0 = 22
let PGA_PWR = 28
let DEVICE_REV = 31
//register bits
let PU_CTRL_RR = 0
let PU_CTRL_PUD = 1
let PU_CTRL_PUA = 2
let PU_CTRL_PUR = 3
let PU_CTRL_CS = 4
let PU_CTRL_CR = 5
let PU_CTRL_OSCS = 6
let PU_CTRL_AVDDS = 7
let CTRL1_GAIN = 2
let CTRL1_VLDO = 5
let CTRL1_CRP = 7
let CTRL2_CALMOD = 1
let CTRL2_CALS = 2
let CTRL2_CRS = 6
let CTRL2_CAL_ERROR = 3
let CTRL2_CHS = 7
let PGA_PWR_PGA_CURR = 0
let PGA_PWR_ADC_CURR = 2
let PGA_CHIP_DIS = 0
let PGA_INV = 3
let PGA_PWR_PGA_CAP_EN = 7
let SPS_10 = 0

let CHANNEL_12 = 0

// status codes
let CAL_FAILURE = 2
let CAL_IN_PROGRESS = 1
let CAL_SUCCESS = 0

//test I2C
// Need to add debug in begin code!
serial.writeLine("")
serial.writeLine("S T A R T I N G !")
serial.writeLine("begin result =" + begin(true))
serial.writeLine("Rev code = " + getRevisionCode())
serial.writeLine("DEVICE_REV = " + DEVICE_REV)


function setZeroOffset(newZeroOffset: number) {
    // line 299
    _zeroOffset = newZeroOffset
}




//not used - waitForCalibrateAFE now uses direct status call via getBit
/*function calAFEStatus () {
    // line 100
    if (getBit(CTRL2_CALS, CTRL2) == 1) {
        return CAL_IN_PROGRESS
    } else if (getBit(CTRL2_CAL_ERROR, CTRL2) == 1) {
        return CAL_FAILURE
    } else {
        return CAL_SUCCESS
    }
}*/