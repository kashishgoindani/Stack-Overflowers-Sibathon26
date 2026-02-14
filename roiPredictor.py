import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os
import sys

# ===== FILE READING FUNCTION =====
def read_data_file(filepath):
    """
    Read data from CSV or Excel file
    """
    file_extension = os.path.splitext(filepath)[1].lower()
    
    if file_extension == '.csv':
        print(f"Reading CSV file: {filepath}")
        try:
            df = pd.read_csv(filepath, encoding='utf-8')
        except UnicodeDecodeError:
            print("UTF-8 failed, trying latin1 encoding...")
            df = pd.read_csv(filepath, encoding='latin1')
    elif file_extension in ['.xlsx', '.xls']:
        print(f"Reading Excel file: {filepath}")
        try:
            df = pd.read_excel(filepath, engine='openpyxl')
        except ImportError:
            print("Error: openpyxl not installed. Installing...")
            os.system('pip install openpyxl')
            df = pd.read_excel(filepath, engine='openpyxl')
    else:
        raise ValueError(f"Unsupported file format: {file_extension}. Use .csv, .xlsx, or .xls")
    
    return df

# ===== MAIN CODE =====

# Check if file path is provided as argument, otherwise use default
if len(sys.argv) > 1:
    data_file = sys.argv[1]
else:
    # Try to find data file automatically
    if os.path.exists("data.csv"):
        data_file = "data.csv"
    elif os.path.exists("data.xlsx"):
        data_file = "data.xlsx"
    elif os.path.exists("data.xls"):
        data_file = "data.xls"
    else:
        print("Error: No data file found!")
        print("Usage: python roiPredictor.py <filepath>")
        print("Example: python roiPredictor.py data.csv")
        print("         python roiPredictor.py data.xlsx")
        sys.exit(1)

print(f"Using data file: {data_file}")
print("=" * 50)

# Read the data file
df = read_data_file(data_file)

print("\nFirst 5 rows:")
print(df.head())
print("\nDataframe info:")
print(df.info())

# Check for null values
print("\nNull values:")
print(df.isnull().sum())

# Look at distribution
print("\nData description:")
print(df.describe())

# Data preprocessing
# Convert categorical columns into numbers: using one hot encoding
categorical_cols = ["Platform", "Content_Type", "Target_Gender", "Region", "Target_Age"]

# Check if all required columns exist
missing_cols = [col for col in categorical_cols if col not in df.columns]
if missing_cols:
    print(f"\nError: Missing required columns: {missing_cols}")
    print(f"Found columns: {list(df.columns)}")
    sys.exit(1)

df = pd.get_dummies(df, columns=categorical_cols)

# Deciding target and features
target_col = "Success"

if target_col not in df.columns:
    print(f"\nError: Target column '{target_col}' not found in data!")
    print(f"Available columns: {list(df.columns)}")
    sys.exit(1)

# Remove features that are calculated FROM or directly determine the Success label
leaky_features = ['CTR', 'CPC', 'Conversion_Rate', 'Clicks', 'Conversions']

# Only remove leaky features that exist
leaky_to_remove = [col for col in leaky_features if col in df.columns]
columns_to_drop = ["Campaign_ID", target_col] + leaky_to_remove

# Remove only columns that exist
columns_to_drop = [col for col in columns_to_drop if col in df.columns]

X = df.drop(columns=columns_to_drop)
y = df[target_col]

print("\nFeatures being used:", X.columns.tolist())
print(f"Total features: {len(X.columns)}")

# Check class distribution
print("\nClass distribution:")
print(y.value_counts())
print("\nClass distribution (%):")
print(y.value_counts(normalize=True) * 100)

# Split Data into Train and Test Sets with stratification
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\nTraining set size: {len(X_train)}")
print(f"Test set size: {len(X_test)}")

# Training Model with class balancing
print("\n" + "=" * 50)
print("Training Random Forest Model...")
print("=" * 50)

model = RandomForestClassifier(
    n_estimators=100, 
    random_state=42,
    class_weight='balanced',
    max_depth=10,
    min_samples_split=20
)
model.fit(X_train, y_train)

print("✓ Model training complete!")

# Model evaluation
y_pred = model.predict(X_test)
print("\n" + "=" * 50)
print("MODEL EVALUATION")
print("=" * 50)
print(f"\nAccuracy on test set: {accuracy_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Check prediction distribution
print("\nPrediction distribution on test set:")
print(pd.Series(y_pred).value_counts())

# Recommendations
# Add predictions and recommendations to dataframe
print("\n" + "=" * 50)
print("GENERATING PREDICTIONS")
print("=" * 50)

df["Predicted_Success"] = model.predict(X)
df["Recommendation"] = ["Invest" if pred == 1 else "Avoid" for pred in df["Predicted_Success"]]

# Showing first 20 campaigns with predictions
print("\nSample Recommendations:")
print(df[["Campaign_ID", "Predicted_Success", "Recommendation"]].head(20))

# Show prediction distribution on full dataset
print("\nFull dataset prediction distribution:")
print(df["Predicted_Success"].value_counts())
print("\nRecommendation distribution:")
print(df["Recommendation"].value_counts())

# Saving Model for Backend Integration
print("\n" + "=" * 50)
print("SAVING MODEL")
print("=" * 50)

# Create dependencies folder if it doesn't exist
os.makedirs('dependencies', exist_ok=True)

model_path = os.path.join('dependencies', 'roi_model.pkl')

with open(model_path, "wb") as f:
    pickle.dump(model, f)

print(f"\n✓ Model saved as {model_path}")
print("✓ Ready to integrate with website backend!")

# Save a sample of predictions to CSV for verification
output_file = "predictions_" + os.path.splitext(os.path.basename(data_file))[0] + ".csv"
df[["Campaign_ID", "Budget", "Duration", "Predicted_Success", "Recommendation"]].to_csv(output_file, index=False)
print(f"✓ Predictions saved to {output_file}")

print("\n" + "=" * 50)
print("DONE!")
print("=" * 50)