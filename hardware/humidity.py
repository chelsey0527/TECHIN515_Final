import time
import smbus2
import bme280
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Database connection information
dbname = os.getenv("DATABASE")
user = "chelsey"
password = os.getenv("PASSWORD")
host = os.getenv("HOST")
port = os.getenv("PORT")

def celsius_to_fahrenheit(celsius):
    return (celsius * 9/5) + 32

def read_bme280_sensor(address=0x76, bus_number=1):
    try:
        # Initialize I2C bus
        bus = smbus2.SMBus(bus_number)
        
        # Load calibration parameters
        calibration_params = bme280.load_calibration_params(bus, address)
        
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
                
    except Exception as e:
        print('An unexpected error occurred:', str(e))
    finally:
        bus.close()

def update_humidity_temperature():
    conn = None  # Initialize the connection variable
    try:
        # Read BME280 sensor data
        humidity, temperature_celsius = read_bme280_sensor()

        if humidity is not None and temperature_celsius is not None:
            # Connect to your Azure PostgreSQL database
            conn = psycopg2.connect(
                dbname=dbname,
                user=user,
                password=password,
                host=host,
                port=port
            )
            
            # Create a cursor object
            cursor = conn.cursor()

            # Print the contents of the user table before updating
            cursor.execute('SELECT * FROM "User"')
            print("User Table Contents Before Update:")
            for row in cursor.fetchall():
                print(row)

            cursor.execute('UPDATE "User" SET "pillboxHumidity" = %s, "pillboxTemperature" = %s WHERE name = %s', (humidity, temperature_celsius, "Admin"))
            
            # Commit the transaction
            conn.commit()
            
            print(f"Humidity and temperature updated successfully.")
        else:
            print("Failed to read humidity and temperature data.")
        
    except (Exception, psycopg2.Error) as error:
        print("Error updating humidity and temperature in PostgreSQL:", error)
        if conn:  # Check if conn is not None
            conn.rollback()
    finally:
        # Close the database connection
        if conn:
            cursor.close()
            conn.close()

read_bme280_sensor()
update_humidity_temperature()