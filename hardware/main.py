import os
import psycopg2
import lgpio
import speech_recognition as sr
import pyttsx3
import openai
from datetime import datetime, time
from dotenv import load_dotenv
from humidity import update_humidity_temperature
from intake import fetch_daily_intake_schedule, update_intake_log

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
BUTTON_GPIO_PIN = 23  # GPIO pin for the intake completion button

# Initialize the GPIO
h = lgpio.gpiochip_open(4)

# Set up GPIO pin as input for the button
lgpio.gpio_claim_input(h, BUTTON_GPIO_PIN)

# Fetch daily intake schedule and store it
daily_schedule = fetch_daily_intake_schedule()

# Set your OpenAI API key and customize the ChatGPT role
openai.api_key = os.getenv("OPENAI_API_KEY")
messages = [{"role": "system", "content": f"You are a assistant named Tom. This is the intake schedule of your patient for today: {daily_schedule}. Use the provided schedule to answer questions. Keep your answers concise and informative."}]

# Customizing the output voice
voices = engine.getProperty('voices')
rate = engine.getProperty('rate')
volume = engine.getProperty('volume')

# Function to get response from OpenAI ChatGPT
def get_response(user_input):
    current_time_full = str(datetime.now().strftime('%Y-%m-%d %H:%M'))
    messages.append({"role": "user", "content": f"It's {current_time_full}. {user_input}"})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": ChatGPT_reply})
    return ChatGPT_reply

# Function to remind intake
def remind_to_take_pills(schedule):
    current_time = datetime.now().strftime('%H:%M')
    for entry in schedule:
        schedule_time = entry['scheduleTime']
        doses = entry['doses']
        case_no = entry['caseNo']
        if current_time in schedule_time:
            reminder_message = f"Please take {doses} dose(s) from pillbox {case_no}"
            print(reminder_message)
            engine.say(reminder_message)
            engine.runAndWait()

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
                response_from_openai = get_response(f"{response}? List out all the upcoming intakes.")
                engine.say(response_from_openai)
                engine.runAndWait()

            elif "done" in response.lower():
                update_intake_log()
                engine.say("Well done!")
                # Refresh the daily schedule after updating the log
                daily_schedule = fetch_daily_intake_schedule()
        
        # Update humidity and temperature
        update_humidity_temperature()
        # Check and remind for pill intake periodically (every minute)
        remind_to_take_pills(daily_schedule)
        time.sleep(60)

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