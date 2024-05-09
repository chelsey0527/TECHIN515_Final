import os
import psycopg2
import lgpio
import speech_recognition as sr
import pyttsx3
import openai
from datetime import datetime, timedelta
from dotenv import load_dotenv
from humidity import read_bme280_sensor

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
        
        # Create a cursor object
        cursor = conn.cursor()

        # Execute a query to fetch the last intake time and schedule for the user's medicine
        cursor.execute("SELECT i.intaketime, p.scheduletimes FROM intakelog i JOIN pillcase p ON i.pillcaseid = p.id ORDER BY i.date DESC LIMIT 1")
        
        # Fetch the result
        result = cursor.fetchone()
        
        return result
    except (Exception, psycopg2.Error) as error:
        print("Error fetching data from PostgreSQL:", error)
        return None
    finally:
        # Close the database connection
        if conn:
            cursor.close()
            conn.close()

# Function to generate response based on medication intake data
def generate_medication_response():
    medication_data = fetch_medication_data()

    if medication_data:
        last_intake_time, schedule_times = medication_data

        if last_intake_time:
            last_intake_time = last_intake_time.strftime("%Y-%m-%d %H:%M:%S")
            next_intake_time = (last_intake_time + timedelta(hours=4)).strftime("%Y-%m-%d %H:%M:%S")

            return f"The last time you took your medicine was at {last_intake_time}. Your next intake is due at {next_intake_time}."
        else:
            return "You haven't taken your medicine yet. Please take it as scheduled."

    else:
        return "No medication intake data found."

# Function to get response from OpenAI ChatGPT
def get_response(user_input):
    messages.append({"role": "user", "content": user_input})
    response = openai.Completion.create(
        engine="text-davinci-003",
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

# Function to check if the intake completion button is pressed
def check_button_status():
    button_status = lgpio.gpio_read(h, BUTTON_GPIO_PIN)
    return button_status

# Function to turn on the lights based on scheduled time
def turn_on_lights(scheduled_time):
    current_time = datetime.now()

    # Check if the scheduled time is the same as the current time
    if scheduled_time == current_time:
        for pin in RELAY_GPIO_PINS:
            lgpio.gpio_write(h, pin, 1)
        print(f"Time to take your medicine from case {caseNo}")
    elif scheduled_time != current_time or button_status == 1:
        turn_off_lights()  # Turn off the lights if scheduled time != now

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
        cursor.execute("SELECT id FROM pillcase WHERE caseNo = 2")  # Assuming caseNo is 2 for Tylenol
        pillcase_id = cursor.fetchone()[0]

        # Update the intake log
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