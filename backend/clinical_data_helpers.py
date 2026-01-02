"""
Helper functions for generating realistic clinical data for patients
"""

import random

# Common cancer mutations and biomarkers by cancer type
MUTATIONS_BY_CANCER = {
    "Lung Cancer": ["EGFR", "ALK", "KRAS", "BRAF", "ROS1", "MET"],
    "Breast Cancer": ["BRCA1", "BRCA2", "HER2", "PIK3CA", "TP53", "ESR1"],
    "Colon Cancer": ["KRAS", "BRAF", "PIK3CA", "APC", "TP53", "MSH2"],
    "Colorectal Cancer": ["KRAS", "BRAF", "PIK3CA", "APC", "TP53", "MSH2"],
    "Prostate Cancer": ["TP53", "PTEN", "AR", "RB1", "TMPRSS2"],
    "Leukemia": ["FLT3", "NPM1", "CEBPA", "IDH1", "IDH2", "DNMT3A"],
    "Ovarian Cancer": ["BRCA1", "BRCA2", "TP53", "KRAS", "PIK3CA"],
    "Liver Cancer": ["TP53", "CTNNB1", "TERT", "ARID1A"],
    "Brain Tumor": ["IDH1", "TP53", "ATRX", "EGFR"],
    "Other": ["TP53", "KRAS", "PIK3CA"]
}


def generate_clinical_data(cancer_type: str, stage: str = "II", age: int = 50) -> dict:
    """
    Generate realistic clinical data structure for a patient
    
    Args:
        cancer_type: Type of cancer
        stage: Cancer stage (I, II, III, IV)
        age: Patient age
        
    Returns:
        Dictionary with structured clinical data
    """
    # Get mutations based on cancer type
    available_mutations = MUTATIONS_BY_CANCER.get(cancer_type, MUTATIONS_BY_CANCER["Other"])
    
    # Determine targetable mutation based on available mutations
    targetable_mutation = random.choice([True, False])
    if targetable_mutation:
        num_mutations = random.randint(1, min(3, len(available_mutations)))
        mutations = random.sample(available_mutations, num_mutations)
    else:
        mutations = []
    
    # Comorbidity score: higher for older patients and advanced stages
    base_comorbidity = 0.2 if age < 50 else 0.4
    stage_multiplier = {"I": 0.0, "II": 0.1, "III": 0.2, "IV": 0.3}.get(stage, 0.1)
    comorbidity_score = round(min(0.9, base_comorbidity + stage_multiplier + random.uniform(-0.1, 0.2)), 2)
    
    # Generate genomics data
    genomics = {
        "mutations": mutations,
        "biomarkers": {
            "PD-L1": random.randint(0, 100),  # Percentage expression
            "TMB": round(random.uniform(0, 25), 1),  # Tumor Mutational Burden
            "MSI_Status": random.choice(["MSS", "MSI-H", "MSI-L"])
        }
    }
    
    # Generate histopathology data
    grade_options = ["G1", "G2", "G3", "G4"]
    # Higher stages tend to have higher grades
    grade_weights = {"I": [0.4, 0.4, 0.2, 0.0], "II": [0.2, 0.5, 0.3, 0.0], 
                     "III": [0.1, 0.3, 0.5, 0.1], "IV": [0.0, 0.2, 0.5, 0.3]}
    weights = grade_weights.get(stage, [0.25, 0.25, 0.25, 0.25])
    grade = random.choices(grade_options, weights=weights)[0]
    
    histopathology = {
        "grade": grade,
        "ki67": random.randint(5, 80),  # Ki-67 proliferation index
        "tumor_size_cm": round(random.uniform(1.0, 12.0), 1),
        "lymph_nodes_involved": random.randint(0, 20) if stage in ["III", "IV"] else random.randint(0, 5)
    }
    
    # Additional clinical data
    comorbidities_list = ["hypertension", "diabetes", "heart_disease", "copd", "ckd_stage2"]
    num_comorbidities = random.choices([0, 1, 2, 3], weights=[0.3, 0.4, 0.2, 0.1])[0]
    comorbidities = random.sample(comorbidities_list, num_comorbidities)
    
    # Build complete clinical data structure
    clinical_data = {
        # Required for ML model
        "targetable_mutation": targetable_mutation,
        "comorbidity_score": comorbidity_score,
        
        # Genomics data
        "genomics": genomics,
        
        # Histopathology
        "histopathology": histopathology,
        
        # Additional clinical data
        "height_cm": random.randint(150, 190),
        "weight_kg": random.randint(50, 100),
        "smoker": random.choice([True, False]),
        "comorbidities": comorbidities,
        
        # Treatment history (empty for new patients)
        "treatment_history": [],
        
        # Outcomes tracking (empty for new patients)
        "outcomes": []
    }
    
    return clinical_data


def enhance_existing_clinical_data(existing_data: dict, cancer_type: str, stage: str = "II", age: int = 50) -> dict:
    """
    Enhance existing clinical_data dict with new structure while preserving existing fields
    
    Args:
        existing_data: Existing clinical_data dictionary
        cancer_type: Type of cancer
        stage: Cancer stage
        age: Patient age
        
    Returns:
        Enhanced clinical_data dictionary
    """
    # Generate new structured data
    new_data = generate_clinical_data(cancer_type, stage, age)
    
    # Merge with existing data (existing takes precedence for overlapping simple fields)
    # But preserve existing genomics/histopathology if present
    if "genomics" in existing_data:
        new_data["genomics"].update(existing_data["genomics"])
    if "histopathology" in existing_data:
        new_data["histopathology"].update(existing_data["histopathology"])
    
    # Update with existing simple fields
    for key in ["height_cm", "weight_kg", "smoker", "comorbidities", "notes"]:
        if key in existing_data:
            new_data[key] = existing_data[key]
    
    # Ensure required ML model fields exist
    if "targetable_mutation" not in existing_data:
        new_data["targetable_mutation"] = bool(new_data.get("genomics", {}).get("mutations", []))
    else:
        new_data["targetable_mutation"] = existing_data["targetable_mutation"]
    
    if "comorbidity_score" not in existing_data:
        # Keep generated one
        pass
    else:
        new_data["comorbidity_score"] = existing_data["comorbidity_score"]
    
    return new_data






