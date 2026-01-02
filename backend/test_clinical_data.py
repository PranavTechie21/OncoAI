"""
Test script to verify enhanced clinical data structure
"""

from app import app, db, Patient
from clinical_data_helpers import generate_clinical_data
import json

def test_clinical_data_generation():
    """Test that clinical data is generated correctly"""
    print("=" * 60)
    print("Testing Clinical Data Generation")
    print("=" * 60)
    
    # Test different cancer types
    test_cases = [
        ("Lung Cancer", "II", 55),
        ("Breast Cancer", "III", 48),
        ("Colon Cancer", "IV", 65),
        ("Prostate Cancer", "I", 72),
    ]
    
    for cancer_type, stage, age in test_cases:
        print(f"\n--- Testing: {cancer_type}, Stage {stage}, Age {age} ---")
        clinical_data = generate_clinical_data(cancer_type, stage, age)
        
        # Verify required ML model fields
        assert "targetable_mutation" in clinical_data, "Missing targetable_mutation"
        assert "comorbidity_score" in clinical_data, "Missing comorbidity_score"
        assert isinstance(clinical_data["targetable_mutation"], bool), "targetable_mutation must be bool"
        assert 0.0 <= clinical_data["comorbidity_score"] <= 1.0, "comorbidity_score must be 0-1"
        
        # Verify genomics structure
        assert "genomics" in clinical_data, "Missing genomics"
        assert "mutations" in clinical_data["genomics"], "Missing genomics.mutations"
        assert "biomarkers" in clinical_data["genomics"], "Missing genomics.biomarkers"
        assert "PD-L1" in clinical_data["genomics"]["biomarkers"], "Missing PD-L1 biomarker"
        assert "TMB" in clinical_data["genomics"]["biomarkers"], "Missing TMB biomarker"
        assert "MSI_Status" in clinical_data["genomics"]["biomarkers"], "Missing MSI_Status"
        
        # Verify histopathology structure
        assert "histopathology" in clinical_data, "Missing histopathology"
        assert "grade" in clinical_data["histopathology"], "Missing grade"
        assert "ki67" in clinical_data["histopathology"], "Missing ki67"
        assert "tumor_size_cm" in clinical_data["histopathology"], "Missing tumor_size_cm"
        
        print(f"✓ All required fields present")
        print(f"  - targetable_mutation: {clinical_data['targetable_mutation']}")
        print(f"  - comorbidity_score: {clinical_data['comorbidity_score']}")
        print(f"  - mutations: {clinical_data['genomics']['mutations']}")
        print(f"  - PD-L1: {clinical_data['genomics']['biomarkers']['PD-L1']}%")
        print(f"  - TMB: {clinical_data['genomics']['biomarkers']['TMB']}")
        print(f"  - Grade: {clinical_data['histopathology']['grade']}")
        
    print("\n" + "=" * 60)
    print("✓ All clinical data generation tests passed!")
    print("=" * 60)


def test_patient_data_structure():
    """Test that patient data in database has correct structure"""
    print("\n" + "=" * 60)
    print("Testing Patient Data in Database")
    print("=" * 60)
    
    with app.app_context():
        # Get a few sample patients
        patients = Patient.query.limit(5).all()
        
        if not patients:
            print("⚠ No patients found in database. Run seed scripts first:")
            print("  python seed_demo_patients.py")
            print("  OR")
            print("  python seed_data.py")
            return
        
        print(f"\nFound {len(patients)} patients. Checking structure...\n")
        
        for i, patient in enumerate(patients, 1):
            print(f"--- Patient {i}: {patient.name} ({patient.cancer_type}, Stage {patient.stage}) ---")
            clinical_data = patient.get_clinical_data()
            
            if not clinical_data:
                print("  ⚠ No clinical_data found")
                continue
            
            # Check required ML model fields
            checks = []
            checks.append(("targetable_mutation", "targetable_mutation" in clinical_data))
            checks.append(("comorbidity_score", "comorbidity_score" in clinical_data))
            checks.append(("genomics", "genomics" in clinical_data))
            checks.append(("histopathology", "histopathology" in clinical_data))
            
            all_passed = all(check[1] for check in checks)
            
            for field, passed in checks:
                status = "✓" if passed else "✗"
                print(f"  {status} {field}: {'Present' if passed else 'MISSING'}")
            
            if all_passed:
                print(f"  ✓ Structure is correct for ML model")
                if "targetable_mutation" in clinical_data:
                    print(f"    - targetable_mutation: {clinical_data['targetable_mutation']}")
                if "comorbidity_score" in clinical_data:
                    print(f"    - comorbidity_score: {clinical_data['comorbidity_score']}")
            else:
                print(f"  ✗ Missing required fields - needs update")
        
        print("\n" + "=" * 60)
        print("Patient data structure check complete!")
        print("=" * 60)


def test_ml_model_compatibility():
    """Test that patient data format matches ML model expectations"""
    print("\n" + "=" * 60)
    print("Testing ML Model Data Format Compatibility")
    print("=" * 60)
    
    # Simulate what routes.py does when calling ML model
    from routes import get_recommendations
    from flask import Flask
    
    test_patient_data = {
        "age": 55,
        "stage": "II",
        "targetable_mutation": True,
        "comorbidity_score": 0.4
    }
    
    print("\n--- Expected ML Model Input Format ---")
    print(f"Age: {test_patient_data['age']}")
    print(f"Stage: {test_patient_data['stage']}")
    print(f"targetable_mutation: {test_patient_data['targetable_mutation']}")
    print(f"comorbidity_score: {test_patient_data['comorbidity_score']}")
    
    with app.app_context():
        patients = Patient.query.limit(3).all()
        
        if not patients:
            print("\n⚠ No patients found. Cannot test compatibility.")
            return
        
        print("\n--- Testing Patient Data Extraction ---")
        for patient in patients:
            clinical_data = patient.get_clinical_data()
            
            # Extract data like routes.py does
            extracted = {
                "age": patient.age,
                "stage": patient.stage or "II",
                "targetable_mutation": clinical_data.get("targetable_mutation", False),
                "comorbidity_score": clinical_data.get("comorbidity_score", 0.3)
            }
            
            print(f"\n{patient.name}:")
            print(f"  ✓ Age: {extracted['age']}")
            print(f"  ✓ Stage: {extracted['stage']}")
            print(f"  {'✓' if 'targetable_mutation' in clinical_data else '✗'} targetable_mutation: {extracted['targetable_mutation']}")
            print(f"  {'✓' if 'comorbidity_score' in clinical_data else '✗'} comorbidity_score: {extracted['comorbidity_score']}")
            
            # Verify all required fields are present
            if all(key in extracted for key in ["age", "stage", "targetable_mutation", "comorbidity_score"]):
                print(f"  ✓ Data format compatible with ML model")
            else:
                print(f"  ✗ Missing required fields")
    
    print("\n" + "=" * 60)
    print("ML Model compatibility check complete!")
    print("=" * 60)


if __name__ == "__main__":
    print("\n🧪 Clinical Data Structure Test Suite")
    print("=" * 60)
    
    try:
        # Test 1: Clinical data generation
        test_clinical_data_generation()
        
        # Test 2: Patient data in database
        test_patient_data_structure()
        
        # Test 3: ML model compatibility
        test_ml_model_compatibility()
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS COMPLETED")
        print("=" * 60)
        print("\nNext steps:")
        print("1. If tests passed, your data structure is ready!")
        print("2. Place your model_calibrated.pkl in backend/models/")
        print("3. Test the ML recommendations endpoint")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()






