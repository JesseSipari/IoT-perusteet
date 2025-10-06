import network
import time
import urequests
import dht
from machine import Pin

ssid = 'Wokwi-GUEST'
password = ''
THINGSPEAK_API_KEY = '2VJ531F7MIH49CWN'
THINGSPEAK_URL = 'https://api.thingspeak.com/update'


wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

print("Connecting to Wi-Fi...", end="")
while not wlan.isconnected():
  print(".", end="")
  time.sleep(0.5)
print("\nConnected!")
print("IP address:", wlan.ifconfig()[0])

sensor = dht.DHT22(Pin(15))

def send_to_thingspeak(temp):
  if temp is None:
    print("Nothing to send")
    return
  try:
    response = urequests.post(
      THINGSPEAK_URL, 
      data = 'api_key={}&field1={}'.format(THINGSPEAK_API_KEY,temp),
      headers={'Content-Type': 'application/x-www-form-urlencoded'}
      
    )
    print("ThingSpeak response:", response.text)
    response.close()
  except Exception as e:
    print("Failed sending data ", e)

while True:
  try:
    sensor.measure()
    temperature = sensor.temperature()
    print("Temperature:", temperature, "C")
    send_to_thingspeak(temperature)
  except Exception as e:
    print("Error reading sensor or sending data:", e)

  time.sleep(5)