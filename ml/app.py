from flask import Flask, request, jsonify, render_template
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained model
model = joblib.load('price.pkl')


@app.route('/')
def home():
    return render_template('machine.html')

@app.route('/a', methods=["POST"])
def driver_registration():
    try:
        # Retrieve form data
        cartype = request.form.get('cartype')
        ac = request.form.get('ac')
        distance = request.form.get('distance')
        date = request.form.get('date')
        drivingexp = request.form.get('drivingexp')
        rating = request.form.get('rating')

        # Debugging: Print the retrieved form values
        print(f"Received: cartype={cartype}, ac={ac}, distance={distance}, date={date}, drivingexp={drivingexp}, rating={rating}")

        # Convert data to the appropriate types
        ac = int(ac)
        distance = float(distance)
        drivingexp = int(drivingexp)
        rating = float(rating)

        # Convert date to datetime and extract weekday
        date_parsed = pd.to_datetime(date)
        weekday = date_parsed.weekday()  # Monday is 0 and Sunday is 6

        # Create DataFrame including the 'weekday'
        data = pd.DataFrame([[cartype, ac, distance, date, drivingexp, rating, weekday]], 
                            columns=['cartype', 'ac', 'distance', 'date', 'drivingexp', 'rating', 'weekday'])

        # Predict price
        prediction = model.predict(data)[0]
        print(prediction)

        return jsonify({'prediction': prediction})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
