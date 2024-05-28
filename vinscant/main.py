import mfrc522 
import urequests as req
from machine import Pin, Timer, PWM
from neopixel import NeoPixel
import time


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
        self.neopixel[0] = (r, g, b)
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
    def __init__(self, buzzer: Buzzer, led: Led):
        self.buzzer = buzzer
        self.led = led

    def processing(self):
        self.led.setColor(255, 127, 0)

    def idle(self, timer=None):
        self.led.turnOff()
        self.buzzer.stop()
        if timer:
            timer.deinit()

    def gotoSleep(self):
        time.sleep(.5)
        self.idle()
        

    def good(self):
        self.led.setColor(0, 255, 0)
        self.buzzer.start(500)
        self.gotoSleep()

    def error(self):
        self.led.setColor(255, 0, 0)
        self.buzzer.start(250)
        self.gotoSleep()

    
def do_read():
    rdr = mfrc522.MFRC522(sck=36,mosi=35,miso=37,rst=0,cs=34)
    lastUid = ''
    lastTime = 0

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
                        res.close()
                        # beep beep
                        if 200 <= res.status_code < 300:
                            notifier.good()
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
    except KeyboardInterrupt:
        print("KeyboardInterrupt")
        return

notifier = StatusNotifier(Buzzer(Pin(17, Pin.OUT)), Led())
notifier.idle()
key = get_key()
do_read()
