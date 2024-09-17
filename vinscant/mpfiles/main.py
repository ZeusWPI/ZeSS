from machine import bitstream, Pin, PWM, WDT, Timer
from neopixel import NeoPixel
import esp32
import gc
import time
import urequests as req
from umqtt.robust import MQTTClient

from lib.mfrc522 import MFRC522
import lib.term_color as tc

def get_key():
    with open("res/key.txt", "r") as f:
        return f.read().strip()

def uid_to_string(uid):
    ret = ""
    for i in uid:
        ret = "%02X" % i + ret
    return ret

class Led:
    def __init__(self, pin: Pin):
        self.neopixel = NeoPixel(pin, 1)

    def setColor(self, r, g, b):
        #print("color change begin")
        self.neopixel[0] = (r, g, b)
        # rmt causes hang
        # bitbanging causes green to always be 255
        # study the following file for more info
        # https://github.com/micropython/micropython/blob/master/extmod/machine_bitstream.c
        esp32.RMT.bitstream_channel(None) # disable RMT, use bitbanging
        self.neopixel.write()

    def turnOff(self):
        self.setColor(0, 0, 0)

class Buzzer:
    def __init__(self, pin: Pin):
        self.pin = pin
        self.pwm: PWM = None

    def start(self, frequency=500):
        self.pwm = PWM(self.pin, freq=frequency)

    def stop(self):
        if self.pwm:
            self.pwm.deinit()

class StatusNotifier:
    colors = ((255, 0, 0), (255, 127, 0), (0, 255, 0))

    def __init__(self, buzzer: Buzzer, led: Led):
        self.buzzer = buzzer
        self.led = led
        self.state = 0

    def processing(self):
        self.led.setColor(*StatusNotifier.colors[1])

    def idle(self):
        self.buzzer.stop()
        self.led.setColor(*StatusNotifier.colors[self.state])
        self.state = (self.state + 1) % 3

    def gotoSleep(self, timer: Timer = None):
        print("(StatusNotifier will sleep and feed watchdog for some time)")
        watchdog.feed()
        if timer:
            timer.deinit()
        else:
            time.sleep(.5)
            watchdog.feed()
        self.buzzer.stop()
        time.sleep(1.5)
        watchdog.feed()
        self.idle()

    def good(self, name=None):
        self.led.setColor(*StatusNotifier.colors[2])
        self.buzzer.start(500)
        Timer(0).init(period=500, mode=Timer.ONE_SHOT, callback=self.gotoSleep)
        if name:
            leddy.setText(f"Welkom {name}!")
        mqtt = Mqtt()
        mqtt.blink()
        mqtt.close()

    def error(self):
        self.led.setColor(*StatusNotifier.colors[0])
        self.buzzer.start(250)
        self.gotoSleep()

class Leddy:
    def __init__(self, address="http://leddy") -> None:
        self.address = address

    def _post(self, command: str):
        try:
            req.post(self.address, data=command, timeout=2).close()
        except Exception:
            print("vinscant: leddy doesn't work :\x28") # indentation does weird

    def setText(self, text: str):
        watchdog.feed()
        self._post(f"Option autoResetMs {5 * 1000}")
        watchdog.feed()
        time.sleep(1)
        watchdog.feed()
        self._post(f"ScrollingText {text}")
        watchdog.feed()

class Mqtt:
    def __init__(self, name="vinscant", host="korner", port="1883") -> None:
        self.client = MQTTClient(name, host, port)
        self.client.connect()

    def blink(self):
        topic = 'zigbee2mqtt/lights/set'
        payload = '{"effect": "blink"}'
        self.client.publish(bytes(topic, 'utf-8'), bytes(payload, 'utf-8'))

    def close(self):
        self.client.disconnect()

print("Starting Vinscant...")

print("- Loading config...")
led_pin          = Pin(18, Pin.OUT)
buzzer_pin       = Pin(37, Pin.OUT)
scanner_pin_nrst = Pin(16, Pin.OUT)
scanner_pin_cs   = Pin(33, Pin.OUT)
scanner_pin_sck  = Pin(34, Pin.OUT)
scanner_pin_mosi = Pin(35, Pin.OUT)
scanner_pin_miso = Pin(36, Pin.OUT)
key: str = get_key()

print("- Creating class instances...")
led = Led(pin=led_pin)
buzzer = Buzzer(pin=buzzer_pin)
notifier = StatusNotifier(buzzer=buzzer, led=led)
leddy = Leddy()
scanner = MFRC522(rst=scanner_pin_nrst, cs=scanner_pin_cs, sck=scanner_pin_sck, mosi=scanner_pin_mosi, miso=scanner_pin_miso)
last_uid = ''
last_time = 0

print("- Idling StatusNotifier...")
notifier.idle()

print("- Running main loop...")

try:
    while True:
        watchdog.feed()

        print("Start of loop")

        heap_used_before = gc.mem_alloc()
        gc.collect()
        heap_used_after = gc.mem_alloc()
        print(f"GC collected {heap_used_before - heap_used_after} bytes")

        watchdog.feed()

        print(f"{tc.BOLD}Place card before reader to read from address 0x08{tc.RESET}")
        while scanner.request(scanner.REQIDL)[0] != scanner.OK:
            watchdog.feed()
            notifier.idle()
            time.sleep(0.5) # Give webrepl some time to breathe
            watchdog.feed()

        watchdog.feed()

        status, uid = scanner.SelectTagSN()
        if status != scanner.OK:
            print(f"{tc.YELLOW}Error during SelectTagSN{tc.RESET}")
            notifier.error()
            continue

        watchdog.feed()

        notifier.processing()
        uid = uid_to_string(uid)
        print(f"Detected card: {uid}")

        current_time = time.time()
        if uid == last_uid and current_time - last_time <= 15:
            print(f"{tc.YELLOW}Card already seen{tc.RESET}")
            notifier.error()
            continue
        last_uid = uid
        last_time = current_time

        res = req.post("https://zess.zeus.gent/api/scans", data=f"{uid};{key}")
        watchdog.feed()
        if 200 <= res.status_code < 300:
            name = res.text
            print(f"vingo: {res.status_code} {tc.GREEN}{name}{tc.RESET}")
            notifier.good(name)
        else:
            print(f"vingo: {res.status_code} {tc.YELLOW}{res.text}{tc.RESET}")
            notifier.error()
        res.close() # does not support with statements

except KeyboardInterrupt:
    print(f"{tc.RED}KeyboardInterrupt{tc.RESET}")
    watchdog = WDT(timeout=60 * 60 * 1000)
