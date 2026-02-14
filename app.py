from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.linear_model import LinearRegression
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure uploads folder exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# === Step 4a: Define or train AI model ===
# Dummy regression model (replace with real training if needed)
# Example: X = [AmountSpent, PlatformEncoded], Y = ROI
model = LinearRegression()
model.fit([[100, 0], [200, 1], [300, 0]], [10, 20, 25])

# === Step 4b: Home route to render frontend ===
@app.route('/')
def home():
    return render_template('index.html')  # HTML file we will create

# === Step 4c: CSV Upload + Predict route ===
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    # Save uploaded file
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    # Read CSV
    df = pd.read_csv(filepath)

    # Basic preprocessing (you may need to encode categorical features)
    # Example: Platform column encoded manually
    platform_mapping = {'Facebook':0, 'Instagram':1, 'Google':2}
    if 'Platform' in df.columns:
        df['Platform'] = df['Platform'].map(platform_mapping)

    # Features
    X = df[['AmountSpent', 'Platform']]  # adjust columns as per your CSV

    # Predict ROI
    df['PredictedROI'] = model.predict(X)

    # Return predictions as JSON
    return df.to_json(orient='records')

# === Step 4d: Run server ===
if __name__ == '__main__':
    app.run(debug=True)
