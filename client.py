import requests

# The server URL
url = 'http://localhost:3000'

# User nutrition data and serving size
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

# Construct the GET request URL with parameters
params = '&'.join([f"{key}={value}" for key, value in {**nutrition_data, 'userServingSize': user_serving_size}.items()])
request_url = f"{url}?{params}"

try:
    # Sending the GET request
    response = requests.get(request_url)

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
        print(f"Error {response.status_code}: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
