use esp_idf_svc::mqtt::client::{EspMqttClient, QoS};
use smart_led_effects::strip::EffectIterator;
use std::time::Duration;
use ws2812_esp32_rmt_driver::{driver::color::LedPixelColorGrb24, LedPixelEsp32Rmt, RGB8};

use crate::buzzer::Buzzer;

fn from_palette_rgb_to_rgb_rgb(value: &palette::rgb::Rgb<palette::encoding::Srgb, u8>) -> RGB8 {
    let [red, green, blue] = [value.red, value.green, value.blue];
    RGB8::new(red / 8, green / 8, blue / 8)
}

pub struct StatusNotifier<'a> {
    pub led_strip: LedPixelEsp32Rmt<'a, RGB8, LedPixelColorGrb24>,
    pub leds: usize,
    pub idle_effect: Box<dyn EffectIterator>,
    pub buzzer: Buzzer<'a>,
    pub mqtt_client: EspMqttClient<'a>
}
impl StatusNotifier<'_> {
    pub fn idle(&mut self) {
        let pixels = self.idle_effect.next().unwrap();
        let _ = self
            .led_strip
            .write_nocopy(pixels.iter().map(from_palette_rgb_to_rgb_rgb));
        self.buzzer.off();
    }
    pub fn processing(&mut self) {
        let pixels = std::iter::repeat(RGB8::new(0xff, 0xff, 0x00)).take(self.leds);
        let _ = self.led_strip.write_nocopy(pixels);
    }
    pub fn good(&mut self, username: String) {
        let pixels = std::iter::repeat(RGB8::new(0x00, 0xff, 0x00)).take(self.leds);
        let _ = self.led_strip.write_nocopy(pixels);
        let payload = format!("{{\"username\":\"{username}\"}}");
        let _ = self.mqtt_client.publish("kelderapi/leddy", QoS::AtMostOnce, false, payload.as_bytes());
        self.buzzer.on(440.into());
        self.sleep(166);
        self.buzzer.on(880.into());
        self.sleep(166);
        self.buzzer.on(1760.into());
        self.sleep(166);
    }
    pub fn bad(&mut self) {
        let pixels = std::iter::repeat(RGB8::new(0xff, 0x00, 0x00)).take(self.leds);
        let _ = self.led_strip.write_nocopy(pixels);
        self.buzzer.on(220.into());
        self.sleep(250);
        self.buzzer.on(110.into());
        self.sleep(250);
    }
    pub fn sleep(&self, miliseconds: u64) {
        std::thread::sleep(Duration::from_millis(miliseconds));
    }
}
