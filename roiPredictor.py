
# import pandas as pd
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.metrics import accuracy_score, classification_report
# import pickle
# import os
# import sys

# # ===== FILE READING FUNCTION =====
# def read_data_file(filepath):
#     """
#     Read data from CSV or Excel file
#     """
#     file_extension = os.path.splitext(filepath)[1].lower()
    
#     if file_extension == '.csv':
#         print(f"Reading CSV file: {filepath}")
#         try:
#             df = pd.read_csv(filepath, encoding='utf-8')
#         except UnicodeDecodeError:
#             print("UTF-8 failed, trying latin1 encoding...")
#             df = pd.read_csv(filepath, encoding='latin1')
#     elif file_extension in ['.xlsx', '.xls']:
#         print(f"Reading Excel file: {filepath}")
#         try:
#             df = pd.read_excel(filepath, engine='openpyxl')
#         except ImportError:
#             print("Error: openpyxl not installed. Installing...")
#             os.system('pip install openpyxl')
#             df = pd.read_excel(filepath, engine='openpyxl')
#     else:
#         raise ValueError(f"Unsupported file format: {file_extension}. Use .csv, .xlsx, or .xls")
    
#     return df

# # ===== MAIN CODE =====

# # Check if file path is provided as argument, otherwise use default
# if len(sys.argv) > 1:
#     data_file = sys.argv[1]
# else:
#     # Try to find data file automatically
#     if os.path.exists("data.csv"):
#         data_file = "data.csv"
#     elif os.path.exists("data.xlsx"):
#         data_file = "data.xlsx"
#     elif os.path.exists("data.xls"):
#         data_file = "data.xls"
#     else:
#         print("Error: No data file found!")
#         print("Usage: python roiPredictor.py <filepath>")
#         print("Example: python roiPredictor.py data.csv")
#         print("         python roiPredictor.py data.xlsx")
#         sys.exit(1)

# print(f"Using data file: {data_file}")
# print("=" * 50)

# # Read the data file
# df = read_data_file(data_file)

# print("\nFirst 5 rows:")
# print(df.head())
# print("\nDataframe info:")
# =======
# <<<<<<< HEAD
# import pandas as pd
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.pipeline import Pipeline
# from sklearn.compose import ColumnTransformer
# from sklearn.preprocessing import OneHotEncoder
# from sklearn.metrics import accuracy_score, classification_report
# import pickle
# import os

# # Read the csv using pandas
# df = pd.read_csv("data.csv")
# print(df.head())
# >>>>>>> 868b2aa414e10b94ce508c9ffe150317430fda60
# print(df.info())

# # Check for null values
# print("\nNull values:")
# print(df.isnull().sum())

# # Look at distribution
# print("\nData description:")
# print(df.describe())

# <<<<<<< HEAD
# # Data preprocessing
# # Convert categorical columns into numbers: using one hot encoding
# categorical_cols = ["Platform", "Content_Type", "Target_Gender", "Region", "Target_Age"]

# # Check if all required columns exist
# missing_cols = [col for col in categorical_cols if col not in df.columns]
# if missing_cols:
#     print(f"\nError: Missing required columns: {missing_cols}")
#     print(f"Found columns: {list(df.columns)}")
#     sys.exit(1)

# df = pd.get_dummies(df, columns=categorical_cols)

# # Deciding target and features
# target_col = "Success"

# if target_col not in df.columns:
#     print(f"\nError: Target column '{target_col}' not found in data!")
#     print(f"Available columns: {list(df.columns)}")
#     sys.exit(1)

# # Remove features that are calculated FROM or directly determine the Success label
# leaky_features = ['CTR', 'CPC', 'Conversion_Rate', 'Clicks', 'Conversions']

# # Only remove leaky features that exist
# leaky_to_remove = [col for col in leaky_features if col in df.columns]
# columns_to_drop = ["Campaign_ID", target_col] + leaky_to_remove

# # Remove only columns that exist
# columns_to_drop = [col for col in columns_to_drop if col in df.columns]

# X = df.drop(columns=columns_to_drop)
# y = df[target_col]

# print("\nFeatures being used:", X.columns.tolist())
# print(f"Total features: {len(X.columns)}")
# =======
# # Define features and target
# categorical_cols = ["Platform", "Content_Type", "Target_Age", "Target_Gender", "Region"]
# numerical_cols = ["Budget", "Duration"]
# feature_cols = numerical_cols + categorical_cols
# target_col = "Success"

# # Select only the columns we need
# X = df[feature_cols]
# y = df[target_col]

# print("\nFeatures being used:", feature_cols)
# >>>>>>> 868b2aa414e10b94ce508c9ffe150317430fda60

# # Check class distribution
# print("\nClass distribution:")
# print(y.value_counts())
# <<<<<<< HEAD
# print("\nClass distribution (%):")
# print(y.value_counts(normalize=True) * 100)
# =======
# print(y.value_counts(normalize=True))
# >>>>>>> 868b2aa414e10b94ce508c9ffe150317430fda60

# # Split Data into Train and Test Sets with stratification
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42, stratify=y
# )

# <<<<<<< HEAD
# print(f"\nTraining set size: {len(X_train)}")
# print(f"Test set size: {len(X_test)}")

# # Training Model with class balancing
# print("\n" + "=" * 50)
# print("Training Random Forest Model...")
# print("=" * 50)

# model = RandomForestClassifier(
#     n_estimators=100, 
#     random_state=42,
#     class_weight='balanced',
#     max_depth=10,
#     min_samples_split=20
# )
# model.fit(X_train, y_train)

# print("✓ Model training complete!")

# # Model evaluation
# y_pred = model.predict(X_test)
# print("\n" + "=" * 50)
# print("MODEL EVALUATION")
# print("=" * 50)
# print(f"\nAccuracy on test set: {accuracy_score(y_test, y_pred):.4f}")
# print("\nClassification Report:")
# print(classification_report(y_test, y_pred))
# =======
# # Create preprocessor
# preprocessor = ColumnTransformer(
#     transformers=[
#         ('num', 'passthrough', numerical_cols),
#         ('cat', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'), 
#          categorical_cols)
#     ],
#     remainder='drop'  # Drop any other columns
# )

# # Create pipeline with preprocessing and model
# pipeline = Pipeline([
#     ('preprocessor', preprocessor),
#     ('classifier', RandomForestClassifier(
#         n_estimators=100, 
#         random_state=42,
#         class_weight='balanced',
#         max_depth=10,
#         min_samples_split=20
#     ))
# ])

# # Train pipeline
# print("\nTraining pipeline...")
# pipeline.fit(X_train, y_train)

# # Model evaluation
# y_pred = pipeline.predict(X_test)
# print("\nAccuracy on test set:", accuracy_score(y_test, y_pred))
# print("\nClassification Report:\n", classification_report(y_test, y_pred))

# # Check prediction distribution
# print("\nPrediction distribution on test set:")
# print(pd.Series(y_pred).value_counts())

# # Save pipeline
# os.makedirs('dependencies', exist_ok=True)
# pipeline_path = os.path.join('dependencies', 'roi_pipeline.pkl')

# with open(pipeline_path, 'wb') as f:
#     pickle.dump(pipeline, f)

# print(f"\n✅ Pipeline saved as {pipeline_path}")
# print("✅ Ready to integrate with Flask backend!")

# # Test the pipeline with sample data
# print("\n--- Testing Pipeline ---")
# test_sample = pd.DataFrame([{
#     'Budget': 25000,
#     'Duration': 30,
#     'Platform': 'Instagram',
#     'Content_Type': 'Video',
#     'Target_Age': '25-34',
#     'Target_Gender': 'Female',
#     'Region': 'US'
# }])

# prediction = pipeline.predict(test_sample)[0]
# probability = pipeline.predict_proba(test_sample)[0]

# print(f"Test prediction: {prediction}")
# print(f"Recommendation: {'Invest' if prediction == 1 else 'Avoid'}")
# print(f"Confidence: {probability[prediction] * 100:.2f}%")
# =======
# import pandas as pd
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
# from sklearn.preprocessing import LabelEncoder
# from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score


# # read the csv using pandas
# df = pd.read_csv("data.csv")
# print(df.head())
# print(df.info())

# #  check for null values
# print(df.isnull().sum())

# # Look at distribution of key columns like Clicks, Conversions, Budget:
# print(df.describe())

# # data preprocessing
#     # Convert categorical columns into numbers: using one hot encoding
# categorical_cols = ["Platform", "Content_Type", "Target_Gender", "Region","Target_Age"]
# df = pd.get_dummies(df, columns=categorical_cols)

#     # deciding target  and features
# target_col = "Success"

# # Remove features that are calculated FROM or directly determine the Success label
# leaky_features = ['CTR', 'CPC', 'Conversion_Rate', 'Clicks', 'Conversions']

# X = df.drop(columns=["Campaign_ID", target_col] + leaky_features)
# y = df[target_col]

# print("Features being used:", X.columns.tolist())

# # Check class distribution
# print("\nClass distribution:")
# print(y.value_counts())
# print(y.value_counts(normalize=True))

# # Split Data into Train and Test Sets with stratification
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42, stratify=y
# )

# # Training Model with class balancing
# model = RandomForestClassifier(
#     n_estimators=100, 
#     random_state=42,
#     class_weight='balanced'
# )
# model.fit(X_train, y_train)

# # Model evaluation
# y_pred = model.predict(X_test)
# print("\nAccuracy on test set:", accuracy_score(y_test, y_pred))
# print("\nClassification Report:\n", classification_report(y_test, y_pred))
# >>>>>>> 868b2aa414e10b94ce508c9ffe150317430fda60

# # Check prediction distribution
# print("\nPrediction distribution on test set:")
# print(pd.Series(y_pred).value_counts())

# # Recommendations
# <<<<<<< HEAD
# # Add predictions and recommendations to dataframe
# print("\n" + "=" * 50)
# print("GENERATING PREDICTIONS")
# print("=" * 50)

# df["Predicted_Success"] = model.predict(X)
# df["Recommendation"] = ["Invest" if pred == 1 else "Avoid" for pred in df["Predicted_Success"]]

# # Showing first 20 campaigns with predictions
# =======
#     # Add predictions and recommendations to dataframe
# df["Predicted_Success"] = model.predict(X)
# df["Recommendation"] = ["Invest" if pred == 1 else "Avoid" for pred in df["Predicted_Success"]]

# # Showing first 10 campaigns with predictions
# >>>>>>> 868b2aa414e10b94ce508c9ffe150317430fda60
# print("\nSample Recommendations:")
# print(df[["Campaign_ID", "Predicted_Success", "Recommendation"]].head(20))

# # Show prediction distribution on full dataset
# print("\nFull dataset prediction distribution:")
# print(df["Predicted_Success"].value_counts())
# <<<<<<< HEAD
# print("\nRecommendation distribution:")
# print(df["Recommendation"].value_counts())

# # Saving Model for Backend Integration
# print("\n" + "=" * 50)
# print("SAVING MODEL")
# print("=" * 50)

# # Create dependencies folder if it doesn't exist
# os.makedirs('dependencies', exist_ok=True)

# model_path = os.path.join('dependencies', 'roi_model.pkl')

# with open(model_path, "wb") as f:
#     pickle.dump(model, f)

# print(f"\n✓ Model saved as {model_path}")
# print("✓ Ready to integrate with website backend!")

# # Save a sample of predictions to CSV for verification
# output_file = "predictions_" + os.path.splitext(os.path.basename(data_file))[0] + ".csv"
# df[["Campaign_ID", "Budget", "Duration", "Predicted_Success", "Recommendation"]].to_csv(output_file, index=False)
# print(f"✓ Predictions saved to {output_file}")

# print("\n" + "=" * 50)
# print("DONE!")
# print("=" * 50)
# =======
# print(df["Recommendation"].value_counts())

# #   Saving Model for Backend Integration
# import pickle
# with open("roi_model.pkl", "wb") as f:
#     pickle.dump(model, f)

# print("\nModel saved as roi_model.pkl. Ready to integrate with website backend.")
# >>>>>>> cfca9b5308dc58eb825b7088b636af14894912aa
# >>>>>>> 868b2aa414e10b94ce508c9ffe150317430fda60
