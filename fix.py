content = open('send_alert.py', 'w')
content.write("""import requests

BACKEND_URL = "http://10.32.250.77:3001"

def send_to_backend(tier, message, language='Tamil'):
    type_map = {1: 'flood', 2: 'heatwave', 3: 'rain_advisory', 4: 'info'}
    severity_map = {1: 'severe', 2: 'moderate', 3: 'low', 4: 'info'}
    
    payload = {
        'alertData': {
            'type': type_map.get(tier, 'flood'),
            'severity': severity_map.get(tier, 'low')
        },
        'message': message
    }
    try:
        response = requests.post(
            f'{BACKEND_URL}/send-alert',
            json=payload,
            timeout=10
        )
        if response.status_code == 200:
            return 'SUCCESS: ' + response.text
        else:
            return 'ERROR: Status ' + str(response.status_code)
    except requests.exceptions.ConnectionError:
        return 'WARNING: Backend not running yet!'
    except Exception as e:
        return 'ERROR: ' + str(e)

if __name__ == '__main__':
    result = send_to_backend(1, 'Flood warning in Thanjavur!', 'Tamil')
    print(result)
""")
content.close()
print("send_alert.py updated!")
