"""
Migration script to add missing columns to users table and populate data for existing users.
This script adds: phone, institution, department, license, npi, specialty, subspecialty, avatar_url
"""
import sqlite3
import os
from datetime import datetime

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'instance', 'oncoai.db')

# If instance directory doesn't exist, try alternative path
if not os.path.exists(DB_PATH):
    DB_PATH = os.path.join(os.path.dirname(__file__), 'oncoai.db')

def migrate_database():
    """Add missing columns to users table"""
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return False
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Get current columns
        cursor.execute('PRAGMA table_info(users)')
        existing_columns = [col[1] for col in cursor.fetchall()]
        print(f"Existing columns: {existing_columns}")
        
        # Columns to add
        columns_to_add = {
            'phone': 'VARCHAR(50)',
            'institution': 'VARCHAR(200)',
            'department': 'VARCHAR(200)',
            'license': 'VARCHAR(100)',
            'npi': 'VARCHAR(50)',
            'specialty': 'VARCHAR(200)',
            'subspecialty': 'VARCHAR(200)',
            'avatar_url': 'VARCHAR(400)'
        }
        
        # Add missing columns
        for column_name, column_type in columns_to_add.items():
            if column_name not in existing_columns:
                try:
                    cursor.execute(f'ALTER TABLE users ADD COLUMN {column_name} {column_type}')
                    print(f"[OK] Added column: {column_name}")
                except sqlite3.OperationalError as e:
                    print(f"[ERROR] Error adding column {column_name}: {e}")
            else:
                print(f"- Column {column_name} already exists")
        
        conn.commit()
        print("\n[OK] Migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"[ERROR] Migration failed: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()


def populate_user_data():
    """Populate required fields for existing users"""
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return False
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Get all users
        cursor.execute('SELECT id, email, name, role FROM users')
        users = cursor.fetchall()
        
        if not users:
            print("No users found in database")
            return True
        
        print(f"\nFound {len(users)} user(s) to update")
        
        # Default data based on user email/name
        default_data = {
            'demo@oncoai.com': {
                'phone': '+1 (555) 123-4567',
                'institution': 'Memorial Cancer Center',
                'department': 'Oncology Department',
                'license': 'MD-12345678',
                'npi': '1234567890',
                'specialty': 'Medical Oncology',
                'subspecialty': 'Breast & Thoracic Oncology'
            }
        }
        
        updated_count = 0
        for user_id, email, name, role in users:
            # Use defaults if available, otherwise generate based on name/email
            user_defaults = default_data.get(email, {})
            
            # Generate defaults if not in dictionary
            if not user_defaults:
                # Extract first name for personalization
                first_name = name.split()[0] if name else 'Doctor'
                user_defaults = {
                    'phone': '+1 (555) 123-4567',
                    'institution': f'{first_name} Cancer Center',
                    'department': 'Oncology Department',
                    'license': f'MD-{str(user_id).zfill(8)}',
                    'npi': str(1234567890 + user_id),
                    'specialty': 'Medical Oncology',
                    'subspecialty': 'General Oncology'
                }
            
            # Update user with defaults only if fields are NULL
            updates = []
            params = []
            
            for field, default_value in user_defaults.items():
                cursor.execute(f'SELECT {field} FROM users WHERE id = ?', (user_id,))
                current_value = cursor.fetchone()[0]
                
                if current_value is None or current_value == '':
                    updates.append(f'{field} = ?')
                    params.append(default_value)
            
            if updates:
                params.append(user_id)
                update_query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
                cursor.execute(update_query, params)
                print(f"[OK] Updated user {email} ({name}) with: {', '.join([u.split('=')[0].strip() for u in updates])}")
                updated_count += 1
            else:
                print(f"[SKIP] User {email} ({name}) already has all fields populated")
        
        conn.commit()
        print(f"\n[OK] Updated {updated_count} user(s)")
        return True
        
    except Exception as e:
        print(f"[ERROR] Population failed: {e}")
        import traceback
        traceback.print_exc()
        conn.rollback()
        return False
    finally:
        conn.close()


if __name__ == '__main__':
    print("=" * 60)
    print("Database Migration Script")
    print("=" * 60)
    print(f"Database path: {DB_PATH}")
    print()
    
    # Step 1: Migrate schema
    print("Step 1: Adding missing columns to users table...")
    if migrate_database():
        print()
        # Step 2: Populate user data
        print("Step 2: Populating user data...")
        populate_user_data()
        print()
        print("=" * 60)
        print("[OK] Migration and data population completed!")
        print("=" * 60)
    else:
        print("[ERROR] Migration failed. Please check the error messages above.")

