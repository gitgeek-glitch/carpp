from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import gdown
import os
import traceback
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Create models directory
MODELS_DIR = Path(__file__).parent / 'models'
MODELS_DIR.mkdir(exist_ok=True)

# Model URLs from environment
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

# Supported model types
ALLOWED_MODEL_TYPES = {
    'linear_regression',
    'ridge_regression',
    'elasticnet',
    'lasso_regression',
    'bayesian_ridge',
    'random_forest',
    'gradient_boosting',
    'xgboost'
}

# Optional: Friendly model name mapping
MODEL_NAME_MAP = {
    'linear': 'linear_regression',
    'ridge': 'ridge_regression',
    'elasticnet': 'elasticnet',
    'lasso': 'lasso_regression',
    'bayesian': 'bayesian_ridge',
    'rf': 'random_forest',
    'gb': 'gradient_boosting',
    'xgb': 'xgboost'
}

# Globals
scaler = None
pca = None
label_encoder = None
categorical_columns = None
feature_columns = None
model_cache = {}

def extract_drive_id(url):
    try:
        return url.split('/')[5]
    except IndexError:
        return None

def download_if_needed(filename, url):
    local_path = MODELS_DIR / filename
    if not local_path.exists():
        try:
            print(f"Downloading {filename} from {url}")
            file_id = extract_drive_id(url)
            gdown.download(f"https://drive.google.com/uc?id={file_id}", str(local_path), quiet=False)
            print(f"Downloaded {filename}")
        except Exception as e:
            print(f"Error downloading {filename}: {e}")
            raise
    return local_path

def load_common_components():
    global scaler, pca, label_encoder, categorical_columns, feature_columns

    try:
        scaler = joblib.load(download_if_needed('scaler.joblib', MODEL_FILES['scaler.joblib']))
        pca = joblib.load(download_if_needed('pca.joblib', MODEL_FILES['pca.joblib']))
        label_encoder = joblib.load(download_if_needed('label_encoder.joblib', MODEL_FILES['label_encoder.joblib']))
        categorical_columns = joblib.load(download_if_needed('categorical_columns.joblib', MODEL_FILES['categorical_columns.joblib']))
        feature_columns = joblib.load(download_if_needed('feature_columns.joblib', MODEL_FILES['feature_columns.joblib']))
        print("Loaded common preprocessing components.")
    except Exception as e:
        print("Error loading core components:", e)

def get_model(model_type):
    """Lazy load the model from disk or cache"""
    if model_type in model_cache:
        return model_cache[model_type]

    filename = model_type.replace('-', '_') + '.joblib'
    url = MODEL_FILES.get(filename)
    if not url:
        raise ValueError(f"No URL configured for model type '{model_type}'")

    try:
        model_path = download_if_needed(filename, url)
        model = joblib.load(model_path)
        model_cache[model_type] = model  # Cache it
        return model
    except Exception as e:
        raise RuntimeError(f"Failed to load model '{model_type}': {e}")

def preprocess_data(data):
    try:
        processed_data = {col: 0 for col in feature_columns}

        for col in categorical_columns:
            if col in data:
                try:
                    processed_data[col] = label_encoder.transform([data[col]])[0]
                except ValueError:
                    processed_data[col] = -1

        for col in feature_columns:
            if col in data:
                processed_data[col] = float(data[col])

        feature_array = [processed_data[col] for col in feature_columns]
        scaled_data = scaler.transform([feature_array])
        return pca.transform(scaled_data)
    except Exception as e:
        raise ValueError(f"Preprocessing error: {e}")

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "API is running",
        "models_cached": list(model_cache.keys())
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        model_type_raw = data.pop('modelType', None)

        if not model_type_raw:
            return jsonify({'error': 'Missing "modelType" field.'}), 400

        # Convert to internal model name
        model_type = MODEL_NAME_MAP.get(model_type_raw, model_type_raw)

        if model_type not in ALLOWED_MODEL_TYPES:
            return jsonify({
                'error': f'Invalid modelType: "{model_type_raw}". Allowed values: {sorted(list(MODEL_NAME_MAP.keys())) + sorted(list(ALLOWED_MODEL_TYPES))}'
            }), 400

        # Load model and make prediction
        try:
            model = get_model(model_type)
            processed = preprocess_data(data)
            prediction = model.predict(processed)
            return jsonify({'prediction': float(prediction[0])})
        except Exception as e:
            # Check if this is the PCA error specifically
            if "PCA" in str(e) and "predict" in str(e):
                print("PCA error occurred. Attempting direct model prediction without PCA...")
                # Try again without PCA transformation
                processed_data = {col: 0 for col in feature_columns}
                
                for col in categorical_columns:
                    if col in data:
                        try:
                            processed_data[col] = label_encoder.transform([data[col]])[0]
                        except ValueError:
                            processed_data[col] = -1
                
                for col in feature_columns:
                    if col in data:
                        processed_data[col] = float(data[col])
                
                feature_array = [processed_data[col] for col in feature_columns]
                scaled_data = scaler.transform([feature_array])
                prediction = model.predict(scaled_data)
                return jsonify({'prediction': float(prediction[0])})
            else:
                # Re-raise if it's not the PCA error
                raise
    except Exception as e:
        print("Prediction error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Initialize preprocessing components on startup
load_common_components()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)