ono

# Hardware:

- [ESP32-S2](https://web.archive.org/web/20241012003116/https://docs.espressif.com/projects/esp-idf/en/latest/esp32s2/hw-reference/esp32s2/user-guide-saola-1-v1.2.html)
- RFID-RC522

Connect RFID-RC522 Rfid reader on these pins:
|        | esp32s2 | esp32 |
|--------|---------|-------|
| SDA/CS |      33 |    13 |
| MOSI   |      35 |     4 |
| SCK    |      34 |     0 |
| MISO   |      36 |    27 |
| RST    |       / |     / |

# Setup:

- If you're on windows and the board is not detected: install the ESP32-S2 toolchain from https://dl.espressif.com/dl/esp-idf/
  - Or just install the usb chip driver for your board (eg. for CP2102N: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads)
- Install micropython
  - Get binary for correct chip. Current: https://micropython.org/download/ESP32_GENERIC_S2/
  - install using commands on that website
- connect to serial
- connect to wifi and setup webrepl (see https://docs.micropython.org/en/latest/esp8266/tutorial/repl.html)
- get `webrepl_cli.py` from https://github.com/micropython/webrepl
- copy all the files in `mpfiles` and `key.txt` (with the correct key set on vingo) to the microcontroller using `upload_file.sh`
- beep boop

# Future additions

- Beeps
- Boops
- Status light based on server response
- Switch to esp-rs
