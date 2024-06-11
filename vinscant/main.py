import mfrc522 
import urequests as req
from machine import Pin, PWM, WDT, bitstream
import time
from neopixel import NeoPixel
import esp32


def get_key():
    with open("key.txt", "r") as file:
        return file.read().strip()
def uidToString(uid):
    mystring = ""
    for i in uid:
        mystring = "%02X" % i + mystring    
    return mystring

class Led:
    def __init__(self, pin=Pin(18, Pin.OUT)):
        self.neopixel = NeoPixel(pin, 1)

    def setColor(self, r, g, b):
        print("color change begin")
        self.neopixel[0] = (r, g, b)
        print("color change step 1")
        # bitganging causes hang
        # study the following file for more info
        # https://github.com/micropython/micropython/blob/master/extmod/machine_bitstream.c
        # TODO overwrite NeoPixel.write to use RMT directly
        esp32.RMT.bitstream_channel(None)
        self.neopixel.write()
        print("color change done")

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

    def gotoSleep(self):
        time.sleep(.5)
        self.buzzer.stop()
        time.sleep(1.5)
        self.idle()
        

    def good(self, name=None):
        self.led.setColor(*StatusNotifier.colors[2])
        self.buzzer.start(500)
        if name:
            leddy.setText(f"Welkom {name}!")
        self.gotoSleep()

    def error(self):
        self.led.setColor(*StatusNotifier.colors[0])
        self.buzzer.start(250)
        self.gotoSleep()

class Leddy:
    def __init__(self, address="http://10.0.2.3") -> None:
        self.address = address

    def _post(self, command: str):
        try:
            req.post(self.address, data=command, timeout=2).close()
        except Exception:
            print("vinscant: leddy doesn't work :\x28") # indentation does weird

    def setText(self, text: str):
        self._post(f"Option autoResetMs {5 * 1000}")
        self._post(f"ScrollingText {text}")
    
def do_read():
    rdr = mfrc522.MFRC522(rst=16,cs=33,sck=34,mosi=35,miso=36)
    lastUid = ''
    lastTime = 0

    print("vinscant: watchdog starting in 2s, interupt now with Ctrl+C")
    time.sleep(2)
    watchdog = WDT(timeout=10 * 1000)
    print("vinscant: watchdog started")

    print("")
    print("Place card before reader to read from address 0x08")
    print("")

    try:
        while True:
            (stat, tag_type) = rdr.request(rdr.REQIDL)
            if stat == rdr.OK:
                (stat, uid) = rdr.SelectTagSN()
                if stat == rdr.OK:
                    # beep
                    notifier.processing()
                    uid = uidToString(uid)
                    currentTime = time.time()
                    print("vinscant: Card detected %s" % uid)
                    if uid != lastUid or currentTime - lastTime > 5:
                        res = req.post("https://zess.zeus.gent/scans", data=f"{uid};{key}")
                        print("vingo: " + res.text)
                        name = res.text
                        res.close()
                        # beep beep
                        if 200 <= res.status_code < 300:
                            notifier.good(name)
                        else:
                            notifier.error()
                    else:
                        print("vinscant: Card already seen")
                        notifier.error()
                    lastUid = uid
                    lastTime = currentTime
                else:
                    print("Authentication error")
                    notifier.error()
            notifier.idle()
            watchdog.feed()
    except KeyboardInterrupt:
        print("KeyboardInterrupt")
        watchdog = WDT(timeout=60 * 60 * 1000)
        return

notifier = StatusNotifier(Buzzer(Pin(37, Pin.OUT)), Led())
notifier.idle()
key = get_key()
leddy = Leddy()
do_read()
