import time
import os
import lgpio

# GPIO pin to supply voltage
GPIO_PIN = 17

def play_audio(file_path):
    os.system("aplay " + file_path)

if __name__ == "__main__":
    try:
        # Open a connection to the GPIO daemon
        h = lgpio.gpiochip_open(0)

        # Set the GPIO pin as an output
        lgpio.gpio_claim_output(h, GPIO_PIN)

        # Path to the audio file you want to play
        audio_file = "train32.wav"

        # Turn on the speaker
        lgpio.gpio_write(h, GPIO_PIN, 1)

        # Play the audio
        play_audio(audio_file)

        # Turn off the speaker
        lgpio.gpio_write(h, GPIO_PIN, 0)

        # Close the connection to the GPIO daemon
        lgpio.gpiochip_close(h)

    except KeyboardInterrupt:
        print("\nExiting...")