import time
import smbus2
import bme280
import os
import psycopg2
from dotenv import load_dotenv
from azure import connect_to_database

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
        
        # Round up the readings to integers
        temperature_celsius = int(temperature_celsius)
        pressure = int(pressure)
        humidity = int(humidity)
                
        # Convert temperature to Fahrenheit
        temperature_fahrenheit = celsius_to_fahrenheit(temperature_celsius)
                
        # Print the rounded readings
        print("Temperature: {} °C, {:.2f} °F".format(temperature_celsius, temperature_fahrenheit))
        print("Pressure: {} hPa".format(pressure))
        print("Humidity: {} %".format(humidity))

        return humidity, temperature_celsius
                
    except Exception as e:
        print('An unexpected error occurred:', str(e))
        return None, None
    finally:
        bus.close()

def update_humidity_temperature():
    conn = None  # Initialize the connection variable
    try:
        # Read BME280 sensor data
        humidity, temperature_celsius = read_bme280_sensor()

        if humidity is not None and temperature_celsius is not None:
            # Connect to your Azure PostgreSQL database
            conn = connect_to_database()
            
            # Create a cursor object
            cursor = conn.cursor()

            # Print the contents of the user table before updating
            cursor.execute('SELECT * FROM "User"')
            print("User Table Contents Before Update:")
            for row in cursor.fetchall():
                print(row)

            # Update humidity, temperature, and updatedAt
            query = 'UPDATE "User" SET "pillboxHumidity" = %s, "pillboxTemperature" = %s, "updatedAt" = %s WHERE name = %s'
            cursor.execute(query, (humidity, temperature_celsius, time.strftime('%Y-%m-%d %H:%M:%S'), "Admin"))
            
            # Commit the transaction
            conn.commit()
            
            print(f"Humidity and temperature updated successfully.")
        else:
            print("Failed to read humidity and temperature data.")
        
    except (Exception, psycopg2.Error) as error:
        print("Error updating humidity, temperature, and updatedAt in PostgreSQL:", error)
        if conn:  # Check if conn is not None
            conn.rollback()
    finally:
        # Close the database connection
        if conn:
            cursor.close()
            conn.close()

while True:
        update_humidity_temperature()
        time.sleep(600)  # Wait for 10 minutes before the next update