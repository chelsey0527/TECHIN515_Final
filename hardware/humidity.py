import time
import smbus2
import bme280

def celsius_to_fahrenheit(celsius):
    return (celsius * 9/5) + 32

def read_bme280_sensor(address=0x76, bus_number=1):
    try:
        # Initialize I2C bus
        bus = smbus2.SMBus(bus_number)
        
        # Load calibration parameters
        calibration_params = bme280.load_calibration_params(bus, address)
        
        while True:
            try:
                # Read sensor data
                data = bme280.sample(bus, address, calibration_params)
                
                # Extract temperature, pressure, and humidity
                temperature_celsius = data.temperature
                pressure = data.pressure
                humidity = data.humidity
                
                # Convert temperature to Fahrenheit
                temperature_fahrenheit = celsius_to_fahrenheit(temperature_celsius)
                
                # Print the readings
                print("Temperature: {:.2f} °C, {:.2f} °F".format(temperature_celsius, temperature_fahrenheit))
                print("Pressure: {:.2f} hPa".format(pressure))
                print("Humidity: {:.2f} %".format(humidity))

                return humidity, temperature_celsius
                
                # Wait for a few seconds before the next reading
                time.sleep(2)
            except KeyboardInterrupt:
                print('Program stopped')
                break
            except Exception as e:
                print('An unexpected error occurred:', str(e))
                break
    finally:
        bus.close()

# You can call this function from your main.py
if __name__ == "__main__":
    read_bme280_sensor()