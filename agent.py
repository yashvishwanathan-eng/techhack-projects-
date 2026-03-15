import time
import schedule
from weather_watcher import get_weather_data
from tier_classifier import classify_tier
from message_writer import write_all_languages
from send_alert import send_to_backend

def run_agent_once():
    print("[AGENT] Starting cycle...")
    weather = get_weather_data("Thanjavur", "Tamil Nadu")
    print("[AGENT] Weather: " + weather)
    tier_info = classify_tier(weather)
    tier = tier_info["tier"]
    print("[AGENT] Tier: " + str(tier))
    if tier <= 3:
        messages = write_all_languages(weather, tier=tier)
        for language, message in messages.items():
            print("[AGENT] " + language + ": " + message)
            result = send_to_backend(tier, message, language)
            print("[AGENT] Backend: " + result)
    else:
        print("[AGENT] Tier 4 - All normal.")
    print("[AGENT] Cycle complete.")

if __name__ == "__main__":
    print("[BHOOMI] Agent started!")
    run_agent_once()
