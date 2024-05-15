ono

# Hardware:
- ESP32-S2
- RFID-RC522

Connect RFID-RC522 Rfid reader on these pins:
```
SDA: 34
MOSI: 35
SCK: 36
MISO: 37
RST: 0
```

# Setup:
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