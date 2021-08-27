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
deviceAddress = 42
basic.forever(function () {
	
})
