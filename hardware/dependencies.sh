"""
To run this file, please execute the following commands in terminal:
chmod +x dependencies.sh
./dependencies.sh
"""

# Install system packages
sudo apt install python3-dotenv portaudio19-dev python3-pyaudio flac python3-espeak espeak
sudo apt-get install portaudio19-dev

# Install Python packages
pip install pyaudio openai==0.28 python-dotenv SpeechRecognition pyttsx3 gtts lgpio smbus2 RPI.BME280 psycopg2-binary