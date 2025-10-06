from machine import Pin
import time



# I/O

led_red = Pin(15, Pin.OUT)
led_yellow = Pin(14, Pin.OUT)
led_green = Pin(13, Pin.OUT)

button = Pin(16, Pin.IN, Pin.PULL_UP)
buzzer = Pin(12,Pin.OUT)


# Helper Functions

def set_all_off():
    led_red.off()
    led_yellow.off()
    led_green.off()


def sleep_check(total_ms, step_ms=50):
    t0 = time.ticks_ms()
    while time.ticks_diff(time.ticks_ms(), t0) < total_ms:
        if button.value() == 0:
            return False
        time.sleep_ms(step_ms)
    return True


def cycle_lights():
    
    # YELLOW
    set_all_off()
    led_yellow.on()
    if not sleep_check(1000): return

    # GREEN
    set_all_off()
    led_green.on()
    if not sleep_check(3000): return

    # YELLOW
    set_all_off()
    led_yellow.on()
    if not sleep_check(1000): return

    # RED
    set_all_off()
    led_red.on()
    if not sleep_check(3000): return




# MAIN LOOP

while True:
    if button.value() == 0:
        set_all_off()
        led_red.on()
        buzzer.on()
        time.sleep(3)
        buzzer.off()
        time.sleep(1)
    else:
        cycle_lights()