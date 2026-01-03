"""Verify that all users have required fields populated"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'instance', 'oncoai.db')
if not os.path.exists(DB_PATH):
    DB_PATH = os.path.join(os.path.dirname(__file__), 'oncoai.db')

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute('SELECT COUNT(*) FROM users')
total = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM users WHERE specialty IS NOT NULL AND specialty != '' AND license IS NOT NULL AND license != ''")
filled = cursor.fetchone()[0]

print(f'Total users: {total}')
print(f'Users with required fields (specialty, license): {filled}')
print()

cursor.execute('SELECT id, email, name, specialty, license, phone, npi, institution, department, subspecialty FROM users')
rows = cursor.fetchall()

print('All users:')
print('ID | Email | Name | Specialty | License | Phone | NPI | Institution | Department | Subspecialty')
print('-' * 120)
for r in rows:
    print(f'{r[0]} | {r[1]} | {r[2]} | {r[3] or "N/A"} | {r[4] or "N/A"} | {r[5] or "N/A"} | {r[6] or "N/A"} | {r[7] or "N/A"} | {r[8] or "N/A"} | {r[9] or "N/A"}')

conn.close()


