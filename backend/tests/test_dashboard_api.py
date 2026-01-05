"""
Test the dashboard API endpoint directly
"""
import requests
import json

BASE_URL = "http://localhost:5000"

print("="*60)
print("Testing Dashboard API Endpoint")
print("="*60)

try:
    # Test without auth (should use demo user)
    response = requests.get(f"{BASE_URL}/api/dashboard/summary", timeout=5)
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\nResponse Data:")
        print(json.dumps(data, indent=2))
        
        print("\n" + "="*60)
        print("Extracted Values:")
        print("="*60)
        print(f"Total Patients: {data.get('total_patients', 'N/A')}")
        print(f"Active Treatments: {data.get('active_treatments', 'N/A')}")
        print(f"High Risk Patients: {data.get('high_risk_patients', 'N/A')}")
        print(f"AI Recommendations: {data.get('ai_recommendations', 'N/A')}")
    else:
        print(f"Error: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("\n[ERROR] Cannot connect to backend!")
    print("Make sure the Flask backend is running:")
    print("  cd backend")
    print("  python app.py")
except Exception as e:
    print(f"\n[ERROR] {e}")












