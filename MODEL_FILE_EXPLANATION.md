# What is model_calibrated.pkl?

## 📦 File Type

**`.pkl`** = Python Pickle file - a serialized Python object saved using `joblib` or `pickle` library

## 🔍 What's Inside

Based on your code in `ml_service.py`, the `model_calibrated.pkl` file contains:

### Structure:

```
model_calibrated.pkl
└── CalibratedClassifierCV (sklearn wrapper)
    └── estimator (Pipeline)
        ├── step 1: "preprocessor" 
        │   └── (Some preprocessing transformer - handles categorical/numerical features)
        └── step 2: "model"
            └── (Tree-based classifier - RandomForest, GradientBoosting, etc.)
```

### Detailed Breakdown:

1. **CalibratedClassifierCV** (outer wrapper)
   - This is a sklearn model wrapper that calibrates probability predictions
   - Makes predictions more reliable and accurate
   - Has methods: `.predict()`, `.predict_proba()`

2. **Pipeline** (inside `.estimator`)
   - A sequence of data transformations + model
   - Must have exactly 2 named steps:
     - `"preprocessor"` - prepares/transforms input data
     - `"model"` - the actual ML model (RandomForest, etc.)

3. **Preprocessor** (step 1)
   - Handles feature encoding/transformation
   - Processes features like: age, cancer_stage, targetable_mutation, comorbidity_score, treatment_type
   - Must have: `.transform()` and `.get_feature_names_out()` methods

4. **Model** (step 2) 
   - Tree-based classifier (RandomForest, GradientBoosting, etc.)
   - Used for SHAP explanations (TreeExplainer requires tree models)
   - Makes the actual predictions

## 📊 Expected Input Features

The model expects these 5 features (in this exact format):
________________________________________________________________________________________________________________
|     Feature           |    Type       |                     Example Values                                   |
|-----------------------|---------------|----------------------------------------------------------------------|
| `age`                 | numeric       |   45, 67, 32                                                         |
| `cancer_stage`        | string        | "I", "II", "III", "IV"                                               |
| `targetable_mutation` | integer (0/1) | 0, 1                                                                 |
| `comorbidity_score`   | float (0-1.0) | 0.3, 0.7, 0.5                                                        |
| `treatment_type`      | string        | "chemo", "targeted", "immuno", "radiation", "surgery", "combination" |
________________________________________________________________________________________________________________

## 🎯 What the Model Does

When you call the model:
1. **Input**: Patient data + treatment type → DataFrame with 5 features
2. **Preprocessing**: Pipeline's preprocessor transforms the data
3. **Prediction**: Model predicts probability of treatment response (0.0 to 1.0)
4. **Output**: Response probability for that treatment

## 💻 How It Was Created (Typical Process)

```python
from sklearn.calibration import CalibratedClassifierCV
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. Create pipeline
pipeline = Pipeline([
    ('preprocessor', preprocessor),  # Your preprocessing steps
    ('model', RandomForestClassifier())  # Your model
])

# 2. Train the pipeline
pipeline.fit(X_train, y_train)

# 3. Calibrate it
calibrated_model = CalibratedClassifierCV(pipeline, method='isotonic', cv=5)
calibrated_model.fit(X_train, y_train)

# 4. Save it
joblib.dump(calibrated_model, 'model_calibrated.pkl')
```

## ✅ How to Verify Your Model File

You can check if your model file has the right structure:

```python
import joblib

# Load the model
model = joblib.load('backend/models/model_calibrated.pkl')

# Check it has the right structure
print(type(model))  # Should be CalibratedClassifierCV
print(hasattr(model, 'estimator'))  # Should be True
print(type(model.estimator))  # Should be Pipeline

# Check pipeline steps
print(model.estimator.named_steps.keys())  # Should have 'preprocessor' and 'model'

# Test prediction
import pandas as pd
test_data = pd.DataFrame([{
    'age': 50,
    'cancer_stage': 'II',
    'targetable_mutation': 1,
    'comorbidity_score': 0.3,
    'treatment_type': 'chemo'
}])
proba = model.predict_proba(test_data)
print(f"Prediction works! Probability: {proba}")
```

## ❓ Do I Have This File?

- **If YES**: Place it in `backend/models/model_calibrated.pkl`
- **If NO**: You need to train the model first (or use the training data you have)

