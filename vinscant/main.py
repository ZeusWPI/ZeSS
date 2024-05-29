import mfrc522 
import urequests as req
from machine import Pin, PWM
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
    ledConfig = {
            (True, False, False): (True, False, False),
            (True, True, False): (False, True, False),
            (False, True, False): (False, False, True),
            (False, False, False): (False, False, False)
            }
    def __init__(self, rood=Pin(1, Pin.OUT), geel=Pin(2, Pin.OUT), groen=Pin(3, Pin.OUT)):
        self.rood = rood
        self.geel = geel
        self.groen = groen

    def setColor(self, r, g, b):
        config = Led.ledConfig[tuple(value != 0 for value in (r, g, b))]
        self.rood.value(config[0])
        self.geel.value(config[1])
        self.groen.value(config[2])

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
    colors = ((1,0,0),(1,1,0),(0,1,0))
    def __init__(self, buzzer: Buzzer, led: Led):
        self.buzzer = buzzer
        self.led = led
        self.state = 0

    def processing(self):
        self.led.setColor(255, 127, 0)

    def idle(self):
        self.buzzer.stop()
        self.led.setColor(*StatusNotifier.colors[self.state])
        self.state = (self.state + 1) % 3

    def gotoSleep(self):
        time.sleep(.5)
        self.buzzer.stop()
        time.sleep(1.5)
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
    rdr = mfrc522.MFRC522(rst=16,cs=33,sck=34,mosi=35,miso=36)
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
            notifier.idle()
    except KeyboardInterrupt:
        print("KeyboardInterrupt")
        return

notifier = StatusNotifier(Buzzer(Pin(17, Pin.OUT)), Led())
notifier.idle()
key = get_key()
do_read()
