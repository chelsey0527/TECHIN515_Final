import asyncio
import time
import lgpio
from azure.iot.device.aio import IoTHubDeviceClient
from azure.iot.device import Message

# Set GPIO pin numbers for ultrasonic sensor
TRIG_PIN = 18
ECHO_PIN = 24

# Initialize the GPIO
gpio = lgpio.gpiochip_open(4)

# Set GPIO pin modes
lgpio.gpio_claim_output(gpio, TRIG_PIN)
lgpio.gpio_claim_input(gpio, ECHO_PIN)

def get_distance():
    # Send a short pulse to trigger the sensor
    lgpio.tx_pulse(gpio, TRIG_PIN, 10, 100)

    # Measure the duration of the pulse from the echo pin
    start = time.time()
    while lgpio.gpio_read(gpio, ECHO_PIN) == 0:
        if time.time() - start > 0.1:
            return None
    pulse_start_time = time.time()

    while lgpio.gpio_read(gpio, ECHO_PIN) == 1:
        if time.time() - start > 0.1:
            return None
    pulse_end_time = time.time()

    pulse_duration = pulse_end_time - pulse_start_time

    # Calculate distance in centimeters
    distance = pulse_duration * 17150
    distance = round(distance, 2)

    return distance

async def send_recurring_telemetry(device_client):
    # Connect the client.
    await device_client.connect()

    # Send recurring telemetry
    while True:
        distance = get_distance()
        if distance is not None:
            # Convert distance to bytes
            data = str(distance).encode('utf-8')
            msg = Message(data)
            print("Sending distance: " + str(distance))
            await device_client.send_message(msg)
        else:
            print("Measurement timeout")
        await asyncio.sleep(1)

def main():
    # Copy and paste your "Primary connection string" below.
    conn_str = "HostName=cloudlab-smartpill.azure-devices.net;DeviceId=iotdevice;SharedAccessKey=7jMWrSQl3PNUZdSggHu5V2qIhil+9rAnmAIoTMN/o8o="
    # The client object is used to interact with your Azure IoT hub.
    device_client = IoTHubDeviceClient.create_from_connection_string(conn_str)

    print("IoTHub Device Client Recurring Telemetry Sample")
    print("Press Ctrl+C to exit")
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(send_recurring_telemetry(device_client))
    except KeyboardInterrupt:
        print("User initiated exit")
    except Exception:
        print("Unexpected exception!")
        raise
    finally:
        loop.run_until_complete(device_client.shutdown())
        loop.close()

if __name__ == "__main__":
    main()