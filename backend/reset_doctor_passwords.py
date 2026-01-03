"""
Reset all doctor passwords to a common known password for testing purposes.
This script lists all doctors and resets their passwords to 'password123'
"""
from app import app, db, User

def list_and_reset_doctor_passwords(new_password='password123'):
    """List all doctors and reset their passwords"""
    with app.app_context():
        # Get all doctors
        doctors = User.query.filter_by(role='doctor').all()
        
        print(f"\n{'='*80}")
        print(f"Found {len(doctors)} doctor(s) in the database")
        print(f"{'='*80}\n")
        
        if not doctors:
            print("No doctors found in the database.")
            return
        
        print("Doctor Users:")
        print("-" * 80)
        print(f"{'ID':<5} | {'Email':<30} | {'Name':<25} | {'Password Reset'}")
        print("-" * 80)
        
        for doctor in doctors:
            # Reset password
            doctor.set_password(new_password)
            db.session.add(doctor)
            
            print(f"{doctor.id:<5} | {doctor.email:<30} | {doctor.name[:25]:<25} | [RESET]")
        
        # Commit all password changes
        db.session.commit()
        
        print("-" * 80)
        print(f"\n[SUCCESS] Successfully reset passwords for {len(doctors)} doctor(s)")
        print(f"\nLogin Credentials:")
        print(f"{'='*80}")
        for doctor in doctors:
            print(f"  Email: {doctor.email}")
            print(f"  Password: {new_password}")
            print()
        print(f"{'='*80}")
        print(f"\n[NOTE] All doctor passwords have been reset to '{new_password}'")
        print("   You can now login with any doctor's email and this password.\n")


if __name__ == '__main__':
    list_and_reset_doctor_passwords()

