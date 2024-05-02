import asyncio
import speech_recognition as sr
from azure.iot.device.aio import IoTHubDeviceClient
from azure.iot.device import Message

async def main():
    # Initialize recognizer
    recognizer = sr.Recognizer()

    # Initialize Azure IoT Hub client
    conn_str = "HostName=cloudlab-smartpill.azure-devices.net;DeviceId=iotdevice;SharedAccessKey=7jMWrSQl3PNUZdSggHu5V2qIhil+9rAnmAIoTMN/o8o="  # Replace with your IoT Hub connection string
    device_client = IoTHubDeviceClient.create_from_connection_string(conn_str)
    await device_client.connect()

    with sr.Microphone() as source:
        print("Adjusting for ambient noise, please wait...")
        recognizer.adjust_for_ambient_noise(source)

        while True:
            print("Listening...")
            try:
                # Listen for the first phrase and extract it into audio data
                audio = recognizer.listen(source, timeout=5.0)
                print("Recognizing...")
                # Recognize speech using Google's speech recognition
                text = recognizer.recognize_google(audio)
                print("Recognized Text:", text)

                # Send the recognized text to Azure IoT Hub
                message = Message(text)
                print("Sending message to Azure IoT Hub:", text)
                await device_client.send_message(message)

            except sr.UnknownValueError:
                print("Google Speech Recognition could not understand audio.")
            except sr.RequestError as e:
                print(f"Could not request results from Google Speech Recognition service; {e}")
            except sr.WaitTimeoutError:
                print("Listening timed out.")
            except Exception as e:
                print(f"An unexpected error occurred: {e}")

    # Finally, shut down the client
    await device_client.shutdown()

if __name__ == "__main__":
    asyncio.run(main())