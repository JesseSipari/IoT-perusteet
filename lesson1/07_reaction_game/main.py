from machine import Pin
import utime
import urandom

LED_PIN = 15
BUTTON_PIN = 16

led = Pin(LED_PIN, Pin.OUT)
button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)

timer_start = 0
result_us = None

def on_button_press(pin):
    global result_us
    if result_us is None:
        result_us = utime.ticks_us()
        button.irq(handler=None)


def wait_button_release():
    while button.value() == 0:
        utime.sleep_ms(5)


def random_delay_ms(low=2000, high=5000):
    ''' Get random number between [low, high] '''
    range_ms = high - low + 1
    rand_value = urandom.getrandbits(12) % range_ms
    return low + rand_value


print("Reaction game: Press the button when LED is off")

round_num = 1

while True:
    print("\nRound:", round_num)

    led.on()

    utime.sleep_ms(random_delay_ms(2000, 5000))

    led.off()
    timer_start = utime.ticks_us()
    result_us = None

    button.irq(trigger=Pin.IRQ_FALLING, handler=on_button_press)

    while result_us is None:
        utime.sleep_ms(1)

    reaction_time_ms = utime.ticks_diff(result_us, timer_start) / 1000.0
    print("Your reaction time was: {:.1f} ms".format(reaction_time_ms))

    utime.sleep_ms(800)
    round_num += 1




