const http = require('http');

// Recommended daily values (based on general guidelines)
const dailyValues = {
    energy: 2230,
    protein: 55,
    carbohydrates: 330,
    addedSugars: 30,
    dietaryFiber: 30,
    totalFat: 74,
    saturatedFat: 22,
    sodium: 2000,
    monounsaturatedFat: 25,
    polyunsaturatedFat: 25,
    transFat: 2
};

// Function to scale nutrition values
function scaleNutrition(nutritionPerServing, userServingSize) {
    const scalingFactor = userServingSize / nutritionPerServing.servingSize;
    return {
        energy: (nutritionPerServing.energy * scalingFactor).toFixed(2),
        protein: (nutritionPerServing.protein * scalingFactor).toFixed(2),
        carbohydrates: (nutritionPerServing.carbohydrates * scalingFactor).toFixed(2),
        addedSugars: (nutritionPerServing.addedSugars * scalingFactor).toFixed(2),
        dietaryFiber: (nutritionPerServing.dietaryFiber * scalingFactor).toFixed(2),
        totalFat: (nutritionPerServing.totalFat * scalingFactor).toFixed(2),
        saturatedFat: (nutritionPerServing.saturatedFat * scalingFactor).toFixed(2),
        monounsaturatedFat: (nutritionPerServing.monounsaturatedFat * scalingFactor).toFixed(2),
        polyunsaturatedFat: (nutritionPerServing.polyunsaturatedFat * scalingFactor).toFixed(2),
        transFat: (nutritionPerServing.transFat * scalingFactor).toFixed(2),
        sodium: (nutritionPerServing.sodium * scalingFactor).toFixed(2)
    };
}

// Function to calculate percentage of daily value
function calculatePercentage(nutrientValue, dailyValue) {
    if (!dailyValue || nutrientValue === "NaN") return 'N/A';
    return ((nutrientValue / dailyValue) * 100).toFixed(2) + '%';
}

// Create an HTTP server to handle both POST and GET requests
http.createServer((req, res) => {
    if (req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const params = Object.fromEntries(url.searchParams);

        // Check if required parameters are provided
        if (!params.userServingSize || !params.servingSize) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid or missing parameters' }));
            return;
        }

        const nutritionPerServing = {
            energy: parseFloat(params.energy),
            protein: parseFloat(params.protein),
            carbohydrates: parseFloat(params.carbohydrates),
            addedSugars: parseFloat(params.addedSugars),
            dietaryFiber: parseFloat(params.dietaryFiber),
            totalFat: parseFloat(params.totalFat),
            saturatedFat: parseFloat(params.saturatedFat),
            monounsaturatedFat: parseFloat(params.monounsaturatedFat),
            polyunsaturatedFat: parseFloat(params.polyunsaturatedFat),
            transFat: parseFloat(params.transFat),
            sodium: parseFloat(params.sodium),
            servingSize: parseFloat(params.servingSize)
        };

        const userServingSize = parseFloat(params.userServingSize);

        // Scale nutrition values
        const scaledNutrition = scaleNutrition(nutritionPerServing, userServingSize);

        // Send the response with scaled values and daily percentages
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            scaledNutrition: scaledNutrition,
            percentageDailyValues: {
                energy: calculatePercentage(scaledNutrition.energy, dailyValues.energy),
                protein: calculatePercentage(scaledNutrition.protein, dailyValues.protein),
                carbohydrates: calculatePercentage(scaledNutrition.carbohydrates, dailyValues.carbohydrates),
                addedSugars: calculatePercentage(scaledNutrition.addedSugars, dailyValues.addedSugars),
                dietaryFiber: calculatePercentage(scaledNutrition.dietaryFiber, dailyValues.dietaryFiber),
                totalFat: calculatePercentage(scaledNutrition.totalFat, dailyValues.totalFat),
                saturatedFat: calculatePercentage(scaledNutrition.saturatedFat, dailyValues.saturatedFat),
                sodium: calculatePercentage(scaledNutrition.sodium, dailyValues.sodium)
            }
        }));

    } else if (req.method === 'POST') {
        let body = '';

        // Accumulate the request body data
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Process the request after all data has been received
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { nutritionPerServing, userServingSize } = data;

                if (!nutritionPerServing || isNaN(userServingSize) || userServingSize <= 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid nutrition data or serving size' }));
                    return;
                }

                // Scale nutrition values
                const scaledNutrition = scaleNutrition(nutritionPerServing, userServingSize);

                // Send the response with scaled values and daily percentages
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    scaledNutrition: scaledNutrition,
                    percentageDailyValues: {
                        energy: calculatePercentage(scaledNutrition.energy, dailyValues.energy),
                        protein: calculatePercentage(scaledNutrition.protein, dailyValues.protein),
                        carbohydrates: calculatePercentage(scaledNutrition.carbohydrates, dailyValues.carbohydrates),
                        addedSugars: calculatePercentage(scaledNutrition.addedSugars, dailyValues.addedSugars),
                        dietaryFiber: calculatePercentage(scaledNutrition.dietaryFiber, dailyValues.dietaryFiber),
                        totalFat: calculatePercentage(scaledNutrition.totalFat, dailyValues.totalFat),
                        saturatedFat: calculatePercentage(scaledNutrition.saturatedFat, dailyValues.saturatedFat),
                        sodium: calculatePercentage(scaledNutrition.sodium, dailyValues.sodium)
                    }
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
}).listen(3000, () => {
    console.log('Server is running on port 3000');
});
