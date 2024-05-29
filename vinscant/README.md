ono

# Hardware:
- ESP32-S2
- RFID-RC522

Connect RFID-RC522 Rfid reader on these pins:
```
SDA/CS: 34
MOSI: 35
SCK: 34
MISO: 36
RST: 16
```

# Setup:
- If you're on windows and the board is not detected: install the ESP32-S2 toolchain from https://dl.espressif.com/dl/esp-idf/
    - Or just install the usb chip driver for your board (eg. for CP2102N: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads)
- Install micropython
    - Get binary for correct chip. Current: https://micropython.org/download/ESP32_GENERIC_S2/
    - install using commands on that website
- connect to serial
- connect to wifi and setup webrepl (see https://docs.micropython.org/en/latest/esp8266/tutorial/repl.html)
- get `webrepl_cli.py` from https://github.com/micropython/webrepl
- copy `boot.py`, `main.py` and `key.txt` (with the correct key set on vingo) to the microcontroller using `upload_file.sh`
- download https://github.com/danjperron/micropython-mfrc522/blob/master/mfrc522.py and copy it to the microcontroller as well 
- beep boop

# Future additions
- Beeps
- Boops
- Status light based on server response
- Switch to esp-rs
