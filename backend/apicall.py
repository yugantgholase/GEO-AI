import os
from openai import OpenAI
import requests
import geocoder



def get_type_of_places():
    place_types = ["cafe", "restaurant", "bakery", "supermarket", "pharmacy", "hospital", "school", "gym", "dentist", "book_store", "atm"]
    place_types_string = ', '.join(place_types)
    return place_types_string

def model_response_for_values(user_input):
    # Initialize OpenAI client
    client = OpenAI(api_key="") #add your azure open ai api key here

    response_format = '''
    "Type of places":
    "radius":
    '''
    # Define the user input message
    user_input_message = f'''
    Context: Below I’m providing user input, in the context of Google Maps API provide me response. Response should be in JSON format having fields.
    Type of places must be from {get_type_of_places()} and only 1 value
    If no value for radius is specified, then the default should be 300.
    reponse format : {response_format}
    user_input is {user_input}
    '''

    # Generate response using OpenAI GPT-3.5-turbo
    chat_completion = client.chat.completions.create(
      messages=[
        {
            "role": "user",
            "content": user_input_message,
        }
    ],
    model="gpt-3.5-turbo",
    )
    return chat_completion.choices[0].message.content

def model_response_for_summary(placeType, radius):
    api_key = "" #add your google maps api key here
    current_location = geocoder.ip('me').latlng
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={current_location[0]},{current_location[1]}&radius={radius}&type={placeType}&key={api_key}"
    response = requests.get(url)
    places = []
    if response.status_code == 200:
        results = response.json().get('results', [])
        for result in results:
               place_info = {
               'name': result.get('name', ''),
               'location': result.get('geometry', {}).get('location', {}),
               'rating': result.get('rating', 0.0),
               'open_now': result.get('opening_hours', {}).get('open_now', False)
            }
               places.append(place_info)

        places.sort(key=lambda x: x['rating'], reverse=True)

    return places[:3]