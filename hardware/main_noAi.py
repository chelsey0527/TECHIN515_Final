import os
import psycopg2
import speech_recognition as sr
import pyttsx3
from datetime import datetime, time
from dotenv import load_dotenv
from humidity import update_humidity_temperature
from intake import fetch_daily_intake_schedule, update_intake_log
import joblib

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

voices = engine.getProperty('voices')
rate = engine.getProperty('rate')
volume = engine.getProperty('volume')

# Load the model and vectorizer
model = joblib.load('intent_classifier_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')

# Fetch daily intake schedule and store it
daily_schedule = fetch_daily_intake_schedule()

# Define helper functions
def preprocess_text(text):
    # Add your text preprocessing steps
    return text.lower()

def predict_intent(user_input):
    preprocessed_text = preprocess_text(user_input)
    features = vectorizer.transform([preprocessed_text])
    prediction = model.predict(features)[0]
    return prediction

def generate_response(intent, daily_schedule):
    if intent == 'last_intake':
        return get_last_intake(daily_schedule)
    elif intent == 'next_intake':
        return get_next_intake(daily_schedule)
    elif intent == 'list_all':
        return list_upcoming_intakes(daily_schedule)
    else:
        return "I'm sorry, I didn't understand that. Can you please rephrase?"

def generate_response(intent, daily_schedule):
    if intent == 'last_intake':
        return get_last_intake(daily_schedule)
    elif intent == 'next_intake':
        return get_next_intake(daily_schedule)
    elif intent == 'list_all':
        return list_upcoming_intakes(daily_schedule)
    else:
        return "I'm sorry, I didn't understand that. Can you please rephrase?"

def get_last_intake(schedule):
    last_intakes = [entry for entry in schedule if entry['isIntaked']]
    if last_intakes:
        last_intake = max(last_intakes, key=lambda x: datetime.strptime(x['scheduleDate'] + ' ' + x['scheduleTime'], '%Y-%m-%d %H:%M'))
        return f"The last intake was {last_intake['pillName']} from pillbox {last_intake['caseNo']} at {last_intake['intakeTime']}."
    return "You haven't taken any medication yet."

def get_next_intake(schedule):
    current_time = datetime.now()
    upcoming_intakes = [entry for entry in schedule if datetime.strptime(entry['scheduleDate'] + ' ' + entry['scheduleTime'], '%Y-%m-%d %H:%M') > current_time and not entry['isIntaked']]
    if upcoming_intakes:
        sorted_intakes = sorted(upcoming_intakes, key=lambda x: (datetime.strptime(x['scheduleDate'], '%Y-%m-%d'), datetime.strptime(x['scheduleTime'], '%H:%M')))
        grouped_intakes = {}
        for intake in sorted_intakes:
            time_key = intake['scheduleTime']
            if time_key not in grouped_intakes:
                grouped_intakes[time_key] = []
            grouped_intakes[time_key].append(intake['pillName'])

        next_intakes = []
        for time_key, pills in grouped_intakes.items():
            pills_str = ', '.join(pills)
            next_intakes.append(f"Your next intake is {pills_str} at {time_key} .")
        return next_intakes[0]
    return "No more intakes scheduled for today."

def list_upcoming_intakes(schedule):
    current_time = datetime.now()
    upcoming_intakes = [entry for entry in schedule if datetime.strptime(entry['scheduleDate'] + ' ' + entry['scheduleTime'], '%Y-%m-%d %H:%M') > current_time and not entry['isIntaked']]
    if upcoming_intakes:
        sorted_intakes = sorted(upcoming_intakes, key=lambda x: (datetime.strptime(x['scheduleDate'], '%Y-%m-%d'), datetime.strptime(x['scheduleTime'], '%H:%M')))
        grouped_intakes = {}
        for intake in sorted_intakes:
            time_key = intake['scheduleTime']
            if time_key not in grouped_intakes:
                grouped_intakes[time_key] = []
            grouped_intakes[time_key].append(intake['pillName'])

        next_intakes = []
        for time_key, pills in grouped_intakes.items():
            pills_str = ', '.join(pills)
            next_intakes.append(f"Your have {pills_str} at {time_key} .")
        return "\n".join(next_intakes)
    return "No more intakes scheduled for today."

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
                intent = predict_intent(response)
                response_from_intent = generate_response(intent, daily_schedule)
                engine.setProperty('rate', 155)
                engine.setProperty('volume', volume)
                engine.setProperty('voice', 'english')
                engine.say(response_from_intent)
                engine.runAndWait()

            elif "okay" in response.lower():
                update_intake_log()
                engine.say("Well done!")
                # Refresh the daily schedule after updating the log
                daily_schedule = fetch_daily_intake_schedule()
        
        # Update humidity and temperature
        # update_humidity_temperature()
        # # Check and remind for pill intake periodically (every minute)
        # remind_to_take_pills(daily_schedule)
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