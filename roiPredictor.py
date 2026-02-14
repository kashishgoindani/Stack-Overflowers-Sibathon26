<<<<<<< HEAD
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

# Read the csv using pandas
df = pd.read_csv("data.csv")
print(df.head())
print(df.info())

# Check for null values
print("\nNull values:")
print(df.isnull().sum())

# Look at distribution
print("\nData description:")
print(df.describe())

# Define features and target
categorical_cols = ["Platform", "Content_Type", "Target_Age", "Target_Gender", "Region"]
numerical_cols = ["Budget", "Duration"]
feature_cols = numerical_cols + categorical_cols
target_col = "Success"

# Select only the columns we need
X = df[feature_cols]
y = df[target_col]

print("\nFeatures being used:", feature_cols)

# Check class distribution
print("\nClass distribution:")
print(y.value_counts())
print(y.value_counts(normalize=True))

# Split Data into Train and Test Sets with stratification
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Create preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('num', 'passthrough', numerical_cols),
        ('cat', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'), 
         categorical_cols)
    ],
    remainder='drop'  # Drop any other columns
)

# Create pipeline with preprocessing and model
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(
        n_estimators=100, 
        random_state=42,
        class_weight='balanced',
        max_depth=10,
        min_samples_split=20
    ))
])

# Train pipeline
print("\nTraining pipeline...")
pipeline.fit(X_train, y_train)

# Model evaluation
y_pred = pipeline.predict(X_test)
print("\nAccuracy on test set:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Check prediction distribution
print("\nPrediction distribution on test set:")
print(pd.Series(y_pred).value_counts())

# Save pipeline
os.makedirs('dependencies', exist_ok=True)
pipeline_path = os.path.join('dependencies', 'roi_pipeline.pkl')

with open(pipeline_path, 'wb') as f:
    pickle.dump(pipeline, f)

print(f"\n✅ Pipeline saved as {pipeline_path}")
print("✅ Ready to integrate with Flask backend!")

# Test the pipeline with sample data
print("\n--- Testing Pipeline ---")
test_sample = pd.DataFrame([{
    'Budget': 25000,
    'Duration': 30,
    'Platform': 'Instagram',
    'Content_Type': 'Video',
    'Target_Age': '25-34',
    'Target_Gender': 'Female',
    'Region': 'US'
}])

prediction = pipeline.predict(test_sample)[0]
probability = pipeline.predict_proba(test_sample)[0]

print(f"Test prediction: {prediction}")
print(f"Recommendation: {'Invest' if prediction == 1 else 'Avoid'}")
print(f"Confidence: {probability[prediction] * 100:.2f}%")
=======
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score


# read the csv using pandas
df = pd.read_csv("data.csv")
print(df.head())
print(df.info())

#  check for null values
print(df.isnull().sum())

# Look at distribution of key columns like Clicks, Conversions, Budget:
print(df.describe())

# data preprocessing
    # Convert categorical columns into numbers: using one hot encoding
categorical_cols = ["Platform", "Content_Type", "Target_Gender", "Region","Target_Age"]
df = pd.get_dummies(df, columns=categorical_cols)

    # deciding target  and features
target_col = "Success"

# Remove features that are calculated FROM or directly determine the Success label
leaky_features = ['CTR', 'CPC', 'Conversion_Rate', 'Clicks', 'Conversions']

X = df.drop(columns=["Campaign_ID", target_col] + leaky_features)
y = df[target_col]

print("Features being used:", X.columns.tolist())

# Check class distribution
print("\nClass distribution:")
print(y.value_counts())
print(y.value_counts(normalize=True))

# Split Data into Train and Test Sets with stratification
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Training Model with class balancing
model = RandomForestClassifier(
    n_estimators=100, 
    random_state=42,
    class_weight='balanced'
)
model.fit(X_train, y_train)

# Model evaluation
y_pred = model.predict(X_test)
print("\nAccuracy on test set:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Check prediction distribution
print("\nPrediction distribution on test set:")
print(pd.Series(y_pred).value_counts())

# Recommendations
    # Add predictions and recommendations to dataframe
df["Predicted_Success"] = model.predict(X)
df["Recommendation"] = ["Invest" if pred == 1 else "Avoid" for pred in df["Predicted_Success"]]

# Showing first 10 campaigns with predictions
print("\nSample Recommendations:")
print(df[["Campaign_ID", "Predicted_Success", "Recommendation"]].head(20))

# Show prediction distribution on full dataset
print("\nFull dataset prediction distribution:")
print(df["Predicted_Success"].value_counts())
print(df["Recommendation"].value_counts())

#   Saving Model for Backend Integration
import pickle
with open("roi_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("\nModel saved as roi_model.pkl. Ready to integrate with website backend.")
>>>>>>> cfca9b5308dc58eb825b7088b636af14894912aa
