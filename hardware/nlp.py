import psycopg2
import lgpio
import speech_recognition as sr
import pyttsx3
import openai
from datetime import datetime, timedelta

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
RELAY_GPIO_PINS = [17, 22, 5]  # GPIO pins for three lights
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
            dbname="your_database_name",
            user="your_username",
            password="your_password",
            host="your_host",
            port="your_port"
        )

        # Create a cursor object
        cursor = conn.cursor()

        # Execute a query to fetch medication intake data (replace with your query)
        cursor.execute("SELECT scheduled_time, actual_time FROM medication_intake ORDER BY actual_time DESC LIMIT 1")

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
        scheduled_time, actual_time = medication_data

        if actual_time:
            last_intake_time = actual_time.strftime("%Y-%m-%d %H:%M:%S")
            next_intake_time = (actual_time + timedelta(hours=4)).strftime("%Y-%m-%d %H:%M:%S")

            return f"The last time you took your medicine was at {last_intake_time}. Your next intake is due at {next_intake_time}."
        else:
            return "You haven't taken your medicine yet. Please take it as scheduled."

    else:
        return "No medication intake data found."

# Function to get response from OpenAI ChatGPT
def get_response(user_input):
    messages.append({"role": "user", "content": user_input})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]
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

            elif "check intake completion" in response.lower():
                button_status = check_button_status()
                if button_status:
                    print("Intake completed.")
                    turn_off_lights()
                else:
                    print("Intake not completed. Please take your medicine")

            else:
                print("Didn't recognize any valid command.")

            # Check if it's time to turn on the lights
            medication_data = fetch_medication_data()
            if medication_data:
                scheduled_time, _ = medication_data
                turn_on_lights(scheduled_time)

        except sr.UnknownValueError:
            print("Didn't recognize anything.")

# Clean up GPIO on exit
lgpio.gpiochip_close(h)
print("GPIO cleanup completed")