from flask import Flask, request, jsonify, render_template
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

app = Flask(__name__, template_folder="templates")
CORS(app)

# Initialize Firebase
cred = credentials.Certificate("firebase-adminsdk.json")  # Add correct Firebase credentials
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load Dataset
data = pd.read_csv("Final dataset (1).csv")
data.columns = data.columns.str.strip()
data.dropna(inplace=True)

# Function to find an alternative crop
def get_alternative_crop(current_crop):
    if current_crop not in data['label'].values:
        return {"error": f"Crop '{current_crop}' not found in dataset"}
    
    crop_values = data[data['label'] == current_crop].iloc[0]
    
    alternative_crop = data[
        (data["N"] < crop_values["N"]) &  # Lower Nitrogen (less depletion)
        (data["P"] > crop_values["P"])  # Higher Phosphorus (fertility improvement)
    ].sample(1)
    
    if alternative_crop.empty:
        return {"error": "No suitable alternative crop found"}
    
    return {"alternative_crop": alternative_crop.iloc[0]["label"]}

# Serve the UI
@app.route('/')
def home():
    return render_template("AlternativeCrop.html")  # Ensure file exists in 'templates' folder

# API Endpoint to Get Alternative Crop
@app.route('/alternative-crop', methods=['POST'])
def alternative_crop():
    try:
        data = request.json
        uid = data.get("uid")

        if not uid:
            return jsonify({"error": "Missing user ID"}), 400

        user_doc = db.collection("farmers").document(uid).get()

        if user_doc.exists:
            user_data = user_doc.to_dict()
            current_crop = user_data.get("recommendedCrop")

            if not current_crop:
                return jsonify({"error": "No crop found for user"}), 400

            result = get_alternative_crop(current_crop)
            return jsonify(result)
        else:
            return jsonify({"error": "User data not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Running on a different port than main app
