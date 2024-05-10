import os
import psycopg2
import lgpio
import speech_recognition as sr
import pyttsx3
import openai
from datetime import datetime, timedelta
from dotenv import load_dotenv
import board
import time
from adafruit_bme280 import basic as adafruit_bme280

load_dotenv()

# Database connection information
dbname = os.getenv("DATABASE")
user = os.getenv("USER")
password = os.getenv("PASSWORD")
host = os.getenv("HOST")
port = os.getenv("PORT")

# Initialize pyttsx3
listening = True
engine = pyttsx3.init()

# Set your OpenAI API key and customize the ChatGPT role
openai.api_key = "OPENAI_API_KEY"
messages = [{"role": "system", "content": "Your name is Tom and give answers in 2 lines. You will be provided with our database information. Only answer based on the information provided."}]

# Customizing the output voice
voices = engine.getProperty('voices')
rate = engine.getProperty('rate')
volume = engine.getProperty('volume')

# Define the GPIO pin numbers
RELAY_GPIO_PINS = [17]  # GPIO pins for light
BUTTON_GPIO_PIN = 23  # GPIO pin for the intake completion button

# Initialize the GPIO
h = lgpio.gpiochip_open(4)

# Set up GPIO pins as outputs for the lights
for pin in RELAY_GPIO_PINS:
    lgpio.gpio_claim_output(h, pin)

# Set up GPIO pin as input for the button
lgpio.gpio_claim_input(h, BUTTON_GPIO_PIN)

# Function to fetch medication intake data from the database
def fetch_medication_data():
    try:
        # Connect to your Azure PostgreSQL database
        conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )

        # Create a cursor
        cur = conn.cursor()

        # Get list of tables in the database
        cur.execute('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'')
        tables = cur.fetchall()

        # Fetch schedules of today from all pillcases
        today = datetime.now().date()
        medication_data = []

        for table in tables:
            table_name = table[0]
            if table_name.startswith('pillcase'):
                cur.execute(f"SELECT id, scheduletimes FROM {table_name} WHERE %s = ANY(scheduletimes::date[])", (today,))
                results = cur.fetchall()
                medication_data.extend(results)

        return medication_data

    except (Exception, psycopg2.Error) as error:
        print("Error fetching data from PostgreSQL:", error)
        return None
    finally:
        # Close the database connection
        if conn:
            cur.close()
            conn.close()

# Function to generate response based on medication intake data
def generate_medication_response():
    medication_data = fetch_medication_data()

    if medication_data:
        current_time = datetime.now().strftime("%H:%M:%S")
        for pillcase_id, schedule_times in medication_data:
            if current_time in schedule_times:
                return f"Please take your pills from pillcase {pillcase_id} now."
        return "No medication intake is scheduled at this time."

    else:
        return "No medication intake data found."

# Function to get response from OpenAI ChatGPT
def get_response(user_input):
    messages.append({"role": "user", "content": user_input})
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-0125",
        prompt=messages,
        temperature=0.5,
        max_tokens=50,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )
    ChatGPT_reply = response["choices"][0]["text"]
    messages.append({"role": "assistant", "content": ChatGPT_reply})
    return ChatGPT_reply

# Function to turn off the lights
def turn_off_lights():
    for pin in RELAY_GPIO_PINS:
        lgpio.gpio_write(h, pin, 0)
        button_status = 0
    # print("Lights turned OFF")

# Function to update the intake log when the button is pressed
def update_intake_log():
    try:
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

        # Fetch the pillcase ID of the medicine currently being taken
        cursor.execute("SELECT id FROM pillcase WHERE %s = ANY(scheduletimes::date[])", (datetime.now().date(),))
        pillcase_ids = cursor.fetchall()

        # Update the intake log for all pillcases scheduled for today
        for pillcase_id, in pillcase_ids:
            cursor.execute("UPDATE intakelog SET intaketime = NOW(), isintaked = True WHERE pillcaseid = %s", (pillcase_id,))
        
        # Commit the transaction
        conn.commit()
        
        print("Intake log updated successfully.")
        
    except (Exception, psycopg2.Error) as error:
        print("Error updating intake log in PostgreSQL:", error)
        conn.rollback()
    finally:
        # Close the database connection
        if conn:
            cursor.close()
            conn.close()

# Function to update humidity and temperature in the User table
def update_humidity_temperature():
    try:
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

        # Read BME280 sensor data
        humidity, temperature = read_bme280_sensor()

        # Update humidity and temperature in the User table
        cursor.execute("UPDATE user SET pillboxHumidity = %s, pillboxTemperature = %s WHERE name = 'Admin'", (humidity, temperature,))
        
        # Commit the transaction
        conn.commit()
        
        print("Humidity and temperature updated successfully.")
        
    except (Exception, psycopg2.Error) as error:
        print("Error updating humidity and temperature in PostgreSQL:", error)
        conn.rollback()
    finally:
        # Close the database connection
        if conn:
            cursor.close()
            conn.close()

# Main loop
while listening:
    with sr.Microphone() as source:
        recognizer = sr.Recognizer()
        recognizer.adjust_for_ambient_noise(source)
        recognizer.dynamic_energy_threshold = 3000

        try:
            print("Listening...")
            audio = recognizer.listen(source, timeout=5.0)
            response = recognizer.recognize_google(audio)
            print(response)

            if "tom" in response.lower():
                response_from_openai = get_response(response)
                engine.setProperty('rate', 120)
                engine.setProperty('volume', volume)
                engine.setProperty('voice', 'greek')
                engine.say(response_from_openai)
                engine.runAndWait()

            elif "last time I took my medicine" in response.lower():
                medication_response = generate_medication_response()
                engine.say(medication_response)
                engine.runAndWait()

            elif "next intake due" in response.lower():
                medication_response = generate_medication_response()
                engine.say(medication_response)
                engine.runAndWait()

            elif "take my medicine" in response.lower():
                update_intake_log()

        except sr.WaitTimeoutError:
            print("No command detected.")

        except sr.UnknownValueError:
            print("Could not understand the audio.")

        except sr.RequestError as e:
            print("Could not request results; {0}".format(e))

        except KeyboardInterrupt:
            break

        except Exception as e:
            print(e)

        # Update humidity and temperature in the User table every 60 seconds
        if datetime.now().second % 60 == 0:
            update_humidity_temperature()

# Main loop ends