import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import accuracy_score, classification_report
from sklearn.utils import resample
import pickle
import os

# Read the csv
df = pd.read_csv("data.csv")
print("Original data shape:", df.shape)
print(df.head())

# Define features and target
categorical_cols = ["Platform", "Content_Type", "Target_Age", "Target_Gender", "Region"]
numerical_cols = ["Budget", "Duration"]
feature_cols = numerical_cols + categorical_cols
target_col = "Success"

print("\nOriginal class distribution:")
print(df[target_col].value_counts())
print(df[target_col].value_counts(normalize=True))

# BALANCE THE DATASET
df_success = df[df[target_col] == 1]
df_fail = df[df[target_col] == 0]

print(f"\nOriginal: {len(df_success)} successful, {len(df_fail)} unsuccessful")

# Downsample majority class to match minority class * 2
target_size = min(len(df_fail) * 2, len(df_success))

df_success_downsampled = resample(df_success,
                                  replace=False,
                                  n_samples=target_size,
                                  random_state=42)

# Upsample minority class
df_fail_upsampled = resample(df_fail,
                             replace=True,
                             n_samples=target_size // 2,
                             random_state=42)

# Combine
df_balanced = pd.concat([df_success_downsampled, df_fail_upsampled])
df_balanced = df_balanced.sample(frac=1, random_state=42).reset_index(drop=True)

print(f"\nBalanced: {len(df_balanced)} total campaigns")
print("\nBalanced class distribution:")
print(df_balanced[target_col].value_counts())
print(df_balanced[target_col].value_counts(normalize=True))

# Select features
X = df_balanced[feature_cols]
y = df_balanced[target_col]

# Split
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
    remainder='drop'
)

# Create pipeline with better settings
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight=None,  # Already balanced data
        max_depth=15,
        min_samples_split=10,
        min_samples_leaf=4,
        max_features='sqrt'
    ))
])

# Train
print("\nTraining balanced pipeline...")
pipeline.fit(X_train, y_train)

# Evaluate
y_pred = pipeline.predict(X_test)
print("\nAccuracy on test set:", accuracy_score(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nPrediction distribution on test set:")
pred_dist = pd.Series(y_pred).value_counts()
print(pred_dist)
print("\nPercentages:")
print(pred_dist / len(y_pred) * 100)

# Save
os.makedirs('dependencies', exist_ok=True)
pipeline_path = os.path.join('dependencies', 'roi_pipeline.pkl')

with open(pipeline_path, 'wb') as f:
    pickle.dump(pipeline, f)

print(f"\nPipeline saved as {pipeline_path}")
print("Ready to use with Flask!")

# Test with diverse samples
print("\n" + "="*60)
print("TESTING WITH DIFFERENT CAMPAIGNS")
print("="*60)

test_samples = pd.DataFrame([
    {'Budget': 5000, 'Duration': 7, 'Platform': 'TikTok', 'Content_Type': 'Video', 
     'Target_Age': '18-24', 'Target_Gender': 'All', 'Region': 'India'},
    {'Budget': 50000, 'Duration': 60, 'Platform': 'Google', 'Content_Type': 'Text', 
     'Target_Age': '35-44', 'Target_Gender': 'All', 'Region': 'US'},
    {'Budget': 25000, 'Duration': 30, 'Platform': 'Instagram', 'Content_Type': 'Story', 
     'Target_Age': '25-34', 'Target_Gender': 'Female', 'Region': 'UK'},
    {'Budget': 15000, 'Duration': 14, 'Platform': 'Facebook', 'Content_Type': 'Image', 
     'Target_Age': '45-54', 'Target_Gender': 'Male', 'Region': 'Canada'},
])

predictions = pipeline.predict(test_samples)
probabilities = pipeline.predict_proba(test_samples)

for i in range(len(test_samples)):
    print(f"\nCampaign {i+1}: {test_samples.iloc[i]['Platform']}, ${test_samples.iloc[i]['Budget']}, {test_samples.iloc[i]['Duration']} days")
    print(f"  Prediction: {'SUCCESS (Invest)' if predictions[i] == 1 else 'FAIL (Avoid)'}")
    print(f"  Confidence: {probabilities[i][predictions[i]] * 100:.1f}%")

print("\n" + "="*60)
success_count = predictions.sum()
print(f"Results: {success_count}/4 predicted successful")
print("If you see VARIED predictions above, the model is working well!")
print("="*60)
