import machine
import time
time.sleep(0.1)



led = machine.Pin(18, machine.Pin.OUT)
button = machine.Pin(13, machine.Pin.IN, machine.Pin.PULL_UP)

while True:
    if button.value() == 0:
        led.on()
    else:
        led.off()
    time.sleep(0.05)