from message_writer import write_all_languages
from send_alert import send_to_backend

print("TRIGGERING TIER 1 DEMO ALERT...")
alert = "Severe flood warning: 220mm rainfall expected in Thanjavur. Red alert issued."

messages = write_all_languages(alert, tier=1)
for language, message in messages.items():
    print(f"\n--- {language} ---")
    print(message)
    result = send_to_backend(1, message, language)
    print(f"Backend: {result}")
