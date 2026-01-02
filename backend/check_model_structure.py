"""
Script to check if a model file has the correct structure
Usage: python check_model_structure.py [path_to_model.pkl]
"""

import sys
import os
import joblib
import pandas as pd

def check_model_structure(model_path):
    """Check if the model file has the correct structure"""
    
    if not os.path.exists(model_path):
        print(f"❌ ERROR: File not found: {model_path}")
        return False
    
    try:
        print(f"📦 Loading model from: {model_path}")
        model = joblib.load(model_path)
        print(f"✅ Model loaded successfully!")
        print(f"   Type: {type(model).__name__}")
        
        # Check 1: Should be CalibratedClassifierCV (or similar)
        if not hasattr(model, 'estimator'):
            print(f"❌ ERROR: Model doesn't have 'estimator' attribute")
            print(f"   This suggests it's not a CalibratedClassifierCV")
            return False
        
        print(f"✅ Model has 'estimator' attribute")
        
        # Check 2: Estimator should be a Pipeline
        pipeline = model.estimator
        print(f"   Estimator type: {type(pipeline).__name__}")
        
        if not hasattr(pipeline, 'named_steps'):
            print(f"❌ ERROR: Estimator doesn't have 'named_steps'")
            print(f"   Expected a Pipeline with named steps")
            return False
        
        # Check 3: Pipeline should have 'preprocessor' and 'model' steps
        steps = list(pipeline.named_steps.keys())
        print(f"✅ Pipeline steps found: {steps}")
        
        required_steps = ['preprocessor', 'model']
        missing_steps = [step for step in required_steps if step not in steps]
        
        if missing_steps:
            print(f"❌ ERROR: Missing required steps: {missing_steps}")
            print(f"   Required: {required_steps}")
            return False
        
        print(f"✅ All required steps present: {required_steps}")
        
        # Check 4: Preprocessor should have transform method
        preprocessor = pipeline.named_steps['preprocessor']
        if not hasattr(preprocessor, 'transform'):
            print(f"❌ ERROR: Preprocessor doesn't have 'transform' method")
            return False
        print(f"✅ Preprocessor has 'transform' method")
        
        if not hasattr(preprocessor, 'get_feature_names_out'):
            print(f"⚠️  WARNING: Preprocessor doesn't have 'get_feature_names_out' method")
            print(f"   SHAP explanations may not work properly")
        else:
            print(f"✅ Preprocessor has 'get_feature_names_out' method")
        
        # Check 5: Model should be tree-based (for SHAP)
        ml_model = pipeline.named_steps['model']
        print(f"✅ Model type: {type(ml_model).__name__}")
        
        # Check 6: Test prediction
        print(f"\n🧪 Testing prediction...")
        test_data = pd.DataFrame([{
            'age': 50,
            'cancer_stage': 'II',
            'targetable_mutation': 1,
            'comorbidity_score': 0.3,
            'treatment_type': 'chemo'
        }])
        
        try:
            proba = model.predict_proba(test_data)
            print(f"✅ Prediction successful!")
            print(f"   Output shape: {proba.shape}")
            print(f"   Probabilities: {proba[0]}")
            
            if len(proba[0]) >= 2:
                print(f"   Response probability: {proba[0][1]:.3f}")
            
        except Exception as e:
            print(f"❌ ERROR: Prediction failed: {e}")
            return False
        
        print(f"\n{'='*60}")
        print(f"✅ MODEL STRUCTURE VALID!")
        print(f"{'='*60}")
        print(f"\nThis model file should work with OncoAIMLAdapter")
        print(f"Place it in: backend/models/model_calibrated.pkl")
        
        return True
        
    except Exception as e:
        print(f"❌ ERROR loading or checking model: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == '__main__':
    # Default path
    default_path = os.path.join(os.path.dirname(__file__), 'models', 'model_calibrated.pkl')
    
    # Get path from command line or use default
    if len(sys.argv) > 1:
        model_path = sys.argv[1]
    else:
        model_path = default_path
    
    print("="*60)
    print("Model Structure Checker")
    print("="*60)
    print()
    
    check_model_structure(model_path)




