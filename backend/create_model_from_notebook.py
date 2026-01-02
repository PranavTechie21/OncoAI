"""
Script to create model_calibrated.pkl from the training dataset
This replicates the training process from the notebook
"""

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report, roc_auc_score
import os

def create_model(dataset_path="synthetic_cancer_treatment_dataset.csv"):
    """Create and save the calibrated model"""
    
    print("="*60)
    print("Creating Calibrated ML Model")
    print("="*60)
    
    # 1. Load data
    print(f"\n1. Loading dataset from: {dataset_path}")
    if not os.path.exists(dataset_path):
        # Try in parent directory
        dataset_path = os.path.join("..", dataset_path)
        if not os.path.exists(dataset_path):
            print(f"ERROR: Dataset file not found: {dataset_path}")
            return False
    
    df = pd.read_csv(dataset_path)
    print(f"   Dataset shape: {df.shape}")
    print(f"   Columns: {list(df.columns)}")
    
    # 2. Prepare features
    print("\n2. Preparing features...")
    X = df.drop(columns=["treatment_response"])
    y = df["treatment_response"]
    
    print(f"   Features: {list(X.columns)}")
    print(f"   Target distribution: {y.value_counts().to_dict()}")
    
    # 3. Split data
    print("\n3. Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )
    print(f"   Train: {X_train.shape}, Test: {X_test.shape}")
    
    # 4. Create preprocessing pipeline
    print("\n4. Creating preprocessing pipeline...")
    
    # Identify numeric and categorical columns
    numeric_features = ['age', 'cancer_stage', 'targetable_mutation', 'comorbidity_score']
    categorical_features = ['treatment_type']
    
    # Create preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(drop='first', sparse_output=False), categorical_features)
        ],
        remainder='passthrough'
    )
    
    # 5. Create base pipeline
    print("\n5. Creating model pipeline...")
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('model', RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        ))
    ])
    
    # 6. Train base model
    print("\n6. Training base model...")
    pipeline.fit(X_train, y_train)
    
    # Evaluate base model
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]
    base_auc = roc_auc_score(y_test, y_prob)
    print(f"   Base model AUC: {base_auc:.4f}")
    
    # 7. Calibrate model
    print("\n7. Calibrating model...")
    calibrated_model = CalibratedClassifierCV(
        estimator=pipeline,
        method='isotonic',
        cv=3
    )
    
    calibrated_model.fit(X_train, y_train)
    
    # Evaluate calibrated model
    y_prob_cal = calibrated_model.predict_proba(X_test)[:, 1]
    cal_auc = roc_auc_score(y_test, y_prob_cal)
    print(f"   Calibrated model AUC: {cal_auc:.4f}")
    
    # 8. Save model
    print("\n8. Saving model...")
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "model_calibrated.pkl")
    joblib.dump(calibrated_model, model_path)
    print(f"   Model saved to: {model_path}")
    
    # 9. Test the saved model
    print("\n9. Testing saved model...")
    test_model = joblib.load(model_path)
    test_data = pd.DataFrame([{
        'age': 55,
        'cancer_stage': 3,
        'targetable_mutation': 1,
        'comorbidity_score': 0.3,
        'treatment_type': 'targeted'
    }])
    
    test_prob = test_model.predict_proba(test_data)[0][1]
    print(f"   Test prediction: {test_prob:.3f}")
    
    print("\n" + "="*60)
    print("SUCCESS: Model created successfully!")
    print("="*60)
    
    return True

if __name__ == '__main__':
    import sys
    
    dataset_path = sys.argv[1] if len(sys.argv) > 1 else "synthetic_cancer_treatment_dataset.csv"
    create_model(dataset_path)

