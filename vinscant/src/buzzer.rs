use esp_idf_svc::hal::{gpio::OutputPin, ledc::{config, LedcChannel, LedcDriver, LedcTimer, LedcTimerDriver, LowSpeed, SpeedMode, CHANNEL0, TIMER0}, peripheral::Peripheral, peripherals::Peripherals, units::Hertz};


pub struct Buzzer<'a> {
    timer_driver: LedcTimerDriver<'a, TIMER0>,
    channel: LedcDriver<'a>
}
impl<'a> Buzzer<'a> {
    pub fn new(timer: TIMER0, channel: CHANNEL0, pin: impl Peripheral<P = impl OutputPin> + 'a) -> Self {
        let mut timer_driver = LedcTimerDriver::new(
            timer,
            &config::TimerConfig::new().frequency(100.into())
        ).unwrap();
        let mut channel = LedcDriver::new(
            channel,
            &timer_driver,
            pin
        ).unwrap();
        let mut buzzer = Buzzer {
            timer_driver,
            channel
        };
        buzzer.off();
        buzzer
    }
    
    pub fn off(&mut self) {
        let _ = self.channel.set_duty(0);
    }
    
    pub fn on(&mut self, frequency: Hertz) {
        let _ = self.channel.set_duty(64);
        let _ = self.timer_driver.set_frequency(frequency);
    }
}
