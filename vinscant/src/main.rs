use hex::ToHex;
use smart_led_effects::{strip::{EffectIterator, Wipe}, Srgb};
use ws2812_esp32_rmt_driver::{driver::color::LedPixelColorGrb24, LedPixelEsp32Rmt, RGB8};
use core::str;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use embedded_svc::http::{client::Client, Method};
use esp_idf_svc::{
    eventloop::EspSystemEventLoop,
    hal::{
        gpio::{InputPin, OutputPin},
        prelude::Peripherals,
        spi::{
            self, SpiSingleDeviceDriver
        },
    },
    http::client::{Configuration, EspHttpConnection},
    sys::esp_task_wdt_deinit
};

use mfrc522::{
    comm::blocking::spi::SpiInterface, Mfrc522,
};
use palette;

use lib::{ping_pong::PingPong, wifi};

#[toml_cfg::toml_config]
pub struct Config {
    #[default("")]
    wifi_ssid: &'static str,
    #[default("")]
    wifi_psk: &'static str,
    #[default("")]
    auth_key: &'static str,
}

fn from_palette_rgb_to_rgb_rgb(value: &palette::rgb::Rgb<palette::encoding::Srgb, u8>) -> RGB8 {
    let [red, green, blue] = [value.red, value.green, value.blue];
    RGB8::new(red / 8, green / 8, blue / 8)
}

struct StatusNotifier<'a> {
    led_strip: LedPixelEsp32Rmt::<'a, RGB8, LedPixelColorGrb24>,
    leds: usize,
    idle_effect: Box<dyn EffectIterator>,
}
impl StatusNotifier<'_> {
    fn idle(&mut self) {
        let pixels = self.idle_effect.next().unwrap();
        let _ = self.led_strip.write_nocopy(pixels.iter().map(|color| from_palette_rgb_to_rgb_rgb(color)));
    }
    fn processing(&mut self) {
        let pixels = std::iter::repeat(RGB8::new(0xff, 0xff, 0x00)).take(self.leds);
        let _ = self.led_strip.write_nocopy(pixels);
    }
    fn good(&mut self) {
        let pixels = std::iter::repeat(RGB8::new(0x00, 0xff, 0x00)).take(self.leds);
        let _ = self.led_strip.write_nocopy(pixels);
        self.sleep();
    }
    fn bad(&mut self) {
        let pixels = std::iter::repeat(RGB8::new(0xff, 0x00, 0x00)).take(self.leds);
        let _ = self.led_strip.write_nocopy(pixels);
        self.sleep();
    }
    fn sleep(&self) {
        std::thread::sleep(Duration::from_millis(500));
    }
}

fn get_time() -> u64 {
    SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs()
}

fn main() {
    unsafe {
        esp_task_wdt_deinit();
    }
    // It is necessary to call this function once. Otherwise some patches to the runtime
    // implemented by esp-idf-sys might not link properly. See https://github.com/esp-rs/esp-idf-template/issues/71
    esp_idf_svc::sys::link_patches();

    // Bind the log crate to the ESP Logging facilities
    esp_idf_svc::log::EspLogger::initialize_default();

    let peripherals = Peripherals::take().unwrap();
    let sysloop = EspSystemEventLoop::take().unwrap();

    // The constant `CONFIG` is auto-generated by `toml_config`.
    let app_config = CONFIG;

    let _wifi_thing = wifi::wifi(app_config.wifi_ssid, app_config.wifi_psk, peripherals.modem, sysloop);

    let pins = peripherals.pins;

    let scan_spi_device = SpiSingleDeviceDriver::new_single(
        peripherals.spi2,
        // esp32s2
        //pins.gpio34.downgrade_output(), // SCK
        // esp32
        pins.gpio0.downgrade_output(), // SCK
        // esp32s2
        //pins.gpio35.downgrade_output(), // MOSI
        // esp32
        pins.gpio4.downgrade_output(), // MOSI
        // esp32s2
        //Some(pins.gpio36.downgrade_input()), // MISO
        // esp32
        Some(pins.gpio27.downgrade_input()), // MISO
        // esp32s2
        //Some(pins.gpio33.downgrade_output()), // CS/SDA
        // esp32
        Some(pins.gpio13.downgrade_output()), // CS/SDA
        &spi::config::DriverConfig::new(),
        &spi::config::Config::new()
    ).unwrap();
    let scan_interface = SpiInterface::new(scan_spi_device);
    let mut scanner = Mfrc522::new(scan_interface).init().unwrap();

    // esp32s2
    //let led_pin = pins.gpio?;
    // esp32
    let led_pin = pins.gpio5;
    let channel = peripherals.rmt.channel0;
    let mut led_strip = LedPixelEsp32Rmt::<RGB8, LedPixelColorGrb24>::new(channel, led_pin).unwrap();

    let mut status_notifier = StatusNotifier {
        led_strip,
        leds: 8,
        idle_effect: Box::new(PingPong::new(8, vec![Srgb::new(0xff, 0x7f, 0x00)])),
    };

    let mut last_uid = hex::encode([0_u8]);
    let mut last_time = 0;

    loop {
        if let Ok(answer) = scanner.reqa() {
            if let Ok(uid) =  scanner.select(&answer) {
                if hex::encode(uid.as_bytes()) == last_uid && get_time() - last_time <= 15 {
                    log::error!("Card already seen!");
                    last_time = get_time();
                    status_notifier.bad();
                    continue;
                }
                last_time = get_time();
                last_uid = uid.as_bytes().encode_hex();
                status_notifier.processing();
                log::info!("Card found: {}", hex::encode(uid.as_bytes()));
                let mut client = Client::wrap(EspHttpConnection::new(&Configuration {
                    use_global_ca_store: true,
                    crt_bundle_attach: Some(esp_idf_svc::sys::esp_crt_bundle_attach),
                    ..Default::default()
                }).unwrap());

                let mut request = client.request(Method::Post, "https://zess.zeus.gent/api/scans".as_ref(), &[]).unwrap();
                let _ = request.write(format!("{};{}", hex::encode(uid.as_bytes()), app_config.auth_key).as_bytes());
                if let Ok(response) = request.submit() {
                    log::info!("response code: {}", response.status());
                    if response.status() == 200 {
                        status_notifier.good();
                    } else {
                        status_notifier.bad();
                    }
                } else {
                    status_notifier.bad();
                }
            }
        } else {
            status_notifier.idle();
        }
    };
}
