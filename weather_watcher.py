import requests

API_KEY = "fb305ff962f85adc30deffcc919b3248"

def get_weather_data(district='Thanjavur', state='Tamil Nadu'):
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        'q': district + ',IN',
        'appid': API_KEY,
        'units': 'metric'
    }
    response = requests.get(url, params=params)
    data = response.json()

    rainfall = data.get('rain', {}).get('1h', 0)
    temp = data['main']['temp']
    wind = data['wind']['speed'] * 3.6
    desc = data['weather'][0]['description']

    summary = "Location: " + district + " | Temp: " + str(temp) + "C | Wind: " + str(round(wind,1)) + "kmph | Rainfall: " + str(rainfall) + "mm | Conditions: " + desc
    return summary

if __name__ == '__main__':
    print(get_weather_data())
