use palette::{FromColor, Hsv, Srgb};
use rand::{rng, Rng};
use smart_led_effects::strip::EffectIterator;

#[derive(Debug)]
pub struct PingPong {
    position: usize,
    buffer: Vec<Srgb<u8>>,
    reverse: bool,
    end: usize,
    count: usize,
    randomize: bool,
}

impl PingPong {
    pub fn new(count: usize, data: Vec<Srgb<u8>>) -> Self {
        let mut buffer = vec![Srgb::<u8>::new(0, 0, 0); count - 1];
        buffer.extend(data);
        buffer.extend(vec![Srgb::<u8>::new(0, 0, 0); count - 1]);

        let end = buffer.len() - count;

        PingPong {
            position: 0,
            buffer,
            reverse: false,
            end,
            count,
            randomize: false,
        }
    }

    pub fn colour_ping_pong(count: usize, colour: Option<Srgb<u8>>) -> Self {
        let mut s = PingPong::new(count, vec![Srgb::new(0, 0, 0); count]);
        match colour {
            Some(colour) => s.fill_ping_pong(colour),
            None => s.randomize_colour_ping_pong(),
        }
        s
    }

    fn fill_ping_pong(&mut self, colour: Srgb<u8>) {
        let mut buffer = vec![Srgb::<u8>::new(0, 0, 0); self.count];
        buffer.extend(vec![colour; self.count]);
        buffer.extend(vec![Srgb::<u8>::new(0, 0, 0); self.count]);
        self.buffer = buffer;
    }

    fn randomize_colour_ping_pong(&mut self) {
        let mut rng = rng();
        let colour: Srgb<u8> =
            Srgb::from_color(Hsv::new(rng.random_range(0.0..360.0), 1.0, 1.0)).into_format();
        self.fill_ping_pong(colour);
        self.randomize = true;
    }
}

impl EffectIterator for PingPong {
    fn name(&self) -> &'static str {
        "PingPong"
    }

    fn next(&mut self) -> Option<Vec<Srgb<u8>>> {
        let out = self
            .buffer
            .iter()
            .skip(self.position)
            .take(self.count)
            .copied()
            .collect::<Vec<Srgb<u8>>>();

        self.position = if self.reverse {
            self.position - 1
        } else {
            self.position + 1
        };
        if (self.reverse && self.position == 0) || (!self.reverse && self.position >= self.end) {
            self.reverse = !self.reverse;
            if self.randomize {
                self.randomize_colour_ping_pong();
            }
        }
        Some(out)
    }
}
