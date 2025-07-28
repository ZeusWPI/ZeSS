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
  - Or switch to Linux (recommended option)
- Install [esp-rs](https://docs.espressif.com/projects/rust/book/installation/riscv-and-xtensa.html)
```sh
cargo install espup
espup install
```
- connect to serial
- `cargo run`
- beep boop

# Future additions

- [x] Beeps
- [x] Boops
- [x] Status light based on server response
- [x] Switch to esp-rs
