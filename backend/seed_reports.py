from app import app, db, Patient, Report
from datetime import datetime
import random

REPORT_TYPES = ['lab_results', 'imaging', 'pathology', 'treatment_summary', 'comprehensive']

LAB_RANGES = {
    'hemoglobin': (10.0, 16.0),
    'wbc': (3.5, 11.0),
    'platelets': (150, 400),
    'creatinine': (0.6, 1.3),
}


def sample_lab_values():
    return {
        'hemoglobin': round(random.uniform(*LAB_RANGES['hemoglobin']), 1),
        'wbc': round(random.uniform(*LAB_RANGES['wbc']), 1),
        'platelets': random.randint(*LAB_RANGES['platelets']),
        'creatinine': round(random.uniform(*LAB_RANGES['creatinine']), 2),
    }


def ensure_reports():
    created = 0
    with app.app_context():
        patients = Patient.query.all()
        for p in patients:
            # Skip if a 'comprehensive' report already exists for this patient
            exists = Report.query.filter_by(patient_id=p.id, report_type='comprehensive').first()
            if exists:
                continue

            report_type = 'comprehensive'
            report_payload = {
                'patient': p.to_dict(),
                'lab_results': sample_lab_values(),
                'imaging_summary': 'No acute findings' if random.random() > 0.3 else 'Suspicious lesion noted',
                'pathology_summary': 'Biopsy consistent with malignancy' if random.random() > 0.5 else 'Benign findings',
                'risk_assessment': {
                    'score': round(p.risk_score or 0, 1),
                    'level': p.risk_level or 'unknown'
                },
                'recommendations': p.get_ml_recommendations() if hasattr(p, 'get_ml_recommendations') else {},
                'generated_at': datetime.utcnow().isoformat()
            }

            rpt = Report(
                patient_id=p.id,
                doctor_id=p.doctor_id or p.doctor_id,
                report_type=report_type,
            )
            try:
                rpt.set_report_data(report_payload)
            except Exception:
                # Fallback to stringified JSON if setter expects string
                import json
                rpt.report_data = json.dumps(report_payload)

            db.session.add(rpt)
            created += 1

        db.session.commit()

        total_reports = Report.query.count()
        print(f"Created {created} new comprehensive reports")
        print(f"Total reports in DB: {total_reports}")

    return created


if __name__ == '__main__':
    ensure_reports()
