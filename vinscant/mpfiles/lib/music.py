import io
from machine import Pin, PWM, Timer
class MusicPlayer:
    def __init__(self, melody: io.IOBase, pin: Pin) -> None:
        self.melody = melody
        self.pin = pin
        self.pwm: PWM = PWM(pin, freq=1, duty_u16=0)
        self.timer = Timer(0)

    @staticmethod
    def midi_to_freq(note: int):
        return 440 * 2**((float(note) - 69) / 12) / 2

    def start(self):
        self.timer.init(mode=Timer.PERIODIC, freq=1, callback=self.playNote)

    def playNote(self, ignored: Timer):
        note = self.melody.read(1)
        if len(note) == 0:
            self.close()
            return
        note = note[0]
        self.pwm.freq(int(MusicPlayer.midi_to_freq(note)))
        if note == 0:
            self.pwm.duty_u16(0)
        else:
            self.pwm.duty_u16(32767)

    def close(self):
        self.timer.deinit()
        self.pwm.deinit()
        self.melody.close()
