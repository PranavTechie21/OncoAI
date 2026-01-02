"""
Test script to get AI recommendations for a patient
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import app, db
from routes import User, Patient
import requests
import json

def test_recommendations():
    """Test getting recommendations for a patient"""
    
    with app.app_context():
        # Get or create a demo doctor
        doctor = User.query.filter_by(email='doctor@demo.com').first()
        if not doctor:
            print("No demo doctor found. Creating one...")
            from werkzeug.security import generate_password_hash
            doctor = User(
                email='doctor@demo.com',
                name='Demo Doctor',
                role='doctor',
                specialty='Oncology'
            )
            doctor.set_password('demo123')
            db.session.add(doctor)
            db.session.commit()
        
        # Get the first patient
        patient = Patient.query.filter_by(doctor_id=doctor.id).first()
        if not patient:
            print("No patients found. Creating a test patient...")
            from datetime import datetime
            from clinical_data_helpers import generate_clinical_data
            
            clinical_data = generate_clinical_data("Lung Cancer", "III", 55)
            patient = Patient(
                name="Test Patient",
                age=55,
                gender="M",
                email="test@example.com",
                cancer_type="Lung Cancer",
                stage="III",
                doctor_id=doctor.id,
                diagnosis_date=datetime.now().date()
            )
            patient.set_clinical_data(clinical_data)
            db.session.add(patient)
            db.session.commit()
        
        print(f"\n{'='*60}")
        print(f"Testing ML Recommendations for Patient: {patient.name}")
        print(f"{'='*60}")
        print(f"Patient ID: {patient.id}")
        print(f"Age: {patient.age}")
        print(f"Stage: {patient.stage}")
        print(f"Cancer Type: {patient.cancer_type}")
        
        clinical_data = patient.get_clinical_data()
        print(f"Targetable Mutation: {clinical_data.get('targetable_mutation', False)}")
        print(f"Comorbidity Score: {clinical_data.get('comorbidity_score', 0.3)}")
        
        # Login to get token
        print(f"\n{'='*60}")
        print("Logging in...")
        print(f"{'='*60}")
        
        login_response = requests.post(
            'http://localhost:5000/api/auth/login',
            json={'email': 'doctor@demo.com', 'password': 'demo123'},
            headers={'Content-Type': 'application/json'}
        )
        
        if login_response.status_code != 200:
            print(f"Login failed: {login_response.status_code}")
            print(login_response.text)
            return
        
        token = login_response.json().get('token')
        if not token:
            print("No token received")
            return
        
        print("Login successful!")
        
        # Get recommendations
        print(f"\n{'='*60}")
        print("Getting AI Recommendations...")
        print(f"{'='*60}")
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        rec_response = requests.get(
            f'http://localhost:5000/api/recommendations/patient/{patient.id}',
            headers=headers
        )
        
        if rec_response.status_code != 200:
            print(f"Error getting recommendations: {rec_response.status_code}")
            print(rec_response.text)
            return
        
        recommendations = rec_response.json()
        
        print(f"\n{'='*60}")
        print("RECOMMENDATIONS RECEIVED!")
        print(f"{'='*60}")
        print(json.dumps(recommendations, indent=2))
        
        # Print summary
        if 'recommendations' in recommendations and 'treatments' in recommendations['recommendations']:
            treatments = recommendations['recommendations']['treatments']
            print(f"\n{'='*60}")
            print("TREATMENT RECOMMENDATIONS SUMMARY")
            print(f"{'='*60}")
            for i, treatment in enumerate(treatments, 1):
                print(f"\n{i}. {treatment['treatment'].upper()}")
                print(f"   Response Probability: {treatment['response_probability']:.1%}")
                print(f"   Predicted Response: {'Yes' if treatment['predicted_response'] else 'No'}")
                if 'outcomes' in treatment:
                    outcomes = treatment['outcomes']
                    print(f"   Survival (1yr): {outcomes.get('survival_1yr', 0):.1%}")
                    print(f"   Response Rate: {outcomes.get('response_rate', 0):.1%}")
        
        print(f"\n{'='*60}")
        print("TEST COMPLETE!")
        print(f"{'='*60}")

if __name__ == '__main__':
    try:
        test_recommendations()
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
