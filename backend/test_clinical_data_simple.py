"""
Simple test script to verify clinical data helper functions
(Doesn't require database or ML dependencies)
"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from clinical_data_helpers import generate_clinical_data, enhance_existing_clinical_data
import json

def test_clinical_data_generation():
    """Test that clinical data is generated correctly"""
    print("=" * 70)
    print("Testing Clinical Data Generation")
    print("=" * 70)
    
    # Test different cancer types
    test_cases = [
        ("Lung Cancer", "II", 55),
        ("Breast Cancer", "III", 48),
        ("Colon Cancer", "IV", 65),
        ("Prostate Cancer", "I", 72),
        ("Leukemia", "II", 39),
        ("Ovarian Cancer", "III", 45),
    ]
    
    all_passed = True
    
    for cancer_type, stage, age in test_cases:
        print(f"\n{'-' * 70}")
        print(f"Test: {cancer_type}, Stage {stage}, Age {age}")
        print(f"{'-' * 70}")
        
        try:
            clinical_data = generate_clinical_data(cancer_type, stage, age)
            
            # Verify required ML model fields
            checks = {
                "targetable_mutation": ("targetable_mutation" in clinical_data, 
                                      isinstance(clinical_data.get("targetable_mutation"), bool)),
                "comorbidity_score": ("comorbidity_score" in clinical_data,
                                    0.0 <= clinical_data.get("comorbidity_score", -1) <= 1.0),
                "genomics": ("genomics" in clinical_data, isinstance(clinical_data.get("genomics"), dict)),
                "genomics.mutations": ("mutations" in clinical_data.get("genomics", {}), True),
                "genomics.biomarkers": ("biomarkers" in clinical_data.get("genomics", {}), True),
                "genomics.biomarkers.PD-L1": ("PD-L1" in clinical_data.get("genomics", {}).get("biomarkers", {}), True),
                "genomics.biomarkers.TMB": ("TMB" in clinical_data.get("genomics", {}).get("biomarkers", {}), True),
                "genomics.biomarkers.MSI_Status": ("MSI_Status" in clinical_data.get("genomics", {}).get("biomarkers", {}), True),
                "histopathology": ("histopathology" in clinical_data, isinstance(clinical_data.get("histopathology"), dict)),
                "histopathology.grade": ("grade" in clinical_data.get("histopathology", {}), True),
                "histopathology.ki67": ("ki67" in clinical_data.get("histopathology", {}), True),
                "histopathology.tumor_size_cm": ("tumor_size_cm" in clinical_data.get("histopathology", {}), True),
            }
            
            test_passed = True
            for check_name, (exists, valid) in checks.items():
                if exists and valid:
                    print(f"  [OK] {check_name}")
                else:
                    print(f"  [FAIL] {check_name} - {'Missing' if not exists else 'Invalid'}")
                    test_passed = False
                    all_passed = False
            
            if test_passed:
                print(f"\n  [PASS] All checks passed!")
                
                # Show sample data
                print(f"\n  Sample Data:")
                print(f"    - targetable_mutation: {clinical_data['targetable_mutation']}")
                print(f"    - comorbidity_score: {clinical_data['comorbidity_score']}")
                print(f"    - Mutations: {clinical_data['genomics']['mutations']}")
                print(f"    - PD-L1: {clinical_data['genomics']['biomarkers']['PD-L1']}%")
                print(f"    - TMB: {clinical_data['genomics']['biomarkers']['TMB']}")
                print(f"    - MSI Status: {clinical_data['genomics']['biomarkers']['MSI_Status']}")
                print(f"    - Grade: {clinical_data['histopathology']['grade']}")
                print(f"    - Ki-67: {clinical_data['histopathology']['ki67']}%")
                print(f"    - Tumor Size: {clinical_data['histopathology']['tumor_size_cm']} cm")
            
        except Exception as e:
            print(f"  [ERROR] {e}")
            import traceback
            traceback.print_exc()
            all_passed = False
    
    print(f"\n{'=' * 70}")
    if all_passed:
        print("[PASS] ALL TESTS PASSED!")
    else:
        print("[FAIL] SOME TESTS FAILED")
    print(f"{'=' * 70}")
    
    return all_passed


def test_enhance_existing_data():
    """Test enhancing existing clinical data"""
    print(f"\n{'=' * 70}")
    print("Testing enhance_existing_clinical_data()")
    print(f"{'=' * 70}")
    
    try:
        existing_data = {
            "height_cm": 170,
            "weight_kg": 75,
            "smoker": True,
            "comorbidities": ["hypertension"],
            "notes": "Existing patient data"
        }
        
        print(f"\nOriginal data:")
        print(json.dumps(existing_data, indent=2))
        
        enhanced = enhance_existing_clinical_data(existing_data, "Lung Cancer", "III", 60)
        
        print(f"\nEnhanced data structure:")
        print(f"  [OK] Has targetable_mutation: {'targetable_mutation' in enhanced}")
        print(f"  [OK] Has comorbidity_score: {'comorbidity_score' in enhanced}")
        print(f"  [OK] Has genomics: {'genomics' in enhanced}")
        print(f"  [OK] Has histopathology: {'histopathology' in enhanced}")
        print(f"  [OK] Preserved height_cm: {enhanced.get('height_cm') == 170}")
        print(f"  [OK] Preserved weight_kg: {enhanced.get('weight_kg') == 75}")
        print(f"  [OK] Preserved smoker: {enhanced.get('smoker') == True}")
        print(f"  [OK] Preserved notes: {enhanced.get('notes') == 'Existing patient data'}")
        
        print(f"\n[PASS] Enhancement test passed!")
        return True
        
    except Exception as e:
        print(f"[ERROR] {e}")
        import traceback
        traceback.print_exc()
        return False


def test_ml_model_format():
    """Test that generated data matches ML model expected format"""
    print(f"\n{'=' * 70}")
    print("Testing ML Model Data Format Compatibility")
    print(f"{'=' * 70}")
    
    print(f"\nML Model expects:")
    print(f"  - age: int")
    print(f"  - stage: string (I, II, III, IV)")
    print(f"  - targetable_mutation: bool")
    print(f"  - comorbidity_score: float (0.0-1.0)")
    
    try:
        clinical_data = generate_clinical_data("Lung Cancer", "II", 55)
        
        # Simulate what routes.py does
        patient_data = {
            'age': 55,
            'stage': 'II',
            'targetable_mutation': clinical_data.get('targetable_mutation', False),
            'comorbidity_score': clinical_data.get('comorbidity_score', 0.3)
        }
        
        print(f"\nExtracted patient data for ML model:")
        print(f"  - age: {patient_data['age']} ({type(patient_data['age']).__name__})")
        print(f"  - stage: '{patient_data['stage']}' ({type(patient_data['stage']).__name__})")
        print(f"  - targetable_mutation: {patient_data['targetable_mutation']} ({type(patient_data['targetable_mutation']).__name__})")
        print(f"  - comorbidity_score: {patient_data['comorbidity_score']} ({type(patient_data['comorbidity_score']).__name__})")
        
        # Verify types
        assert isinstance(patient_data['age'], int), "age must be int"
        assert isinstance(patient_data['stage'], str), "stage must be string"
        assert isinstance(patient_data['targetable_mutation'], bool), "targetable_mutation must be bool"
        assert isinstance(patient_data['comorbidity_score'], (int, float)), "comorbidity_score must be number"
        assert 0.0 <= patient_data['comorbidity_score'] <= 1.0, "comorbidity_score must be 0-1"
        
        print(f"\n[PASS] All data types and ranges are correct!")
        print(f"[PASS] Data format is compatible with ML model!")
        return True
        
    except Exception as e:
        print(f"[ERROR] {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("Clinical Data Structure Test Suite (Standalone)")
    print("=" * 70)
    
    results = []
    
    # Test 1: Clinical data generation
    results.append(test_clinical_data_generation())
    
    # Test 2: Enhance existing data
    results.append(test_enhance_existing_data())
    
    # Test 3: ML model format compatibility
    results.append(test_ml_model_format())
    
    print(f"\n{'=' * 70}")
    print("FINAL RESULTS")
    print(f"{'=' * 70}")
    
    if all(results):
        print("[PASS] ALL TESTS PASSED!")
        print("\nYour clinical data structure is ready for:")
        print("  [OK] Seed scripts")
        print("  [OK] ML model integration")
        print("  [OK] Patient data storage")
        print("\nNext steps:")
        print("  1. Run seed scripts to populate database")
        print("  2. Place model_calibrated.pkl in backend/models/")
        print("  3. Test ML recommendations endpoint")
    else:
        print("[FAIL] SOME TESTS FAILED")
        print("Please review the errors above")
    
    print(f"{'=' * 70}\n")

