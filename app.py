from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow CORS for all origins (can be restricted if needed)

# Load dataset
data = pd.read_csv('Filtered_APY_Update.csv')

# Clean dataset
data.columns = data.columns.str.strip()
data['State'] = data['State'].str.strip()
data['District'] = data['District'].str.strip()
data['Season'] = data['Season'].str.strip()
data.dropna(inplace=True)

# Features and target variable
X = data[['State', 'District', 'Season']]
y = data['Crop']

# One-hot encoding for categorical features
preprocessor = ColumnTransformer(
    transformers=[('cat', OneHotEncoder(handle_unknown='ignore'), ['State', 'District', 'Season'])]
)

# Create pipeline with preprocessing + model
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])

# Train the model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipeline.fit(X_train, y_train)

# Initialize Firebase
cred = credentials.Certificate("firebase-adminsdk.json")  # Replace with your Firebase Admin SDK JSON file
firebase_admin.initialize_app(cred)
db = firestore.client()

# Function to recommend a crop
def recommend_crop(state, district, season):
    # Ensure inputs are stripped and formatted properly
    state, district, season = state.strip(), district.strip(), season.strip()

    # Validate inputs
    valid_states = set(data['State'].unique())
    valid_districts = set(data['District'].unique())
    valid_seasons = set(data['Season'].unique())

    if state not in valid_states:
        return {"error": f"Invalid State: {state}"}
    if district not in valid_districts:
        return {"error": f"Invalid District: {district}"}
    if season not in valid_seasons:
        return {"error": f"Invalid Season: {season}"}

    # Prepare input data for prediction
    input_data = pd.DataFrame([[state, district, season]], 
                               columns=['State', 'District', 'Season'])
    
    # Predict the recommended crop
    predicted_crop = pipeline.predict(input_data)[0]
    return {"recommended_crop": predicted_crop}

# API Endpoint to get crop recommendation
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        uid = data.get("uid")

        # Validate input
        if not uid:
            return jsonify({"error": "Missing user ID"}), 400

        # Get user data from Firestore
        user_doc = db.collection("farmers").document(uid).get()

        if user_doc.exists:
            user_data = user_doc.to_dict()
            state = user_data.get("state")
            city = user_data.get("city")  # Assuming "city" is the same as "district"
            season = user_data.get("season")

            # Ensure all necessary data is present
            if not all([state, city, season]):
                return jsonify({"error": "Incomplete user data"}), 400

            result = recommend_crop(state, city, season)
            return jsonify(result)
        else:
            return jsonify({"error": "User data not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
