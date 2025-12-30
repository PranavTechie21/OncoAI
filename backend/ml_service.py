import numpy as np
import pickle
import os
from typing import Dict, List, Optional
import json

class MLService:
    """
    ML Service for cancer treatment recommendations and risk assessment
    This is a placeholder structure - replace with your actual ML models
    """
    
    def __init__(self):
        self.models_loaded = False
        self.risk_model = None
        self.treatment_model = None
        self.models_path = os.path.join(os.path.dirname(__file__), 'models')
        self._load_models()
    
    def _load_models(self):
        """Load ML models from disk"""
        try:
            # Try to load pre-trained models
            risk_model_path = os.path.join(self.models_path, 'risk_model.pkl')
            treatment_model_path = os.path.join(self.models_path, 'treatment_model.pkl')
            
            if os.path.exists(risk_model_path):
                with open(risk_model_path, 'rb') as f:
                    self.risk_model = pickle.load(f)
            
            if os.path.exists(treatment_model_path):
                with open(treatment_model_path, 'rb') as f:
                    self.treatment_model = pickle.load(f)
            
            self.models_loaded = True
        except Exception as e:
            print(f"Warning: Could not load ML models: {e}")
            print("Using placeholder models for demonstration")
            self.models_loaded = False
    
    def is_available(self) -> bool:
        """Check if ML service is available"""
        return True  # Always available, uses placeholder if models not loaded
    
    def calculate_risk_score(self, patient_data: Dict) -> float:
        """
        Calculate patient risk score based on clinical data
        
        Args:
            patient_data: Dictionary containing patient clinical information
            
        Returns:
            Risk score (0-100)
        """
        if self.risk_model:
            # Use actual ML model
            features = self._extract_features(patient_data)
            risk_score = self.risk_model.predict([features])[0]
            return float(np.clip(risk_score, 0, 100))
        else:
            # Placeholder risk calculation based on clinical factors
            risk_score = 50.0  # Base risk
            
            # Age factor
            age = patient_data.get('age', 50)
            if age > 65:
                risk_score += 10
            elif age < 40:
                risk_score -= 5
            
            # Stage factor
            stage = patient_data.get('stage', '').lower()
            if 'iv' in stage or '4' in stage:
                risk_score += 25
            elif 'iii' in stage or '3' in stage:
                risk_score += 15
            elif 'ii' in stage or '2' in stage:
                risk_score += 8
            
            # Cancer type factor
            cancer_type = patient_data.get('cancer_type', '').lower()
            aggressive_types = ['pancreatic', 'lung', 'liver', 'brain']
            if any(atype in cancer_type for atype in aggressive_types):
                risk_score += 15
            
            # Clinical markers
            clinical_data = patient_data.get('clinical_data', {})
            if clinical_data.get('high_grade', False):
                risk_score += 10
            if clinical_data.get('metastasis', False):
                risk_score += 20
            
            return float(np.clip(risk_score, 0, 100))
    
    def generate_treatment_recommendations(self, patient_data: Dict) -> Dict:
        """
        Generate AI-powered treatment recommendations
        
        Args:
            patient_data: Dictionary containing patient information
            
        Returns:
            Dictionary with treatment recommendations
        """
        risk_score = self.calculate_risk_score(patient_data)
        
        if self.treatment_model:
            # Use actual ML model
            features = self._extract_features(patient_data)
            recommendations = self.treatment_model.predict([features])
            return self._format_recommendations(recommendations[0], patient_data)
        else:
            # Placeholder recommendations based on risk score and patient data
            recommendations = {
                'risk_score': risk_score,
                'risk_level': 'low' if risk_score <= 50 else 'medium' if risk_score <= 75 else 'high',
                'recommended_treatments': self._get_treatment_options(patient_data, risk_score),
                'treatment_protocol': self._generate_protocol(patient_data, risk_score),
                'monitoring_schedule': self._get_monitoring_schedule(risk_score),
                'expected_outcomes': self._predict_outcomes(risk_score),
                'confidence': 0.85  # Placeholder confidence score
            }
            return recommendations
    
    def _extract_features(self, patient_data: Dict) -> List[float]:
        """Extract features for ML model"""
        # Convert patient data to feature vector
        features = [
            patient_data.get('age', 50) / 100.0,
            1.0 if patient_data.get('gender', '').lower() == 'male' else 0.0,
            len(patient_data.get('cancer_type', '')),
            patient_data.get('risk_score', 50) / 100.0,
        ]
        return features
    
    def _get_treatment_options(self, patient_data: Dict, risk_score: float) -> List[Dict]:
        """Get treatment options based on patient data and risk score"""
        cancer_type = patient_data.get('cancer_type', '').lower()
        stage = patient_data.get('stage', '').lower()
        clinical_data = patient_data.get('clinical_data', {})
        
        treatments = []
        
        # Enhanced treatment recommendations based on cancer type and genomic markers
        if 'lung' in cancer_type:
            if risk_score <= 50:
                treatments = [
                    {
                        'name': 'Surgical Resection',
                        'priority': 'high',
                        'description': 'Lobectomy or pneumonectomy recommended for early-stage disease',
                        'success_rate': 0.75,
                        'side_effects': ['Pain', 'Infection risk', 'Reduced lung function'],
                        'duration': 'Single procedure',
                        'cost_estimate': 'High'
                    },
                    {
                        'name': 'Adjuvant Chemotherapy',
                        'priority': 'medium',
                        'description': 'Post-surgical chemotherapy to reduce recurrence risk',
                        'success_rate': 0.65,
                        'side_effects': ['Nausea', 'Fatigue', 'Hair loss'],
                        'duration': '4-6 cycles',
                        'cost_estimate': 'Medium'
                    }
                ]
            elif risk_score <= 75:
                treatments = [
                    {
                        'name': 'Immunotherapy (PD-L1 inhibitors)',
                        'priority': 'high',
                        'description': 'Checkpoint inhibitors like Pembrolizumab or Atezolizumab',
                        'success_rate': 0.70,
                        'side_effects': ['Immune-related adverse events', 'Fatigue', 'Rash'],
                        'duration': 'Until progression or 2 years',
                        'cost_estimate': 'Very High'
                    },
                    {
                        'name': 'Combination Chemotherapy',
                        'priority': 'high',
                        'description': 'Platinum-based doublet chemotherapy (Carboplatin/Pemetrexed)',
                        'success_rate': 0.60,
                        'side_effects': ['Nausea', 'Fatigue', 'Neuropathy', 'Bone marrow suppression'],
                        'duration': '4-6 cycles',
                        'cost_estimate': 'Medium'
                    },
                    {
                        'name': 'Targeted Therapy',
                        'priority': 'medium',
                        'description': 'EGFR/ALK inhibitors if mutations present',
                        'success_rate': 0.75,
                        'side_effects': ['Rash', 'Diarrhea', 'Liver toxicity'],
                        'duration': 'Until progression',
                        'cost_estimate': 'High'
                    }
                ]
            else:
                treatments = [
                    {
                        'name': 'Aggressive Immunotherapy',
                        'priority': 'high',
                        'description': 'Combination immunotherapy (PD-1 + CTLA-4 inhibitors)',
                        'success_rate': 0.55,
                        'side_effects': ['Severe immune reactions', 'Colitis', 'Pneumonitis'],
                        'duration': 'Until progression',
                        'cost_estimate': 'Very High'
                    },
                    {
                        'name': 'Multi-drug Chemotherapy',
                        'priority': 'high',
                        'description': 'Triple-drug regimen for advanced disease',
                        'success_rate': 0.45,
                        'side_effects': ['Severe fatigue', 'Infection risk', 'Organ toxicity'],
                        'duration': '6-8 cycles',
                        'cost_estimate': 'High'
                    },
                    {
                        'name': 'Clinical Trial Enrollment',
                        'priority': 'medium',
                        'description': 'Consider experimental therapies or combination treatments',
                        'success_rate': 0.40,
                        'side_effects': 'Variable',
                        'duration': 'Variable',
                        'cost_estimate': 'Covered by trial'
                    }
                ]
        elif 'breast' in cancer_type:
            if risk_score <= 50:
                treatments = [
                    {
                        'name': 'Lumpectomy + Radiation',
                        'priority': 'high',
                        'description': 'Breast-conserving surgery with adjuvant radiation',
                        'success_rate': 0.85,
                        'side_effects': ['Pain', 'Swelling', 'Skin changes'],
                        'duration': '6-8 weeks',
                        'cost_estimate': 'Medium'
                    },
                    {
                        'name': 'Hormone Therapy',
                        'priority': 'high',
                        'description': 'Tamoxifen or Aromatase inhibitors for hormone-positive tumors',
                        'success_rate': 0.80,
                        'side_effects': ['Hot flashes', 'Joint pain', 'Bone density loss'],
                        'duration': '5-10 years',
                        'cost_estimate': 'Low-Medium'
                    }
                ]
            elif risk_score <= 75:
                treatments = [
                    {
                        'name': 'Neoadjuvant Chemotherapy',
                        'priority': 'high',
                        'description': 'AC-T or TAC regimen before surgery',
                        'success_rate': 0.70,
                        'side_effects': ['Nausea', 'Fatigue', 'Hair loss', 'Neuropathy'],
                        'duration': '4-6 cycles',
                        'cost_estimate': 'Medium'
                    },
                    {
                        'name': 'Targeted Therapy (HER2+)',
                        'priority': 'high',
                        'description': 'Trastuzumab + Pertuzumab for HER2-positive disease',
                        'success_rate': 0.75,
                        'side_effects': ['Cardiac toxicity', 'Infusion reactions'],
                        'duration': '1 year',
                        'cost_estimate': 'Very High'
                    },
                    {
                        'name': 'Mastectomy',
                        'priority': 'medium',
                        'description': 'Complete breast removal if indicated',
                        'success_rate': 0.65,
                        'side_effects': ['Lymphedema', 'Body image issues'],
                        'duration': 'Single procedure',
                        'cost_estimate': 'High'
                    }
                ]
            else:
                treatments = [
                    {
                        'name': 'Aggressive Chemotherapy',
                        'priority': 'high',
                        'description': 'Triple-negative or advanced disease protocol',
                        'success_rate': 0.50,
                        'side_effects': ['Severe fatigue', 'Infection risk', 'Organ damage'],
                        'duration': '6-8 cycles',
                        'cost_estimate': 'High'
                    },
                    {
                        'name': 'Immunotherapy',
                        'priority': 'high',
                        'description': 'Pembrolizumab for PD-L1 positive triple-negative breast cancer',
                        'success_rate': 0.55,
                        'side_effects': ['Immune reactions', 'Fatigue'],
                        'duration': 'Until progression',
                        'cost_estimate': 'Very High'
                    }
                ]
        else:
            # Generic treatment recommendations for other cancer types
            if risk_score <= 50:
                treatments = [
                    {
                        'name': 'Surgery',
                        'priority': 'high',
                        'description': 'Surgical resection recommended',
                        'success_rate': 0.85,
                        'side_effects': ['Pain', 'Infection risk'],
                        'duration': 'Single procedure',
                        'cost_estimate': 'High'
                    },
                    {
                        'name': 'Radiation Therapy',
                        'priority': 'medium',
                        'description': 'Adjuvant radiation therapy',
                        'success_rate': 0.75,
                        'side_effects': ['Skin irritation', 'Fatigue'],
                        'duration': '4-6 weeks',
                        'cost_estimate': 'Medium'
                    }
                ]
            elif risk_score <= 75:
                treatments = [
                    {
                        'name': 'Chemotherapy',
                        'priority': 'high',
                        'description': 'Systemic chemotherapy regimen',
                        'success_rate': 0.70,
                        'side_effects': ['Nausea', 'Fatigue', 'Hair loss'],
                        'duration': '4-6 cycles',
                        'cost_estimate': 'Medium'
                    },
                    {
                        'name': 'Targeted Therapy',
                        'priority': 'high',
                        'description': 'Molecular targeted treatment',
                        'success_rate': 0.65,
                        'side_effects': ['Rash', 'Diarrhea'],
                        'duration': 'Until progression',
                        'cost_estimate': 'High'
                    }
                ]
            else:
                treatments = [
                    {
                        'name': 'Immunotherapy',
                        'priority': 'high',
                        'description': 'Immune checkpoint inhibitors',
                        'success_rate': 0.55,
                        'side_effects': ['Immune reactions', 'Fatigue'],
                        'duration': 'Until progression',
                        'cost_estimate': 'Very High'
                    },
                    {
                        'name': 'Combination Chemotherapy',
                        'priority': 'high',
                        'description': 'Multi-drug chemotherapy protocol',
                        'success_rate': 0.50,
                        'side_effects': ['Severe fatigue', 'Infection risk'],
                        'duration': '6-8 cycles',
                        'cost_estimate': 'High'
                    },
                    {
                        'name': 'Clinical Trial',
                        'priority': 'medium',
                        'description': 'Consider enrollment in clinical trials',
                        'success_rate': 0.45,
                        'side_effects': 'Variable',
                        'duration': 'Variable',
                        'cost_estimate': 'Covered by trial'
                    }
                ]
        
        return treatments
    
    def _generate_protocol(self, patient_data: Dict, risk_score: float) -> Dict:
        """Generate treatment protocol"""
        return {
            'phase': 'initial' if risk_score <= 50 else 'intensive' if risk_score <= 75 else 'aggressive',
            'duration_weeks': 12 if risk_score <= 50 else 24 if risk_score <= 75 else 36,
            'follow_up_frequency': 'monthly' if risk_score <= 50 else 'bi-weekly' if risk_score <= 75 else 'weekly',
            'monitoring_tests': ['blood_work', 'imaging', 'biomarkers']
        }
    
    def _get_monitoring_schedule(self, risk_score: float) -> Dict:
        """Get monitoring schedule based on risk"""
        if risk_score <= 50:
            return {'frequency': 'monthly', 'tests': ['blood_work', 'imaging']}
        elif risk_score <= 75:
            return {'frequency': 'bi-weekly', 'tests': ['blood_work', 'imaging', 'biomarkers']}
        else:
            return {'frequency': 'weekly', 'tests': ['blood_work', 'imaging', 'biomarkers', 'genetic_testing']}
    
    def _predict_outcomes(self, risk_score: float) -> Dict:
        """Predict treatment outcomes"""
        if risk_score <= 50:
            return {
                'survival_rate_5yr': 0.85,
                'response_rate': 0.80,
                'remission_probability': 0.75
            }
        elif risk_score <= 75:
            return {
                'survival_rate_5yr': 0.60,
                'response_rate': 0.65,
                'remission_probability': 0.55
            }
        else:
            return {
                'survival_rate_5yr': 0.35,
                'response_rate': 0.45,
                'remission_probability': 0.40
            }
    
    def _format_recommendations(self, model_output, patient_data: Dict) -> Dict:
        """Format ML model output into recommendations"""
        # This would format the actual model output
        return {
            'risk_score': float(model_output[0]) if isinstance(model_output, (list, np.ndarray)) else float(model_output),
            'recommendations': 'Model-based recommendations'
        }

