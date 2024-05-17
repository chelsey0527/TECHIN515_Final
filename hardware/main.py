import os
import psycopg2
import lgpio
import speech_recognition as sr
import pyttsx3
import openai
from datetime import datetime, timedelta
from dotenv import load_dotenv
from humidity import read_bme280_sensor, update_humidity_temperature
from intake import fetch_daily_intake_schedule, get_pillcase_info, update_intake_log

load_dotenv()

# Database connection information
dbname = os.getenv("DATABASE")
user = "chelsey"
password = os.getenv("PASSWORD")
host = os.getenv("HOST")
port = os.getenv("PORT")

# Initialize pyttsx3
listening = True
engine = pyttsx3.init()

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

# Fetch daily intake schedule and store it
daily_schedule = fetch_daily_intake_schedule()
current_time = str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

# Set your OpenAI API key and customize the ChatGPT role
openai.api_key = os.getenv("OPENAI_API_KEY")
messages = [{"role": "system", "content": f"Your name is Tom and give answers in 2 lines. This is the intake schedule for today: {daily_schedule}. Answer based on this schedule."}]

# Customizing the output voice
voices = engine.getProperty('voices')
rate = engine.getProperty('rate')
volume = engine.getProperty('volume')

# Function to get response from OpenAI ChatGPT
def get_response(user_input):
    messages.append({"role": "user", "content": f"It's {current_time}. This is my intake log: {daily_schedule}. {user_input}"})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": ChatGPT_reply})
    return ChatGPT_reply

# Function to turn off the lights
def turn_off_lights():
    for pin in RELAY_GPIO_PINS:
        lgpio.gpio_write(h, pin, 0)
    # print("Lights turned OFF")

# Function to remind intake
def remind_to_take_pills(schedule):
    for entry in schedule:
        pillcase_id = entry['pillcaseId']
        schedule_time = entry['scheduleTime']
        pill_info = get_pillcase_info(pillcase_id)
        if pill_info and str(datetime.now().time().strftime('%H:%M')) in schedule_time:
            pill_name, doses, case_no = pill_info
            reminder_message = f"Please take {doses} dose(s) from pillbox {case_no}"
            print(reminder_message)
            engine.say("Time to take your medicines!")

# Main loop
while listening:
    try:
        with sr.Microphone() as source:
            recognizer = sr.Recognizer()
            recognizer.adjust_for_ambient_noise(source)
            recognizer.dynamic_energy_threshold = 3000

            print("Listening...")
            audio = recognizer.listen(source, timeout=5.0)
            response = recognizer.recognize_google(audio)
            print(response)

            if "tom" in response.lower():
                response_from_openai = get_response(response)
                engine.setProperty('rate', 120)
                engine.setProperty('volume', volume)
                engine.setProperty('voice', 'english-us')
                engine.say(response_from_openai)
                engine.runAndWait()

            elif "last time I took my medicine" in response.lower():
                response_from_openai = get_response(response)
                engine.say(response_from_openai)
                engine.runAndWait()

            elif "next intake due" in response.lower():
                response_from_openai = get_response(response)
                engine.say(response_from_openai)
                engine.runAndWait()

            elif "done" in response.lower():
                update_intake_log()
                turn_off_lights()
                engine.say("Well done!")
                # Refresh the daily schedule after updating the log
                daily_schedule = fetch_daily_intake_schedule()

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

# Main loop ends