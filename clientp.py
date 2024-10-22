import requests

# The server URL
url = 'http://localhost:3000'

# Sample nutrition data and user serving size
nutrition_data = {
    'energy': 250,
    'protein': 10,
    'carbohydrates': 30,
    'addedSugars': 5,
    'dietaryFiber': 3,
    'totalFat': 10,
    'saturatedFat': 3,
    'monounsaturatedFat': 2,
    'polyunsaturatedFat': 1,
    'transFat': 0,
    'sodium': 200,
    'servingSize': 100  # Serving size of the provided nutrition values
}

# The serving size that the user consumed
user_serving_size = 150

# Creating the payload for the POST request
payload = {
    'nutritionPerServing': nutrition_data,
    'userServingSize': user_serving_size
}

try:
    # Sending the POST request
    response = requests.post(url, json=payload)

    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        print("Scaled Nutrition Values:")
        for nutrient, value in data['scaledNutrition'].items():
            print(f"  {nutrient}: {value}")
        
        print("\nPercentage of Daily Values:")
        for nutrient, value in data['percentageDailyValues'].items():
            print(f"  {nutrient}: {value}")
    else:
        # Print the error details
        print(f"Error {response.status_code}: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
