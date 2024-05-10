import board
import time
from adafruit_bme280 import basic as adafruit_bme280

def read_bme280_sensor():
    try:
        # Create sensor object, using the board's default I2C bus.
        i2c = board.I2C()   # uses board.SCL and board.SDA
        bme280 = adafruit_bme280.Adafruit_BME280_I2C(i2c)

        # change this to match the location's pressure (hPa) at sea level
        bme280.sea_level_pressure = 1013.25

        # Reading sensor data
        humidity = bme280.relative_humidity
        temperature = bme280.temperature

        return humidity, temperature

    except Exception as e:
        print("Error reading BME280 sensor:", e)
        return None, None