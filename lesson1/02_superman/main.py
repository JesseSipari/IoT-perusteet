import machine
import time


name = input("What is your name? ").strip().lower()
if name == "clark kent":
    print("You are the Superman!")
else:
    print("You are an ordinary person,", name)