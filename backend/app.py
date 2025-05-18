from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import requests
from io import BytesIO
import os
import traceback
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Create models directory if it doesn't exist
MODELS_DIR = Path(__file__).parent / 'models'
MODELS_DIR.mkdir(exist_ok=True)

# Model files and their URLs
MODEL_FILES = {
    'scaler.joblib': os.environ.get('SCALER_URL', ''),
    'pca.joblib': os.environ.get('PCA_URL', ''),
    'label_encoder.joblib': os.environ.get('LABEL_ENCODER_URL', ''),
    'categorical_columns.joblib': os.environ.get('CATEGORICAL_COLUMNS_URL', ''),
    'feature_columns.joblib': os.environ.get('FEATURE_COLUMNS_URL', ''),
    'linear_regression.joblib': os.environ.get('LINEAR_REGRESSION_URL', ''),
    'ridge_regression.joblib': os.environ.get('RIDGE_REGRESSION_URL', ''),
    'elasticnet.joblib': os.environ.get('ELASTICNET_URL', ''),
    'lasso_regression.joblib': os.environ.get('LASSO_REGRESSION_URL', ''),
    'bayesian_ridge.joblib': os.environ.get('BAYESIAN_RIDGE_URL', ''),
    'random_forest.joblib': os.environ.get('RANDOM_FOREST_URL', ''),
    'gradient_boosting.joblib': os.environ.get('GRADIENT_BOOSTING_URL', ''),
    'xgboost.joblib': os.environ.get('XGBOOST_URL', '')
}

# Global variables to store loaded models and components
scaler = None
pca = None
label_encoder = None
categorical_columns = None
feature_columns = None
models = {}

def download_and_load_models():
    global scaler, pca, label_encoder, categorical_columns, feature_columns, models
    
    for filename, url in MODEL_FILES.items():
        if not url:
            print(f"Warning: URL for {filename} is not set. Skipping.")
            continue
            
        local_path = MODELS_DIR / filename
        
        # Download if file doesn't exist locally
        if not local_path.exists():
            try:
                print(f"Downloading {filename} from {url}")
                response = requests.get(url)
                response.raise_for_status()
                
                with open(local_path, 'wb') as f:
                    f.write(response.content)
                print(f"Successfully downloaded {filename}")
            except Exception as e:
                print(f"Error downloading {filename}: {e}")
                continue
        
        # Load the model
        try:
            model = joblib.load(local_path)
            
            # Assign to appropriate variable
            if filename == 'scaler.joblib':
                scaler = model
            elif filename == 'pca.joblib':
                pca = model
            elif filename == 'label_encoder.joblib':
                label_encoder = model
            elif filename == 'categorical_columns.joblib':
                categorical_columns = model
            elif filename == 'feature_columns.joblib':
                feature_columns = model
            else:
                # It's one of the prediction models
                model_name = filename.replace('.joblib', '').replace('_', '-')
                models[model_name] = model
                
            print(f"Successfully loaded {filename}")
        except Exception as e:
            print(f"Error loading {filename}: {e}")

# Download models at startup
@app.before_serving
def initialize():
    download_and_load_models()

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

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "API is running", "models_loaded": list(models.keys())})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Ensure models are loaded
        if not models:
            download_and_load_models()
            if not models:
                return jsonify({'error': 'Models not loaded yet. Please try again in a few moments.'}), 503
        
        data = request.json
        print(f"Received data: {data}")

        # Extract and validate model type
        model_type = data.pop('modelType', None)
        if not model_type or model_type not in models:
            return jsonify({'error': f'Invalid or missing model type. Available models: {list(models.keys())}'}), 400

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
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)