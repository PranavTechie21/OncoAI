from app import app, db, User, Patient, Appointment
from datetime import datetime, timedelta
import random
from clinical_data_helpers import generate_clinical_data

DOCTOR_COUNT = 5
PATIENT_COUNT = 20

appointment_types = ["Consultation", "Follow-up", "Treatment", "Lab Visit", "Imaging"]
statuses = ["scheduled", "completed", "cancelled"]
locations = ["Clinic A", "Clinic B", "Telehealth", "Room 201", "Radiology"]


def ensure_doctors():
    doctors = []
    for i in range(1, DOCTOR_COUNT + 1):
        email = f"doctor{i}@example.com"
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, name=f"Dr. Doctor {i}", role='doctor')
            user.set_password("Password123!")
            db.session.add(user)
            db.session.commit()
            print(f"Created doctor: {email}")
        else:
            print(f"Doctor exists: {email}")
        doctors.append(user)
    return doctors


def ensure_patients(doctors):
    patients = []
    for i in range(1, PATIENT_COUNT + 1):
        email = f"patient{i}@example.com"
        patient = Patient.query.filter_by(email=email).first()
        assigned_doc = random.choice(doctors)
        if not patient:
            # generate a simple patient
            name = f"Patient {i}"
            age = random.randint(25, 85)
            gender = random.choice(["male", "female", "other"])
            cancer_type = random.choice(["Lung Cancer", "Breast Cancer", "Colon Cancer", "Prostate Cancer", "Leukemia"]) 
            diagnosis_date = (datetime.utcnow() - timedelta(days=random.randint(30, 1000))).date()

            stage = random.choice(["I","II","III","IV"])
            patient = Patient(
                name=name,
                age=age,
                gender=gender,
                email=email,
                phone=f"+1-555-{1000 + i}",
                cancer_type=cancer_type,
                cancer_subtype=None,
                stage=stage,
                diagnosis_date=diagnosis_date,
                doctor_id=assigned_doc.id,
            )
            # Generate enhanced clinical data for ML model
            clinical_data = generate_clinical_data(cancer_type, stage, age)
            patient.set_clinical_data(clinical_data)
            patient.risk_score = round(random.uniform(10, 90), 1)
            patient.calculate_risk_level()
            patient.set_ml_recommendations({"note": "auto-generated recommendation"})
            patient.set_treatment_protocol({"regimen": "standard", "cycles": random.randint(1,8)})

            db.session.add(patient)
            db.session.commit()
            print(f"Created patient: {email} (doctor {assigned_doc.email})")
        else:
            # ensure patient assigned to a doctor
            if not patient.doctor_id:
                patient.doctor_id = assigned_doc.id
                db.session.commit()
        patients.append(patient)
    return patients


def create_appointments(doctors, patients):
    created = 0
    for p in patients:
        # create 1-3 appointments per patient
        appt_count = random.randint(1, 3)
        for a in range(appt_count):
            appt_date = datetime.utcnow() + timedelta(days=random.randint(-60, 60), hours=random.randint(8, 16))
            appt_type = random.choice(appointment_types)
            status = random.choices(statuses, weights=[60,30,10], k=1)[0]
            location = random.choice(locations)
            notes = f"Auto-seeded appointment ({appt_type}) at {location}."

            # Avoid creating duplicate exact appointments
            exists = Appointment.query.filter_by(patient_id=p.id, doctor_id=p.doctor_id, appointment_date=appt_date).first()
            if exists:
                continue

            appt = Appointment(
                patient_id=p.id,
                doctor_id=p.doctor_id,
                appointment_date=appt_date,
                appointment_type=appt_type.lower(),
                notes=notes,
                status=status
            )
            db.session.add(appt)
            created += 1
    db.session.commit()
    print(f"Created {created} appointments")
    return created


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        doctors = ensure_doctors()
        patients = ensure_patients(doctors)
        created = create_appointments(doctors, patients)

        print('--- Seed Appointments Summary ---')
        print(f'Doctors: {User.query.filter_by(role="doctor").count()}')
        print(f'Patients: {Patient.query.count()}')
        print(f'Appointments: {Appointment.query.count()}')
