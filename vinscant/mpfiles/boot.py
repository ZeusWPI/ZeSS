import gc
import machine
import network
import time
import webrepl

network.hostname("vinscant")
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
print("Connecting to WiFi...")
wlan.connect('Zeus WPI', 'zeusisdemax')
while not wlan.isconnected():
    pass
print("Connected to WiFi with ifconfig:", wlan.ifconfig())

print("Starting webrepl...")
webrepl.start()
print("Webrepl started")

print("Heap bytes used before GC:", gc.mem_alloc())
gc.collect()
print("Heap bytes used after GC:", gc.mem_alloc())

print("Boot done")

print("Starting watchdog in 1s, interupt now with Ctrl+C")
time.sleep(1)
watchdog = machine.WDT(timeout=10 * 1000)
print("Watchdog started")
