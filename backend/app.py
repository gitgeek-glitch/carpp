from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from pathlib import Path
import traceback

app = Flask(__name__)
CORS(app)

# Directory where model files are stored
MODELS_DIR = Path(__file__).parent / 'models'

# Load preprocessing components
scaler = joblib.load(MODELS_DIR / 'scaler.joblib')
pca = joblib.load(MODELS_DIR / 'pca.joblib')
label_encoder = joblib.load(MODELS_DIR / 'label_encoder.joblib')
categorical_columns = joblib.load(MODELS_DIR / 'categorical_columns.joblib')
feature_columns = joblib.load(MODELS_DIR / 'feature_columns.joblib')

# Load all models
models = {
    'linear-regression': joblib.load(MODELS_DIR / 'linear_regression.joblib'),
    'ridge-regression': joblib.load(MODELS_DIR / 'ridge_regression.joblib'),
    'elastic-net': joblib.load(MODELS_DIR / 'elasticnet.joblib'),
    'lasso-regression': joblib.load(MODELS_DIR / 'lasso_regression.joblib'),
    'bayesian-ridge': joblib.load(MODELS_DIR / 'bayesian_ridge.joblib'),
    'random-forest': joblib.load(MODELS_DIR / 'random_forest.joblib'),
    'gradient-boosting': joblib.load(MODELS_DIR / 'gradient_boosting.joblib'),
    'xgboost': joblib.load(MODELS_DIR / 'xgboost.joblib'),
}


def preprocess_data(data):
    try:
        # Initialize a feature vector with all required columns set to default (numerical: 0, categorical: -1)
        processed_data = {col: 0 for col in feature_columns}
        
        # Handle categorical features
        for col in categorical_columns:
            if col in data:
                try:
                    # Transform using label encoder
                    processed_data[col] = label_encoder.transform([data[col]])[0]
                except ValueError:
                    # Assign -1 for unseen labels
                    print(f"Unseen label encountered: {data[col]} for column {col}")
                    processed_data[col] = -1

        # Handle numerical features
        for col in feature_columns:
            if col in data:
                processed_data[col] = float(data[col])

        # Create a list in the order of feature_columns
        feature_array = [processed_data[col] for col in feature_columns]

        # Scale the features
        scaled_data = scaler.transform([feature_array])

        # Apply PCA transformation
        pca_data = pca.transform(scaled_data)

        return pca_data
    except Exception as e:
        raise ValueError(f"Error in preprocessing data: {e}")


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print(f"Received data: {data}")

        # Extract and validate model type
        model_type = data.pop('modelType', None)
        if not model_type or model_type not in models:
            return jsonify({'error': 'Invalid or missing model type'}), 400

        # Preprocess the input data
        processed_data = preprocess_data(data)

        # Select and use the appropriate model
        model = models[model_type]
        prediction = model.predict(processed_data)

        return jsonify({'prediction': float(prediction[0])})
    except Exception as e:
        print(f"Error in prediction: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)