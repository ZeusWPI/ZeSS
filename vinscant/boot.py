from time import sleep
import network
import webrepl

def connect_wifi():
    print("Connecting to WiFi")
    wlan.connect('Zeus WPI', 'zeusisdemax')
    while wlan.isconnected() == False:
        print(".")
        sleep(1)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
connect_wifi()
print(wlan.ifconfig())

webrepl.start()

print("boot done")