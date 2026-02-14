from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['UPLOAD_FOLDER'] = 'uploads'

if not os.path.exists('uploads'):
    os.makedirs('uploads')

# Load model
try:
    with open('dependencies/roi_pipeline.pkl', 'rb') as f:
        model = pickle.load(f)
        use_pipeline = True
        print("✓ Pipeline loaded")
except:
    try:
        with open('dependencies/roi_model.pkl', 'rb') as f:
            model = pickle.load(f)
            use_pipeline = False
            print("✓ Old model loaded - using manual encoding")
    except:
        print("✗ No model found")
        model = None
        use_pipeline = False

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})

@app.route('/predict', methods=['POST'])
def predict():
    print("📥 Received prediction request")
    
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    print(f"📄 File: {file.filename}")
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        print(f"💾 Saved to: {filepath}")

        # Read file
        if filepath.endswith('.csv'):
            try:
                df = pd.read_csv(filepath, encoding='utf-8')
            except:
                df = pd.read_csv(filepath, encoding='latin1')
        elif filepath.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(filepath, engine='openpyxl')
        else:
            return jsonify({"error": "Unsupported file type"}), 400

        print(f"📊 Loaded {len(df)} rows")
        print(f"Original columns: {list(df.columns)}")

        # Column mapping
        df.columns = df.columns.str.strip().str.lower()
        
        column_map = {
            'budget': 'Budget',
            'duration': 'Duration',
            'platform': 'Platform',
            'content_type': 'Content_Type',
            'content type': 'Content_Type',
            'target_gender': 'Target_Gender',
            'target gender': 'Target_Gender',
            'gender': 'Target_Gender',
            'region': 'Region',
            'target_age': 'Target_Age',
            'target age': 'Target_Age',
            'age': 'Target_Age',
            'age group': 'Target_Age',
            'agegroup': 'Target_Age'
        }
        
        df = df.rename(columns=column_map)
        print(f"After mapping: {list(df.columns)}")
        
        required = ['Budget', 'Duration', 'Platform', 'Content_Type', 
                   'Target_Gender', 'Region', 'Target_Age']
        
        missing = [col for col in required if col not in df.columns]
        if missing:
            return jsonify({
                "error": f"Missing columns: {missing}",
                "found": list(df.columns)
            }), 400

        # Save original for display
        original_df = df.copy()

        if use_pipeline:
            # NEW PIPELINE - handles encoding automatically
            print("Using pipeline (automatic encoding)")
            X = df[required].copy()
            predictions = model.predict(X)
            probabilities = model.predict_proba(X)[:, 1]
            
        else:
            # OLD MODEL - needs manual one-hot encoding
            print("Using old model (manual encoding)")
            
            # Select features
            feature_df = df[required].copy()
            
            # One-hot encode categorical columns
            categorical_cols = ['Platform', 'Content_Type', 'Target_Gender', 'Region', 'Target_Age']
            encoded_df = pd.get_dummies(feature_df, columns=categorical_cols, drop_first=True)
            
            print(f"Encoded columns: {list(encoded_df.columns)}")
            
            # Make predictions
            predictions = model.predict(encoded_df)
            
            if hasattr(model, 'predict_proba'):
                probabilities = model.predict_proba(encoded_df)[:, 1]
            else:
                probabilities = predictions
        
        # Add results to original dataframe
        original_df['Predicted_Success'] = predictions
        original_df['Success_Probability'] = probabilities * 100
        original_df['Recommendation'] = ['Invest' if p == 1 else 'Avoid' for p in predictions]
        
        # Calculate stats
        total_campaigns = len(original_df)
        successful = int(predictions.sum())
        success_rate = (successful / total_campaigns) * 100
        
        print(f"✅ Predictions complete: {successful}/{total_campaigns} successful")
        
        response = {
            "total_campaigns": total_campaigns,
            "predicted_successful": successful,
            "predicted_unsuccessful": total_campaigns - successful,
            "success_rate": round(success_rate, 2),
            "avg_confidence": round(probabilities.mean() * 100, 2),
            "campaigns": original_df.to_dict(orient='records')[:100]
        }
        
        return jsonify(response)
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ Error: {e}")
        print(error_trace)
        return jsonify({"error": str(e), "trace": error_trace}), 500

if __name__ == '__main__':
    print("\n🚀 Starting Flask server...")
    print("📍 Server will run on: http://127.0.0.1:5000")
    print("🔧 CORS enabled for all origins\n")
    app.run(debug=False, port=5000, host='0.0.0.0')