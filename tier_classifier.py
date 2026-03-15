# tier_classifier.py

def classify_tier(weather_text):
    text = weather_text.lower()

    tier1_keywords = [
        'flood evacuation', 'severe flood', 'cyclone warning',
        'red alert', 'tsunami', 'earthquake', 'chemical spill',
        '200mm', '250mm', '300mm', 'extremely severe',
    ]
    for keyword in tier1_keywords:
        if keyword in text:
            return {
                'tier': 1,
                'method': 'CALL',
                'repeat': True,
                'reason': f'Critical: {keyword}'
            }

    tier2_keywords = [
        'heavy rainfall', 'orange alert', 'heatwave',
        'moderate flood', 'disease outbreak',
        '100mm', '150mm', 'road blocked', 'power outage',
    ]
    for keyword in tier2_keywords:
        if keyword in text:
            return {
                'tier': 2,
                'method': 'CALL',
                'repeat': False,
                'reason': f'High alert: {keyword}'
            }

    tier3_keywords = [
        'light rain', 'yellow alert', 'advisory',
        'vaccination', 'school closed', 'ration shop',
    ]
    for keyword in tier3_keywords:
        if keyword in text:
            return {
                'tier': 3,
                'method': 'SMS',
                'repeat': False,
                'reason': f'Advisory: {keyword}'
            }

    return {
        'tier': 4,
        'method': 'NOTIFICATION',
        'repeat': False,
        'reason': 'No urgent keywords — routine info'
    }

if __name__ == '__main__':
    test = 'Severe flood warning: rainfall of 220mm expected. Red alert issued.'
    print(classify_tier(test))
