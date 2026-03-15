import os
from groq import Groq

client = Groq(api_key="YOUR_GROQ_API_KEY_HERE")

def write_message(alert_text, language='Tamil', tier=1):
    if tier == 1:
        urgency = 'This is CRITICAL. Tell them to act NOW.'
    elif tier == 2:
        urgency = 'This is important. Be clear and direct.'
    else:
        urgency = 'This is a general advisory. Be friendly.'

    prompt = f"""Rewrite this alert in simple {language}. Max 2 sentences. {urgency}
Write ONLY the {language} message. Nothing else.
Alert: {alert_text}"""

    response = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=[{'role': 'user', 'content': prompt}],
        max_tokens=200
    )
    return response.choices[0].message.content.strip()

def write_all_languages(alert_text, tier=1):
    return {
        'Tamil':  write_message(alert_text, 'Tamil', tier),
        'Hindi':  write_message(alert_text, 'Hindi', tier),
        'Telugu': write_message(alert_text, 'Telugu', tier),
    }

if __name__ == '__main__':
    test = 'Heavy rainfall expected in Thanjavur in next 12 hours.'
    messages = write_all_languages(test, tier=2)
    for lang, msg in messages.items():
        print(f'--- {lang} ---')
        print(msg)
