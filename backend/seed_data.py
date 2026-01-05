from app import app, db, User, Patient, Appointment, Report
from datetime import datetime, timedelta
from clinical_data_helpers import generate_clinical_data, enhance_existing_clinical_data
import random


def seed():
    with app.app_context():
        db.create_all()

        # Ensure a single demo doctor exists; all sample data is attached to this user.
        demo_email = 'demo@oncoai.com'
        demo_user = User.query.filter_by(email=demo_email).first()
        if not demo_user:
            demo_user = User(
                email=demo_email,
                name='Demo Doctor',
                role='doctor',
            )
            demo_user.set_password('demo123')
            db.session.add(demo_user)
            db.session.commit()
            print(f"Created demo user: {demo_email}")
        else:
            print(f"Demo user exists: {demo_email}")

        # Base sample patients
        patients_data = [
            {
                'name': 'Jane Doe',
                'age': 52,
                'gender': 'female',
                'email': 'jane.doe@example.com',
                'phone': '555-0101',
                'cancer_type': 'Breast Cancer',
                'cancer_subtype': 'HER2+',
                'stage': 'II',
                'diagnosis_date': datetime(2023, 5, 12).date(),
                'clinical_data': generate_clinical_data('Breast Cancer', 'II', 52),
                'risk_score': 42.5,
                'ml_recommendations': {'chemo': True, 'radiation': False},
                'treatment_protocol': {'regimen': 'AC-T', 'cycles': 6}
            },
            {
                'name': 'John Roe',
                'age': 64,
                'gender': 'male',
                'email': 'john.roe@example.com',
                'phone': '555-0202',
                'cancer_type': 'Lung Cancer',
                'cancer_subtype': 'NSCLC',
                'stage': 'III',
                'diagnosis_date': datetime(2022, 11, 3).date(),
                'clinical_data': enhance_existing_clinical_data(
                    {'smoker': True, 'comorbidities': ['COPD']}, 
                    'Lung Cancer', 'III', 64
                ),
                'risk_score': 78.0,
                'ml_recommendations': {'immunotherapy': True},
                'treatment_protocol': {'regimen': 'Carboplatin + Pemetrexed', 'cycles': 4}
            },
            {
                'name': 'Maria Gomez',
                'age': 45,
                'gender': 'female',
                'email': 'maria.gomez@example.com',
                'phone': '555-0303',
                'cancer_type': 'Ovarian Cancer',
                'cancer_subtype': 'Epithelial',
                'stage': 'I',
                'diagnosis_date': datetime(2024, 2, 21).date(),
                'clinical_data': generate_clinical_data('Ovarian Cancer', 'I', 45),
                'risk_score': 33.4,
                'ml_recommendations': {'surgery': True, 'chemo': True},
                'treatment_protocol': {'regimen': 'Paclitaxel + Carboplatin', 'cycles': 3}
            },
            {
                'name': 'Arjun Mehta',
                'age': 39,
                'gender': 'male',
                'email': 'arjun.mehta@example.com',
                'phone': '555-0404',
                'cancer_type': 'Leukemia',
                'cancer_subtype': 'AML',
                'stage': 'II',
                'diagnosis_date': datetime(2023, 7, 15).date(),
                'clinical_data': enhance_existing_clinical_data(
                    {'comorbidities': ['anemia']}, 
                    'Leukemia', 'II', 39
                ),
                'risk_score': 58.9,
                'ml_recommendations': {'chemo': True, 'bone_marrow_biopsy': True},
                'treatment_protocol': {'regimen': 'Cytarabine + Daunorubicin', 'cycles': 4}
            },
            {
                'name': 'Sarah Lee',
                'age': 57,
                'gender': 'female',
                'email': 'sarah.lee@example.com',
                'phone': '555-0505',
                'cancer_type': 'Colorectal Cancer',
                'cancer_subtype': 'Adenocarcinoma',
                'stage': 'II',
                'diagnosis_date': datetime(2022, 4, 9).date(),
                'clinical_data': enhance_existing_clinical_data(
                    {'comorbidities': ['diabetes']}, 
                    'Colorectal Cancer', 'II', 57
                ),
                'risk_score': 61.2,
                'ml_recommendations': {'surgery': True, 'chemo': True},
                'treatment_protocol': {'regimen': 'FOLFOX', 'cycles': 8}
            },
            {
                'name': "Liam O'Connor",
                'age': 70,
                'gender': 'male',
                'email': 'liam.oconnor@example.com',
                'phone': '555-0606',
                'cancer_type': 'Prostate Cancer',
                'cancer_subtype': 'Adenocarcinoma',
                'stage': 'III',
                'diagnosis_date': datetime(2021, 8, 30).date(),
                'clinical_data': enhance_existing_clinical_data(
                    {'comorbidities': ['hypertension', 'ckd_stage2']}, 
                    'Prostate Cancer', 'III', 70
                ),
                'risk_score': 69.5,
                'ml_recommendations': {'radiation': True, 'hormone_therapy': True},
                'treatment_protocol': {'regimen': 'EBRT + ADT', 'cycles': 5}
            },
            {
                'name': 'Chen Wei',
                'age': 48,
                'gender': 'female',
                'email': 'chen.wei@example.com',
                'phone': '555-0707',
                'cancer_type': 'Liver Cancer',
                'cancer_subtype': 'Hepatocellular',
                'stage': 'I',
                'diagnosis_date': datetime(2024, 1, 6).date(),
                'clinical_data': enhance_existing_clinical_data(
                    {'comorbidities': ['hepatitis_b']}, 
                    'Liver Cancer', 'I', 48
                ),
                'risk_score': 41.0,
                'ml_recommendations': {'surgery': True, 'targeted': True},
                'treatment_protocol': {'regimen': 'Sorafenib', 'cycles': 3}
            },
            {
                'name': 'David Kim',
                'age': 33,
                'gender': 'male',
                'email': 'david.kim@example.com',
                'phone': '555-0808',
                'cancer_type': 'Brain Tumor',
                'cancer_subtype': 'Glioblastoma',
                'stage': 'IV',
                'diagnosis_date': datetime(2023, 3, 2).date(),
                'clinical_data': enhance_existing_clinical_data(
                    {'comorbidities': ['seizure_history']}, 
                    'Brain Tumor', 'IV', 33
                ),
                'risk_score': 88.7,
                'ml_recommendations': {'surgery': True, 'radiation': True, 'chemo': True},
                'treatment_protocol': {'regimen': 'Temozolomide + RT', 'cycles': 6}
            }
        ]

        # Add a synthetic batch of 50 diverse patients
        cancer_types = [
            ('Breast Cancer', 'HER2+'),
            ('Lung Cancer', 'NSCLC'),
            ('Prostate Cancer', 'Adenocarcinoma'),
            ('Colorectal Cancer', 'Adenocarcinoma'),
            ('Leukemia', 'AML'),
            ('Liver Cancer', 'Hepatocellular'),
            ('Ovarian Cancer', 'Epithelial'),
            ('Brain Tumor', 'Glioblastoma'),
        ]
        stages = ['I', 'II', 'III', 'IV']

        extra_patients = []
        for i in range(50):
            cancer_type, cancer_subtype = cancer_types[i % len(cancer_types)]
            age = 28 + (i * 3) % 40
            risk_score = round(30 + (i * 3.7) % 70, 1)
            gender = 'female' if i % 2 else 'male'
            name = f"Patient {i+1:02d}"
            email = f"patient{i+1:02d}@example.com"
            stage = stages[i % len(stages)]
            diagnosis_date = datetime(2022 + (i % 3), (i % 12) + 1, ((i * 3) % 27) + 1).date()

            # Generate enhanced clinical data
            clinical_data = generate_clinical_data(cancer_type, stage, age)
            
            extra_patients.append({
                'name': name,
                'age': age,
                'gender': gender,
                'email': email,
                'phone': f"555-{9000 + i}",
                'cancer_type': cancer_type,
                'cancer_subtype': cancer_subtype,
                'stage': stage,
                'diagnosis_date': diagnosis_date,
                'clinical_data': clinical_data,
                'risk_score': risk_score,
                'ml_recommendations': {'chemo': risk_score > 60, 'radiation': risk_score > 70, 'immunotherapy': risk_score > 75},
                'treatment_protocol': {'regimen': 'Standard Care', 'cycles': 4 + (i % 3)}
            })

        patients_data.extend(extra_patients)

        created_patients = []
        for p in patients_data:
            patient = Patient.query.filter_by(email=p['email']).first()
            if not patient:
                patient = Patient(
                    name=p['name'],
                    age=p['age'],
                    gender=p['gender'],
                    email=p['email'],
                    phone=p['phone'],
                    cancer_type=p['cancer_type'],
                    cancer_subtype=p.get('cancer_subtype'),
                    stage=p.get('stage'),
                    diagnosis_date=p.get('diagnosis_date'),
                    doctor_id=demo_user.id,
                )
                patient.set_clinical_data(p.get('clinical_data'))
                patient.risk_score = p.get('risk_score', 0.0)
                patient.calculate_risk_level()
                patient.set_ml_recommendations(p.get('ml_recommendations'))
                patient.set_treatment_protocol(p.get('treatment_protocol'))
                db.session.add(patient)
                db.session.commit()
                print(f"Created patient: {p['email']} (doctor: {demo_user.email})")
            else:
                # If patient exists, ensure doctor assignment stays populated
                if not patient.doctor_id:
                    patient.doctor_id = demo_user.id
                    db.session.commit()
                print(f"Patient exists: {p['email']}")
            created_patients.append(patient)

        # Create appointments for patients (at least one per patient)
        for i, patient in enumerate(created_patients):
            appt_date = datetime.utcnow() + timedelta(days=7 * (i % 6 + 1))
            appt = Appointment(
                patient_id=patient.id,
                doctor_id=demo_user.id,
                appointment_date=appt_date,
                appointment_type='follow-up' if i % 2 == 0 else 'consultation',
                notes='Auto-generated appointment from seed script',
                status='scheduled' if i % 3 else 'confirmed'
            )
            db.session.add(appt)
        db.session.commit()
        print(f"Created {len(created_patients)} appointments")

        # Add demo appointments matching the frontend mock data
        if created_patients:
            demo_base_patient = created_patients[0]
            demo_doctor_id = demo_user.id

            demo_appointments = [
                {
                    "when": datetime(2024, 4, 3, 10, 0),
                    "type": "Follow-up",
                    "status": "Scheduled",
                    "notes": "Review treatment progress and adjust medication",
                },
                {
                    "when": datetime(2024, 4, 3, 11, 30),
                    "type": "Treatment",
                    "status": "Scheduled",
                    "notes": "Chemotherapy session - Cycle 5",
                },
                {
                    "when": datetime(2024, 4, 4, 14, 0),
                    "type": "Consultation",
                    "status": "Scheduled",
                    "notes": "Initial consultation for new treatment plan",
                },
                {
                    "when": datetime(2024, 4, 4, 15, 30),
                    "type": "Follow-up",
                    "status": "Completed",
                    "notes": "Patient responded well to treatment",
                },
                {
                    "when": datetime(2024, 4, 5, 9, 0),
                    "type": "Treatment",
                    "status": "Scheduled",
                    "notes": "Immunotherapy session",
                },
            ]

            for demo in demo_appointments:
                appt = Appointment(
                    patient_id=demo_base_patient.id,
                    doctor_id=demo_doctor_id,
                    appointment_date=demo["when"],
                    appointment_type=demo["type"],
                    notes=demo["notes"],
                    status=demo["status"],
                )
                db.session.add(appt)
            db.session.commit()
            print("Created demo appointments matching frontend mock data")

        # Create sample reports for first 10 patients
        for patient in created_patients[:10]:
            rpt = Report(
                patient_id=patient.id,
                doctor_id=patient.doctor_id,
                report_type='lab_results'
            )
            rpt.set_report_data({
                'hemoglobin': 12.0 + (patient.id % 3),
                'wbc': 5.5 + (patient.id % 2),
                'platelets': 200 + (patient.id % 40)
            })
            db.session.add(rpt)
        db.session.commit()
        print("Created sample reports for first 10 patients")

        # Summary
        user_count = User.query.count()
        patient_count = Patient.query.count()
        appt_count = Appointment.query.count()
        report_count = Report.query.count()

        print('--- Seed Summary ---')
        print(f'Users: {user_count}')
        print(f'Patients: {patient_count}')
        print(f'Appointments: {appt_count}')
        print(f'Reports: {report_count}')


if __name__ == '__main__':
    seed()
