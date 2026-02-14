from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure uploads folder exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# Load trained pipeline or model
pipeline_path = os.path.join('dependencies', 'roi_pipeline.pkl')
model_path = os.path.join('dependencies', 'roi_model.pkl')

try:
    with open(pipeline_path, 'rb') as f:
        pipeline = pickle.load(f)
    print("✓ Pipeline loaded successfully from dependencies/roi_pipeline.pkl")
    model = pipeline
    use_pipeline = True
except FileNotFoundError:
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print("✓ Old model loaded from dependencies/roi_model.pkl")
        print("⚠ Consider retraining with pipeline for better flexibility")
        use_pipeline = False
    except FileNotFoundError:
        print("✗ Model file not found. Please run roiPredictor.py first.")
        model = None
        use_pipeline = False

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy", 
        "model_loaded": model is not None,
        "using_pipeline": use_pipeline
    })

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Save uploaded file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)

        # Detect file type and read accordingly
        file_extension = os.path.splitext(filepath)[1].lower()
        
        if file_extension == '.csv':
            # Read CSV with encoding fix
            try:
                df = pd.read_csv(filepath, encoding='utf-8')
            except UnicodeDecodeError:
                df = pd.read_csv(filepath, encoding='latin1')
        elif file_extension in ['.xlsx', '.xls']:
            # Read Excel file
            try:
                df = pd.read_excel(filepath, engine='openpyxl')
            except Exception as e:
                return jsonify({
                    "error": f"Error reading Excel file: {str(e)}",
                    "hint": "Make sure openpyxl is installed: pip install openpyxl"
                }), 400
        else:
            return jsonify({
                "error": f"Unsupported file format: {file_extension}",
                "supported_formats": [".csv", ".xlsx", ".xls"]
            }), 400

        # ===== COLUMN MAPPING =====
        # Auto-detect and map column name variations
        column_mapping = {
            # Budget variations
            'budget': 'Budget',
            'campaign_budget': 'Budget',
            'campaign budget': 'Budget',
            'total_budget': 'Budget',
            'ad_budget': 'Budget',
            
            # Duration variations
            'duration': 'Duration',
            'campaign_duration': 'Duration',
            'campaign duration': 'Duration',
            'days': 'Duration',
            'length': 'Duration',
            
            # Platform variations
            'platform': 'Platform',
            'ad_platform': 'Platform',
            'ad platform': 'Platform',
            'channel': 'Platform',
            'media': 'Platform',
            
            # Content Type variations
            'content_type': 'Content_Type',
            'content type': 'Content_Type',
            'contenttype': 'Content_Type',
            'ad_type': 'Content_Type',
            'ad type': 'Content_Type',
            'creative_type': 'Content_Type',
            
            # Gender variations
            'target_gender': 'Target_Gender',
            'target gender': 'Target_Gender',
            'gender': 'Target_Gender',
            'audience_gender': 'Target_Gender',
            
            # Region variations
            'region': 'Region',
            'location': 'Region',
            'country': 'Region',
            'market': 'Region',
            'geo': 'Region',
            
            # Age variations
            'target_age': 'Target_Age',
            'target age': 'Target_Age',
            'age': 'Target_Age',
            'age_group': 'Target_Age',
            'age group': 'Target_Age',
            'agegroup': 'Target_Age',
            'audience_age': 'Target_Age',
        }
        
        # Normalize column names (lowercase, strip spaces)
        df.columns = df.columns.str.strip().str.lower()
        
        # Apply mapping
        df = df.rename(columns=column_mapping)
        
        print(f"Columns after mapping: {list(df.columns)}")

        original_df = df.copy()  # Keep original for display
        
        # Required columns
        required_cols = ["Budget", "Duration", "Platform", "Content_Type", 
                        "Target_Gender", "Region", "Target_Age"]
        
        # Check if required columns exist after mapping
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            return jsonify({
                "error": f"Missing required columns after mapping",
                "missing_columns": missing_cols,
                "found_columns": list(df.columns),
                "hint": "Upload file must contain: Budget, Duration, Platform, Content Type, Gender, Region, and Age columns"
            }), 400
        
        # Prepare features for prediction
        if use_pipeline:
            # Pipeline handles preprocessing automatically!
            X = df[required_cols]
            predictions = pipeline.predict(X)
            probabilities = pipeline.predict_proba(X)[:, 1]
        else:
            # Old way - manual preprocessing
            categorical_cols = ["Platform", "Content_Type", "Target_Gender", "Region", "Target_Age"]
            
            # One-hot encoding
            df_encoded = pd.get_dummies(df, columns=categorical_cols)
            
            # Remove leaky features and ID columns
            leaky_features = ['CTR', 'CPC', 'Conversion_Rate', 'Clicks', 'Conversions', 'Success']
            features_to_remove = ["Campaign_ID"] + leaky_features
            
            X = df_encoded.drop(columns=[col for col in features_to_remove if col in df_encoded.columns], errors='ignore')
            
            predictions = model.predict(X)
            probabilities = model.predict_proba(X)[:, 1] if hasattr(model, 'predict_proba') else predictions
        
        # Add predictions to original dataframe
        original_df['Predicted_Success'] = predictions
        original_df['Success_Probability'] = probabilities * 100  # Convert to percentage
        original_df['Recommendation'] = ["Invest" if pred == 1 else "Avoid" for pred in predictions]
        
        # Calculate summary statistics
        platform_stats = original_df.groupby('Platform').agg({
            'Budget': 'sum',
            'Predicted_Success': 'mean',
            'Success_Probability': 'mean'
        }).reset_index()
        
        platform_stats['Success_Rate'] = platform_stats['Predicted_Success'] * 100
        platform_stats['Avg_Confidence'] = platform_stats['Success_Probability']
        
        total_budget = original_df['Budget'].sum()
        success_rate = (predictions.sum() / len(predictions)) * 100
        predicted_successful_campaigns = int(predictions.sum())
        avg_confidence = probabilities.mean() * 100
        
        # Return detailed response
        response = {
            "total_campaigns": len(original_df),
            "predicted_successful": predicted_successful_campaigns,
            "predicted_unsuccessful": len(predictions) - predicted_successful_campaigns,
            "success_rate": round(success_rate, 2),
            "avg_confidence": round(avg_confidence, 2),
            "total_budget": int(total_budget),
            "recommended_budget": int(original_df[original_df['Predicted_Success'] == 1]['Budget'].sum()),
            "platform_stats": platform_stats.to_dict(orient='records'),
            "campaigns": original_df.to_dict(orient='records'),
            "using_pipeline": use_pipeline,
            "file_type": file_extension
        }
        
        return jsonify(response)
    
    except Exception as e:
        import traceback
        return jsonify({
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500

@app.route('/predict-single', methods=['POST'])
def predict_single():
    """Endpoint for single campaign prediction from form"""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        data = request.json
        
        # Create DataFrame with single row
        input_data = pd.DataFrame([{
            'Budget': int(data['budget']),
            'Duration': int(data['duration']),
            'Platform': data['platform'],
            'Content_Type': data['content_type'],
            'Target_Age': data['target_age'],
            'Target_Gender': data['target_gender'],
            'Region': data['region']
        }])
        
        if use_pipeline:
            # Pipeline handles everything
            prediction = pipeline.predict(input_data)[0]
            probability = pipeline.predict_proba(input_data)[0]
        else:
            # Old way - manual preprocessing
            categorical_cols = ["Platform", "Content_Type", "Target_Gender", "Region", "Target_Age"]
            input_encoded = pd.get_dummies(input_data, columns=categorical_cols)
            
            prediction = model.predict(input_encoded)[0]
            probability = model.predict_proba(input_encoded)[0]
        
        return jsonify({
            'success': True,
            'prediction': int(prediction),
            'recommendation': 'Invest' if prediction == 1 else 'Avoid',
            'confidence': float(probability[prediction]) * 100,
            'using_pipeline': use_pipeline
        })
    
    except Exception as e:
        import traceback
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 400

@app.route('/columns', methods=['GET'])
def get_columns():
    """Return required columns for prediction"""
    return jsonify({
        "required_columns": [
            {
                "name": "Budget",
                "type": "number",
                "description": "Campaign budget in dollars",
                "example": 25000
            },
            {
                "name": "Duration",
                "type": "number",
                "description": "Campaign duration in days",
                "example": 30
            },
            {
                "name": "Platform",
                "type": "text",
                "description": "Advertising platform",
                "options": ["Facebook", "Google", "Instagram", "LinkedIn", "YouTube"],
                "example": "Instagram"
            },
            {
                "name": "Content_Type",
                "type": "text",
                "description": "Type of ad content",
                "options": ["Video", "Image", "Carousel", "Story", "Text"],
                "example": "Video"
            },
            {
                "name": "Target_Gender",
                "type": "text",
                "description": "Target audience gender",
                "options": ["Male", "Female", "All"],
                "example": "Female"
            },
            {
                "name": "Region",
                "type": "text",
                "description": "Target region/country",
                "options": ["US", "UK", "India", "Canada", "Germany"],
                "example": "US"
            },
            {
                "name": "Target_Age",
                "type": "text",
                "description": "Target age group",
                "options": ["18-24", "25-34", "35-44", "45-54", "55+"],
                "example": "25-34"
            }
        ]
    })

@app.route('/validate', methods=['POST'])
def validate_file():
    """Validate uploaded file has correct columns"""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'temp_' + file.filename)
        file.save(filepath)
        
        file_extension = os.path.splitext(filepath)[1].lower()
        
        if file_extension == '.csv':
            df = pd.read_csv(filepath, encoding='utf-8', nrows=5)
        elif file_extension in ['.xlsx', '.xls']:
            df = pd.read_excel(filepath, engine='openpyxl', nrows=5)
        else:
            return jsonify({"error": "Unsupported file format"}), 400
        
        # Clean up temp file
        os.remove(filepath)
        
        required_cols = ["Budget", "Duration", "Platform", "Content_Type", 
                        "Target_Gender", "Region", "Target_Age"]
        
        found_cols = list(df.columns)
        missing_cols = [col for col in required_cols if col not in found_cols]
        
        return jsonify({
            "valid": len(missing_cols) == 0,
            "found_columns": found_cols,
            "missing_columns": missing_cols,
            "sample_data": df.head(3).to_dict(orient='records')
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)